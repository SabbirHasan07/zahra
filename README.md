# নূর — Namaz Time, Quran & Islamic Guide (Website)

Next.js 16 · Tailwind v4 · shadcn-style UI · Neon Postgres (Drizzle) · free APIs.

## Features
- Auto-updating prayer times (Aladhan API, Karachi method, Hanafi Asr) with live countdown, Hijri date, city picker + "my location"
- Weather (Open-Meteo, no key needed)
- Masjid jamaat times, managed by an admin (login-protected, stored in Neon)
- Namaz tracker (saved on the user's device), streak + monthly calendar
- Quran: 114 surahs — Arabic, transliteration, Bangla translation (alquran.cloud)
- Bangla guides: wudu, ghusl, rakat per waqt, tahajjud, how to pray
- Hadith page: 2 hadith each from Bukhari, Muslim, Tirmidhi with Bangla explanation
- Dark-only theme, mobile-first

## Setup
1. `npm install`
2. Create a free database at https://neon.tech and open the included `.env.local` (strong admin login + session secret are already generated; never commit it) and add
   your `DATABASE_URL`.
3. `npm run db:push` (creates the `masjids` table)
4. `npm run dev` → http://localhost:3000 · admin at `/admin`

## Deploy
Push to GitHub and import in Vercel; add the same 4 env vars.

## Next step: mobile app
Kibla finder + iOS/Android app (Expo/React Native or Capacitor wrapping this site) is planned after the website.
# zahra
