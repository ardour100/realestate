# Real Estate Platform

A modern, full-stack real estate platform built with Next.js, enabling users to browse, list, and manage property listings with advanced search capabilities and interactive features.

## Features

- **Property Listings**: Browse and search properties with advanced filtering options
- **Property Details**: Comprehensive property information with image galleries and map integration
- **User Authentication**: Secure authentication system with role-based access control
- **Property Management**: Create, edit, and manage property listings
- **Appointment Booking**: Schedule property viewings with automated notifications
- **Favorites & Compare**: Save favorite properties and compare multiple listings
- **Interactive Maps**: Location-based search with Google Maps integration
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Server-side rendering and metadata optimization

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) - React framework with server-side rendering
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

### Services & APIs
- **Image Storage**: [Cloudinary](https://cloudinary.com/) / [AWS S3](https://aws.amazon.com/s3/) - Cloud-based image storage
- **Maps**: [Google Maps API](https://developers.google.com/maps) - Location services and mapping

### Deployment
- **Platform**: [Vercel](https://vercel.com/) - Deployment and hosting platform

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn or pnpm
- PostgreSQL database
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/realestate.git
cd realestate
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# AWS S3 (alternative to Cloudinary)
# AWS_ACCESS_KEY_ID="your-aws-access-key"
# AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET_NAME="your-bucket-name"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
realestate/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── shared/           # Shared components
├── lib/                   # Utility functions and configurations
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static files
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Key Features Implementation

### Authentication
- Email/password authentication
- Social login (Google, GitHub, etc.)
- Role-based access (User, Agent, Admin)
- Protected routes and API endpoints

### Property Management
- CRUD operations for properties
- Image upload and optimization
- Advanced search and filtering
- Pagination and sorting

### User Features
- User profiles
- Saved searches
- Favorite properties
- Property comparison
- Appointment scheduling

### Admin Dashboard
- User management
- Property approval workflow
- Analytics and reports
- Content moderation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Database Hosting

Consider using:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

## Environment Configuration

Ensure all environment variables are properly set in your production environment:
- Database connection string
- Authentication secrets
- API keys for third-party services
- Cloud storage credentials

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@realestate.com or open an issue in the repository.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

Built with ❤️ using Next.js and TypeScript
