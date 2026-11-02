# HopeHarbor — Community Social Development & Events Platform

> **Live Application URL**: [https://hopeharbor.vercel.app](https://hope-harbor-client-eight.vercel.app) *(Update with your deployed Vercel link)*  
> **Server API Endpoint**: [https://hopeharbor-server.onrender.com](https://hope-harbor-server.vercel.app) *(Update with your deployed Render link)*

---

## 🌟 About HopeHarbor

**HopeHarbor** is a grassroots, community-driven event management platform where citizens, volunteers, and local organizers unite to lead, coordinate, and participate in social development drives across their neighborhoods. From winter blanket distributions in Mohammadpur and warm clothes drives in Mirpur, to urban canal cleanups and community afforestation drives, HopeHarbor turns civic compassion into organized action.

---

## ✨ 5 Key Feature Highlights

1. **Strict Future-Date Event Scheduling & Category Classification**  
   Every community drive hosted on HopeHarbor is strictly validated against current timestamps to ensure past dates can never be created. Events are organized under clear civic categories (*Donation, Cleanup, Plantation, Healthcare, Education, Relief*), complete with thumbnail images, venue coordinates, and volunteer guidelines.

2. **One-Click Real-Time Event RSVP & Join Tracking**  
   Volunteers can seamlessly join upcoming drives with a single click. The system guarantees duplicate join prevention at both application and database layers (via compound indexes), displays a live attendee counter, and tracks upcoming commitments with countdown badges (*e.g., "In 3 days"*, *"Tomorrow"*).

3. **Organizer Control Dashboard with Ownership Guards**  
   Community organizers have access to a dedicated management interface where they can view all events they have organized, modify event descriptions or dates via an accessible modal, or cancel events with cascading attendee cleanup. Strict authorization ensures users can only edit or delete events they created themselves.

4. **Persistent Multi-Provider Authentication & Route Protection**  
   Powered by Better Auth with MongoDB Adapter and JWT validation, HopeHarbor supports both Google Social Sign-In and secure Email/Password authentication featuring strict password rules (minimum 6 characters, uppercase, and lowercase verification). Protected routes are shielded by persistent auth guards that eliminate session flickering or accidental login bounces upon browser refresh (F5).

5. **Theme Customization & Responsive Accessible UI**  
   Features a dark/light theme toggle that dynamically updates the entire platform's color palette. Designed with Tailwind CSS, custom loading skeletons mimicking the exact proportions of cards, and non-intrusive Sonner toast alerts (strictly avoiding browser `alert()` popups).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14/15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Sonner.
- **Theme Engine**: `next-themes` (Dark/Light mode system).
- **Authentication**: Better Auth with MongoDB Adapter & Google OAuth Provider.
- **Backend**: Node.js, Express.js (TypeScript), MongoDB Native Driver.
- **Validation**: Zod schema validation.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB Atlas cluster or local MongoDB instance

### 2. Client Setup
```bash
cd client
npm install
cp .env.example .env.local