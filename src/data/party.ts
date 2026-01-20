export type SocialLinks = {
  instagram?: string
  tiktok?: string
  threads?: string
  website?: string
}

export type ContributionLink = {
  platform: string
  handle?: string
  url: string
  note?: string
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

export const brideProfile: Bridesmaid = {
  id: 'shibby',
  name: 'Siobhan Quirke',
  role: 'Bride',
  bio: 'Obviously taken',
  image: '/shibby.png',
  socials: {
    instagram: 'https://instagram.com/shibbyy_q',
    threads: 'https://www.threads.net/@sophia.lee',
  },
  vibe: 'Fueled by champagne, ADHD, and sunset views',
}

export const partyInfo = {
  bride: 'Shibby Monroe',
  weekendName: 'Palm Springs Send-Off',
  dates: 'May 22 - 25, 2025',
  location: 'Palm Springs, California',
  theme: 'Poolside disco with sun-washed pastels',
  lodging: 'Casa Solara, Palm Springs',
  drinkLink: 'https://example.com/buy-the-bride-a-drink',
  qrLabel: 'Scan to buy the bride a drink',
  blurb:
    'Three days of sunshine, sequins, and zero group chat stress. Save the dates and get ready to celebrate Shibby with spritzes, dancing, and desert sunsets.',
  highlights: [
    'Poolside welcome spritz + charcuterie on Thursday',
    'Friday night neon dinner and drag show downtown',
    'Saturday golden-hour photos + rooftop toast',
    'Sunday slow brunch send-off with Polaroids',
  ],
  contributionLinks: [
    {
      platform: 'Venmo',
      handle: '@Siobhan-Quirke',
      url: 'https://venmo.com/u/Siobhan-Quirke',
      note: 'Preferred for quick cheers and notes.',
    },
    {
      platform: 'Cash App',
      handle: '$ShibbyMonroe',
      url: 'https://cash.app/$ShibbyMonroe',
    },
    {
      platform: 'PayPal',
      handle: 'paypal.me/Shibbymonroe',
      url: 'https://paypal.me/Shibbymonroe',
      note: 'Use “Friends & Family” if prompted.',
    },
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
    bio: 'Planner-in-chief, playlist curator, and keeper of Shibby stories since freshman year.',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/sophia.lee',
      threads: 'https://www.threads.net/@sophia.lee',
    },
    vibe: 'Disco ball meets color-coded itinerary.',
  },
  {
    id: 'llaurahohl',
    name: 'Laura Hohl',
    role: 'Bridesmaid',
    bio: 'Known for drinking a little too much, lending out half her wardrobe, and believing every song deserves to be played at full volume',
    image: '/laura.png',
    socials: {
      instagram: 'https://instagram.com/llaurahohl',
    },
    vibe: 'tbd',
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
    bio: 'Hotel lobby storyteller, skincare aficionado, and Shibby’s cousin turned sister.',
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
    bio: 'Logistics hero, karaoke legend, and the first to cheer when Shibby said yes.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    socials: {
      instagram: 'https://instagram.com/arij',
    },
    vibe: 'Matching sets, bold lips, organized chaos.',
  },
]
