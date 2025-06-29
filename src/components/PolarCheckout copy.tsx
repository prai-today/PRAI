import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import { useState, useEffect } from 'react';
import { CreditCard, Sparkles, Zap } from 'lucide-react';

interface PolarCheckoutProps {
  variant?: 'button' | 'card';
  className?: string;
  onSuccess?: () => void;
  userEmail?: string;
  userId?: string;
}

export function PolarCheckout({
  variant = 'button',
  className = '',
  onSuccess,
  userEmail,
  userId,
}: PolarCheckoutProps) {
  const [checkoutInstance, setCheckoutInstance] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clean up checkout instance on unmount
  useEffect(() => {
    return () => {
      if (
        checkoutInstance &&
        typeof checkoutInstance === 'object' &&
        checkoutInstance !== null &&
        'close' in checkoutInstance
      ) {
        (checkoutInstance as { close: () => void }).close();
      }
    };
  }, [checkoutInstance]);

  const handleCheckout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Create checkout URL with customer email and user ID in metadata
      let checkoutUrl =
        'https://buy.polar.sh/polar_cl_vJI1V2Qke1U85aI6Vs2Rdy6KlolklPQiIQifN2bVPz0';

      // Build query parameters
      const params = new URLSearchParams();

      // Pre-fill customer email if available
      if (userEmail) {
        params.append('customer_email', userEmail);
      }

      // Use reference_id to store user ID (officially supported by Polar)
      if (userId) {
        params.append('reference_id', userId);
      }

      if (params.toString()) {
        checkoutUrl += `?${params.toString()}`;
      }

      console.log('Checkout URL details:', {
        userEmail,
        userId,
        params: params.toString(),
        fullUrl: checkoutUrl,
      });

      const checkout = await PolarEmbedCheckout.create(checkoutUrl, 'light');

      setCheckoutInstance(checkout);

      checkout.addEventListener('success', (event: CustomEvent) => {
        // Track successful purchase
        console.log('Payment successful:', event.detail);

        // Handle success in your app
        if (onSuccess) {
          onSuccess();
        }

        // Show success message
        alert('Payment completed! Credits will be added to your account soon.');

        if (!event.detail.redirect) {
          // Refresh the page to update credits
          window.location.reload();
        }
      });

      checkout.addEventListener('close', () => {
        // Clean up our reference when checkout is closed
        setCheckoutInstance(null);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Failed to open checkout', error);
      alert(
        'An error occurred while opening the payment window. Please try again.'
      );
      setIsLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div
        className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 ${className}`}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Purchase PRAI Credits
          </h3>

          <p className="text-gray-600 mb-4 text-sm">
            Purchase additional credits for more
            <br />
            online PR and AI optimization
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">PRAI Credits</span>
              <span className="text-lg font-bold text-indigo-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-lg font-bold text-gray-900">$6.9</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Opening payment window...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Purchase Credits</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Secure payments processed by Polar
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:via-purple-700 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Opening payment window...</span>
        </>
      ) : (
        <>
          <Zap className="w-4 h-4" />
          <span>Buy Credits</span>
        </>
      )}
    </button>
  );
}
