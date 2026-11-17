# Ramgarh Sainian | Village Website

A fast, mobile-friendly, bilingual (Punjabi + English) website for Ramgarh Sainian village in Punjab, India. It gives villagers and the diaspora one place for village and gurdwara information.

**Live site:** https://ramgarhsainian.site/

## Features

- Punjabi / English language switch
- Village map page with an embedded drone-survey map and interactive zoom and pan
- Live kirtan page and a daily Hukamnama link
- Sikh (Nanakshahi) calendar with a countdown to upcoming gurpurabs and festivals
- Live weather and air quality using the Open-Meteo API
- Donation page, photo gallery, village history and contact page
- Responsive design that works on phones, tablets and desktops

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Map viewer | react-zoom-pan-pinch |
| QR codes | qrcode.react |
| Calendar data | nanakshahi-jantri |
| Analytics | Vercel Analytics and Speed Insights |
| Linting | ESLint |

## Getting Started

**Requirements:** Node.js 20 or later and npm.

```bash
# 1. Clone the repository
git clone https://github.com/harpreetsingh11/ramgarh-sainian.git
cd ramgarh-sainian

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |
| `npm run jantri:build` | Generate the Sikh calendar (jantri) data |

## Project Goals

- Keep the village's information easy to find and always up to date
- Load quickly, even on slow mobile connections
- Work well in both Punjabi and English

## Author

Built by **Harpreet Singh**, a WooCommerce & WordPress developer who also builds modern web apps with Next.js and React.

Open to freelance work. Find me on [Upwork](https://www.upwork.com/freelancers/~01e29127672fbbfed9).
