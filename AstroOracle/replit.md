# Jai Guru Astro Remedy

## Overview

This is a comprehensive astrology consultation platform built for Astrologer Arup Shastri's personal business. The application offers video/audio/chat consultations, astrology courses, and product sales through a modern web interface with neon glow and glassmorphism design aesthetics. The platform supports multi-language functionality and features a cosmic-themed animated background throughout the user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Styling**: Tailwind CSS with custom neon glow and glassmorphism components
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **Design System**: Custom neon-themed components (NeonButton, GlassCard) with cosmic animated backgrounds

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Real-time Communication**: WebSocket integration for live chat functionality
- **API Design**: RESTful API endpoints with comprehensive CRUD operations

### Database Schema
- **Users**: Authentication, profile data, birth details for astrological readings
- **Consultations**: Booking system for video/audio/chat/in-person sessions
- **Courses**: Educational content management with enrollment tracking
- **Products**: E-commerce functionality for astrological remedies
- **Orders**: Purchase management and order tracking
- **Chat Messages**: Real-time messaging system for consultations
- **Notifications**: In-app notification system
- **Audit Logs**: System activity tracking for security

### Authentication & Authorization
- **Multi-factor Authentication**: Phone number verification with OTP
- **Role-based Access**: Admin and client user roles with different permissions
- **Session Management**: JWT tokens with secure storage and validation
- **Account Recovery**: Multiple identifier support (phone, email, government ID)

### Communication Features
- **Video Consultations**: Jitsi Meet integration for secure video calls
- **Audio Consultations**: Built-in voice call functionality
- **Chat System**: Real-time messaging with file sharing capabilities
- **Notifications**: Automated in-app messages and transactional communications

### Internationalization
- **Multi-language Support**: Comprehensive language support including Hindi, Bengali, and major global languages
- **Default Language**: English with dynamic language switching
- **Localized Content**: UI translations and region-specific formatting

## External Dependencies

### Payment Processing
- **Domestic Payments**: Razorpay and Cashfree for Indian transactions
- **International Payments**: Stripe and PayPal for global transactions
- **Payment Security**: Secure payment flow with status tracking

### Communication Services
- **Video Conferencing**: Jitsi Meet for free video consultations
- **SMS Services**: Twilio for OTP verification and transactional messaging
- **Email Services**: Amazon SES for automated email notifications

### Database & Hosting
- **Database**: PostgreSQL with Neon Database serverless hosting
- **Application Hosting**: Vercel for serverless deployment
- **Domain**: Custom domain (jaiguruastroremedy.com) integration

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Code Quality**: TypeScript for type safety and ESLint for code standards
- **Version Control**: Git-based workflow with modern development practices

### Additional APIs
- **Geolocation**: Free geolocation APIs for user location services
- **Timezone Management**: IANA timezone database for consultation scheduling
- **Content Generation**: Gemini API integration for content assistance