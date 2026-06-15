# WishMaster AI (100% Free & Fully Functional)

A modern AI social platform where users create wishes and other users can fulfill them. **This version is 100% free, requires ZERO paid API keys, and ALL features actually work.**

## 🆓 Free Stack:
- **Database**: Prisma + SQLite (Local, persistent, 100% free)
- **Authentication**: NextAuth.js with Credentials (Local JWT sessions, secure bcrypt hashing)
- **AI Generation**: Local Smart Mock AI (Simulates OpenAI responses instantly without API keys)
- **Maps**: React-Leaflet + OpenStreetMap (100% free, open-source, no tokens)
- **Affiliate Marketing**: Built-in click tracking and simulated earnings dashboard

## 🚀 Getting Started (Takes 2 Minutes)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the local free database:
   ```bash
   npx prisma db push
   ```

3. **(Optional but Recommended)** Seed the database with a demo account for instant testing:
   ```bash
   npx prisma db seed
   ```
   *(This creates a user: `demo@wishmaster.ai` / `password123` with 100 credits)*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ What Actually Works:
1. **Sign Up / Login**: Creates real users with 100 starting credits. Passwords are securely hashed. Includes a "Auto-fill Demo Account" button for instant testing.
2. **AI Wish Creator**: Type a prompt, get a structured wish. Select AI-suggested products to add as **Affiliate Links**. Publishing deducts 10 credits.
3. **Affiliate Marketing**: When anyone clicks an affiliate link on a wish card, it tracks the click in the database and simulates $1.50 in affiliate earnings for the wish creator.
4. **Fulfill Wishes**: Click "Fulfill", enter an amount, and it deducts credits from your account and adds to the wish's progress bar in real-time.
5. **Dashboard**: Shows your real credit balance, active wishes, total affiliate clicks, real affiliate revenue, and contribution history.

## 🛠️ Project Structure
- `prisma/schema.prisma`: Local SQLite database schema (includes `AffiliateLink` model)
- `src/lib/auth.ts`: NextAuth configuration for secure local credential authentication
- `src/app/api/affiliate/[id]/click/route.ts`: Tracks affiliate link clicks and simulates earnings
- `src/app/api/wishes/route.ts`: Handles wish creation with nested affiliate link creation

## 📈 Upgrading to Production (Optional)
When you're ready to go live, you can easily swap:
- SQLite → PostgreSQL (Neon.tech or Supabase have great free tiers)
- Mock AI → Hugging Face Inference API (Free tier) or Ollama (Local free LLM)
- Credentials Auth → Add Google/GitHub providers to NextAuth (both free)
- Affiliate Earnings → Connect to real Amazon Associates / ShareASale webhooks