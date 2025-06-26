# PRAI - PR AI Agent

PRAI is an open-source web application that helps indie builders, SMB owners, and startup founders easily get their products or companies recognized by AI and search engines through intelligent content generation and automatic publication.

## 🚀 Features

- **AI Website Analysis**: Automatically analyzes your website content to understand your product
- **Smart Publishing**: Automatically publishes articles about your product to multiple high-quality sites
- **Real-time Tracking**: Monitor publication status and see where your content is being published
- **Free Credits**: Get 1 free publication credit when signing up with Google Auth

## 🛠 Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **Publishing**: Publast API for content generation and distribution
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Publast API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prai-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PUBLAST_API_KEY`: Your Publast API key

4. Set up the database:
   - Run the migration in `supabase/migrations/create_schema.sql`
   - Set up Google OAuth in Supabase Auth settings

5. Start the development server:
```bash
npm run dev
```

## 🗄 Database Schema

The application uses three main tables:

- **profiles**: Extended user profiles with publication credits
- **publast_sites**: Cache of available publication sites from Publast
- **publications**: Track publication jobs and their status

## 🔧 Edge Functions

- **analyze-website**: Analyzes website content and generates initial understanding
- **create-publication**: Creates publications and calls Publast API
- **publication-status**: Fetches real-time publication status

## 🎯 User Flow

1. **Landing**: User enters their website URL
2. **Authentication**: Sign up/in (Google Auth gets 1 free credit)
3. **Analysis**: AI analyzes the website content
4. **Publication**: System automatically generates and publishes articles
5. **Tracking**: Real-time status updates on publication progress

## 🔐 Authentication

- Google OAuth (provides 1 free publication credit)
- Email/Password authentication
- Row Level Security (RLS) enabled on all tables

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎨 Design System

- **Primary**: Indigo (#6366f1)
- **Secondary**: Teal (#06b6d4)
- **Accent**: Orange (#f59e0b)
- **Typography**: Modern, readable fonts with excellent hierarchy
- **Components**: Clean cards, smooth animations, hover states

## 🚀 Deployment

The application can be deployed to any platform that supports:
- Node.js/React applications
- Supabase integration
- Environment variables

Popular options include:
- Netlify
- Vercel
- AWS Amplify

## 📝 Environment Variables

### Frontend (Vite)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend (Supabase Edge Functions)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLAST_API_KEY`
- `PUBLAST_BASE_URL`

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Add your chosen license here]

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the Publast API guide in the project files

---

Built with ❤️ for indie builders, SMB owners, and startup founders who want their products recognized by AI.