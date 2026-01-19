export type SocialLinks = {
  instagram?: string
  tiktok?: string
  threads?: string
  website?: string
}

export type Bridesmaid = {
  id: string
  name: string
  role: string
  bio: string
  image: string
  socials?: SocialLinks
  vibe?: string
}

export const partyInfo = {
  bride: 'Lena Monroe',
  weekendName: 'Palm Springs Send-Off',
  dates: 'May 22 - 25, 2025',
  location: 'Palm Springs, California',
  theme: 'Poolside disco with sun-washed pastels',
  lodging: 'Casa Solara, Palm Springs',
  drinkLink: 'https://example.com/buy-the-bride-a-drink',
  qrLabel: 'Scan to buy the bride a drink',
  blurb:
    'Three days of sunshine, sequins, and zero group chat stress. Save the dates and get ready to celebrate Lena with spritzes, dancing, and desert sunsets.',
  highlights: [
    'Poolside welcome spritz + charcuterie on Thursday',
    'Friday night neon dinner and drag show downtown',
    'Saturday golden-hour photos + rooftop toast',
    'Sunday slow brunch send-off with Polaroids',
  ],
}

export const itinerary = [
  {
    day: 'Thursday',
    title: 'Arrivals + Sunset Spritz',
    detail: 'Drop bags, claim a room, and join us by the pool for spritzes and charcuterie.',
  },
  {
    day: 'Friday',
    title: 'Disco Dinner + Drag',
    detail: 'Daytime shopping on Palm Canyon, dinner at Workshop Kitchen, then a drag show nightcap.',
  },
  {
    day: 'Saturday',
    title: 'Pool Club + Golden Hour',
    detail: 'Cabana day with matching suits, sunset photos, and rooftop champagne toasts.',
  },
  {
    day: 'Sunday',
    title: 'Brunch + Goodbyes',
    detail: 'Slow brunch, Polaroid wall signing, and hugs before heading home.',
  },
]

export const bridesmaids: Bridesmaid[] = [
  {
    id: 'sophia-lee',
    name: 'Sophia Lee',
    role: 'Maid of Honor',
    bio: 'Planner-in-chief, playlist curator, and keeper of Lena stories since freshman year.',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/sophia.lee',
      threads: 'https://www.threads.net/@sophia.lee',
    },
    vibe: 'Disco ball meets color-coded itinerary.',
  },
  {
    id: 'maya-estrada',
    name: 'Maya Estrada',
    role: 'Bridesmaid',
    bio: 'Sunset photo director, mezcal margarita pro, and Lena’s college roommate.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/mayalens',
    },
    vibe: 'Analog camera + modern glam.',
  },
  {
    id: 'taylor-cho',
    name: 'Taylor Cho',
    role: 'Bridesmaid',
    bio: 'Resident hype woman, responsible for sparkly accessories and spontaneous dance breaks.',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/taylorxo',
      tiktok: 'https://tiktok.com/@taylorxo',
    },
    vibe: 'Sequins, sneakers, and late-night ramen runs.',
  },
  {
    id: 'nina-kelley',
    name: 'Nina Kelley',
    role: 'Bridesmaid',
    bio: 'Hotel lobby storyteller, skincare aficionado, and Lena’s cousin turned sister.',
    image:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/ninaglow',
      website: 'https://ninakelley.com',
    },
    vibe: 'Spa day energy with a side of mischief.',
  },
  {
    id: 'ari-jackson',
    name: 'Ari Jackson',
    role: 'Bridesmaid',
    bio: 'Logistics hero, karaoke legend, and the first to cheer when Lena said yes.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/arij',
    },
    vibe: 'Matching sets, bold lips, organized chaos.',
  },
]
