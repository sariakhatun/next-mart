```markdown
# Next-Mart – Minimal E-Commerce Website

# live link : https://y-pink-kappa.vercel.app/

A modern, responsive e-commerce web application built with **Next.js 16 (App Router)**, **TypeScript**, **NextAuth.js**, **Tailwind CSS**, and integrated with **SSLCommerz** payment gateway (Bangladesh).

This project demonstrates real-world e-commerce features with a strong focus on clean UI/UX, Next.js best practices, authentication, protected routes, cart management, and secure payment flow.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwind-css)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![SSLCommerz](https://img.shields.io/badge/SSLCommerz-Payment_Gateway-red)

## Live Demo
[https://y-pink-kappa.vercel.app/](https://y-pink-kappa.vercel.app/) 

## Features

### Public Pages
- Home page (`/`)
- Product listing (`/products`)
- Product details (`/products/[id]`)
- Login page (`/login`)

### Authentication (NextAuth.js)
- Google OAuth login
- Session persistence
- Protected routes: `/cart`, `/checkout`, `/profile`
- Redirect unauthenticated users to login

### Product Browsing
- Grid layout with product cards
- Product image, name, price, stock status
- Add to Cart & View Details buttons
- Detailed product page with image gallery, description, quantity selector

### Cart Management
- Client-side cart using Context API
- Add / remove / update quantity
- Quantity limited by available stock
- Cart persists in `mongodb`
- Cart icon with item count in navbar

### Checkout & Payment (SSLCommerz)
- Order summary & shipping form
- Auto-fill name/email from authenticated session
- Initiate payment via `/api/payment/init`
- Redirect to SSLCommerz hosted payment page (sandbox/live)
- Handle success, fail, cancel, and IPN callbacks
- Save confirmed orders to MongoDB
- Clear cart on successful payment

### User Profile (Protected)
- Display user info (name, email, photo)
- View order history
- Logout option

### UI/UX
- Minimalist, clean, fully responsive design
- Loading states & error handling
- Toast notifications (SweetAlert2)
- SEO-friendly with Next.js metadata

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Framework          | Next.js 16 (App Router)             |
| Language           | TypeScript                          |
| Styling            | Tailwind CSS                        |
| Authentication     | NextAuth.js                         |
| Database           | MongoDB Atlas                       |
| Payment Gateway    | SSLCommerz (sandbox/live)           |
| State Management   | React Context API                   |
| Notifications      | SweetAlert2                         |

## Project Structure

```
src/
├── app/
│   ├── (routes)
│   │   ├── /                   → Home
│   │   ├── products/           → Listing & [id] details
│   │   ├── cart/               → Cart page (protected)
│   │   ├── checkout/           → Checkout & payment
│   │   ├── profile/            → User profile (protected)
│   │   ├── login/              → Login
│   │   └── api/
│   │       ├── auth/[...nextauth]/ → NextAuth config
│   │       └── payment/
│   │           ├── init/       → Initiate payment
│   │           ├── success/    → Success callback + save order
│   │           ├── fail/       → Fail callback
│   │           ├── cancel/     → Cancel callback
│   │           └── ipn/        → IPN (background notification)
│   └── layout.tsx              → Root layout with SessionProvider
├── components/                     → Reusable UI components
├── context/                        → CartContext
├── lib/                            → dbConnect, utilities
├── types/                          → TypeScript interfaces (Product, CartItem, etc.)
└── public/                         → Images, icons
```

## Environment Variables

Create `.env.local` file:

```env
# MongoDB
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/
DB_NAME=ProductDB

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# SSLCommerz (Sandbox for testing)
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> For production: Use real SSLCommerz credentials and set `SSLCOMMERZ_IS_LIVE=true`, `NEXT_PUBLIC_BASE_URL=https://y-pink-kappa.vercel.app/`

## Setup & Run Locally

```bash
# Clone the repo
git clone https://github.com/sariakhatun/next-mart
cd next-mart

# Install dependencies
npm install

# Create .env.local (see above)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Recommended: **Vercel** (optimal for Next.js)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add all environment variables in Vercel project settings
4. Deploy!

## SSLCommerz Sandbox Testing

Use these test card details on payment page:

- Card Number: `1111111111111111`
- Expiry: Any future date
- CVC: `111`
- OTP: `123456` (if prompted)

## Future Enhancements (Optional)

- Wishlist
- Product search & filtering
- Dark mode
- Infinite scrolling / pagination
- Animations with Framer Motion
- Email order confirmation

## License

MIT License – feel free to use for learning or portfolio.

---

**Built with ❤️ using Next.js & Tailwind CSS**
```