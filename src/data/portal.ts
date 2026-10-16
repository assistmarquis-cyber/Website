// Client portal content. Edit freely: each concept is one "world" on /portal/.
// progress: 0-100, how far along the concept is. img: a file in src/assets.
export const themes = [
  { id: 'web3-ai', name: 'Web3 and AI', line: 'Machines that amplify people, and value people can own.' },
  { id: 'creativity', name: 'Creativity', line: 'Ideas you can walk into, not just read about.' },
  { id: 'value', name: 'Value creation', line: 'Returns that count community, not only revenue.' },
];

export const concepts = [
  {
    id: 'god-framework',
    theme: 'web3-ai',
    title: 'The G.O.D. Framework in practice',
    status: 'Building now',
    progress: 70,
    img: 'god-framework.jpg',
    summary: 'Putting AI to work in real teams: the Generator creates, the Operator executes, the Destroyer eliminates.',
    detail: 'We are turning pilots into production systems while keeping people amplified, not replaced. Each team leaves with one workflow that runs on AI and a person who owns it.',
    questions: ['Where in your work would a Generator, Operator and Destroyer each save you hours?', 'What would you need to trust an AI agent with a real task?'],
  },
  {
    id: 'open-web',
    theme: 'web3-ai',
    title: 'Ownership on the open web',
    status: 'Exploring',
    progress: 30,
    img: 'gallery/concept-boards.jpg',
    summary: 'How creators and communities can own their work, audiences and value on Web3 rails.',
    detail: 'Mapping where AI agents fit into that picture: who holds the keys, who earns, and how a community keeps the value it creates.',
    questions: ['What do you create today that someone else owns?'],
  },
  {
    id: 'creative-cornerstore',
    theme: 'creativity',
    title: 'Creative CornerStore and IRL Productions',
    status: 'Piloting',
    progress: 50,
    img: 'irl-1.jpg',
    summary: 'Mind mapping, rapid prototyping and live experiences people can walk into.',
    detail: 'Augmented and virtual reality galleries, pop-ups and hackathons that turn a strategy into something a room full of people can see, touch and argue with.',
    questions: ['What idea have you been carrying that deserves a prototype this month?'],
  },
  {
    id: 'second-chances',
    theme: 'value',
    title: 'Second chances, first principles',
    status: 'Building now',
    progress: 60,
    img: 'gallery/hive-purpose.jpg',
    summary: 'Regenerative economics and ventures that measure what matters.',
    detail: 'Designing models where community outcomes and business results grow together, and where people who were counted out get a real way back in.',
    questions: ['What does a good return look like for you beyond revenue?'],
  },
];

// "Find your entry point": three sliders, one per theme. The highest one picks where to start.
export const compass = [
  { theme: 'web3-ai', ask: 'How urgently do you need AI working for your team?', low: 'Someday', high: 'Yesterday' },
  { theme: 'creativity', ask: 'How badly do you want to make an idea real this quarter?', low: 'Just musing', high: 'Can\'t sleep' },
  { theme: 'value', ask: 'How much does building value for your community matter right now?', low: 'Nice to have', high: 'Everything' },
];
