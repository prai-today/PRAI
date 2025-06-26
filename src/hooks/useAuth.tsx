import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    if (data) {
      setProfile(data);
    } else {
      // Profile doesn't exist, create one using upsert to handle race conditions
      // For Google users, we need to ensure they have a full name
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
      
      const { data: upsertedProfile, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          avatar_url: user.user_metadata?.avatar_url || null,
          free_publications_remaining: 1
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();
      
      if (upsertError) {
        console.error('Error creating/updating profile:', upsertError);
        // If upsert fails, try to fetch the existing profile
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (existingProfile) {
          setProfile(existingProfile);
        }
      } else if (upsertedProfile) {
        setProfile(upsertedProfile);
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle successful sign in
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in successfully');
          
          // Check for stored redirect URL
          const storedRedirectUrl = localStorage.getItem('auth_redirect_url');
          if (storedRedirectUrl) {
            localStorage.removeItem('auth_redirect_url');
            // Small delay to ensure the user state is set
            setTimeout(() => {
              window.location.href = storedRedirectUrl;
            }, 100);
          } else {
            // Default redirect to dashboard
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 100);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const signInWithGoogle = async () => {
    console.log('Initiating Google sign in...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        }
      }
    });
    
    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!fullName.trim()) {
      throw new Error('Full name is required for account creation.');
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    });
    
    if (error) throw error;
    
    // Profile creation is handled by refreshProfile when the user state changes
    // No need to create profile here to avoid duplicate key constraint violations
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}