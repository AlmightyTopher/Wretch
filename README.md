# wretched-designs

This project is a **Next.js 15** application that powers the Wretched Designs
website. It uses Tailwind CSS for styling and integrates Firebase and Stripe for
backend services.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Fill out the environment variables in `.env.local`. The repository provides a
   file with all required keys; replace the placeholder values with your own
   credentials:

   ```text
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...

   FIREBASE_PROJECT_ID=your-firebase-project
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@example.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

   NEXT_PUBLIC_FIREBASE_API_KEY=your-client-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   ```

### Development

Run the development server:

```bash
npm run dev
```

The app listens on **http://localhost:3000**.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

The production server uses the same port (3000) by default.
