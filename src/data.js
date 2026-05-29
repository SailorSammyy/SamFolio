export const siteData = {
  name: 'Sam',
  role: 'casual coder',
  tagline: 'I build things with code.',
  bio: "nonchalant dude. anime enjoyer. cat person. hates periods. codes in free time.",
  githubUsername: 'sailorsammyy',
  socials: {
    github:   'https://github.com/sailorsammyy',
    email:    'sam@example.com',
    discord:  'https://discord.com/users/746237905252647003',
  },
  discord: {
    userId: '746237905252647003',
  },
}

export const skills = [
  { label: 'Frontend',   items: 'React, Vite, Tailwind, Html/Css' },
  { label: 'Backend',    items: 'Node.js, Express, REST APIs (idk they work)' },
  { label: 'Tools',      items: 'VS Code, Git, Bun' },
  { label: 'Vibes',      items: 'anime, cats, no periods, lowkey a W' },
]

export const projects = [
  {
    title: 'Study Tracker',
    description: 'A minimal app to log study sessions and visualise weekly progress. Built during exam season out of necessity.',
    stack: ['Vite', 'Tailwind', 'Chart.js'],
    github: '#',
    demo: '#',
  },
  {
    title: 'CLI Todo',
    description: 'Terminal-based task manager in Node.js. Supports tags, priorities, and persistence via JSON.',
    stack: ['Node.js', 'CLI', 'JSON'],
    github: '#',
    demo: null,
  },
  {
    title: 'Weather Dashboard',
    description: 'Real-time weather viewer using the OpenWeather API. My first project consuming a public REST API.',
    stack: ['JavaScript', 'API', 'CSS'],
    github: '#',
    demo: '#',
  },
]