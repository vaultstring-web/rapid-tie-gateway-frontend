# VaultString Payment Gateway - # Rapid Tie Payment Gateway - Frontend Development Guide

Welcome to the **Rapid Tie Payment Gateway** frontend development team! This guide will help you set up your development environment and understand our design system.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd vaultstring-payment-gateway

2. **Install dependencies**
    pnpm install 

3. **Set up environment variables**
bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
Run development server

bash
npm run dev
Open http://localhost:3000

Project Structure
text
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public routes (no auth)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── merchant/       # Merchant dashboard
│   │   ├── organizer/      # Event organizer dashboard
│   │   ├── employee/       # DSA employee dashboard
│   │   ├── approver/       # DSA approver dashboard
│   │   ├── finance/        # Finance officer dashboard
│   │   ├── admin/          # System admin dashboard
│   │   └── compliance/     # Compliance dashboard
│   └── api/                 # API routes (if needed)
│
├── components/              # Reusable components
│   ├── ui/                  # Basic UI components
│   ├── layout/              # Layout components
│   ├── forms/               # Form components
│   ├── tables/              # Table components
│   ├── charts/              # Chart components
│   ├── cards/               # Card components
│   ├── modals/              # Modal components
│   └── features/            # Feature-specific components
│       ├── merchant/
│       ├── organizer/
│       ├── employee/
│       ├── approver/
│       ├── finance/
│       ├── admin/
│       ├── events/
│       ├── payments/
│       └── dsa/
│
├── lib/                      # Utilities and configurations
│   ├── api/                  # API client
│   ├── auth/                 # Auth configuration
│   ├── validation/           # Zod schemas
│   ├── utils/                # Helper functions
│   ├── constants/            # Constants
│   └── hooks/                # Custom hooks
│
├── services/                 # API service layers
│   ├── auth/
│   ├── merchant/
│   ├── organizer/
│   ├── employee/
│   ├── finance/
│   ├── admin/
│   └── events/
│
├── stores/                   # Zustand stores
├── types/                    # TypeScript types
├── hooks/                    # React hooks
│   ├── queries/              # React Query hooks
│   ├── mutations/            # Mutation hooks
│   └── events/               # Event-related hooks
│
└── styles/                   # Global styles


Available Scripts
Command	     Description
npm run dev--	Start development server
npmrun build--	Build for production
npm run start	Start production server
npm run lint	Run ESLint
npm run format	Format with Prettier
npm run type-check	Check TypeScript types
npm test	Run Jest tests
npm run test:coverage	Run tests with coverage
npm run cypress:open	Open Cypress

*Step 9: Verify Installation*
bash
# Check that the development server is running
curl http://localhost:3000

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (if any written)
npm test