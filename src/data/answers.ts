// Plain answers to the questions buyers ask an AI assistant before booking.
// Shown on /faq/, repeated as FAQPage structured data and in /llms.txt.
// Keep every answer factual and in step with the rest of the site.
import { site, keynotes, workshops, patternAudit, godCoach } from './site';

export const answers: { q: string; a: string; href?: string }[] = [
  {
    q: 'Who is Marquis Harmon?',
    a: `Marquis Harmon, known as The Big Picture Arkitect, is a keynote speaker, AI adoption workshop facilitator, executive coach and mindset coach. He founded MAEx, a practice built on mindset, execution, identity, decision-making and the personal operating system a leader runs on, with his AI frameworks, including the G.O.D. Framework for AI adoption, built on that core. He has spoken at the United Nations, COP22, the World Syrian Refugee Summit and Hive at Harvard Business School, is a Just Economy Institute fellow, and wrote the memoir Thinking Out Loud to Myself: Psalms 1:3. His business is ${site.legal}.`,
    href: '/about/',
  },
  {
    q: 'What does Marquis Harmon speak about?',
    a: `Three story-driven keynotes: ${keynotes.map((k) => `"${k.title}" (${k.topic})`).join(', ')}. Each talk blends personal story, comedy and practical frameworks, and is tailored to your audience after a briefing with your team.`,
    href: '/keynotes/',
  },
  {
    q: 'Does he run AI workshops for nonprofits and impact organizations?',
    a: 'Yes. Nonprofit and impact teams are a core audience. The AI Adoption workshop uses his G.O.D. Framework on your team\'s real tasks, and the Claude team workshop adds one-on-one coaching for two or three leads. Before any work starts, the team agrees on what never goes into AI, like donor, client, health or HR data, and follows the organization\'s own rules. His social impact work includes a Just Economy Institute fellowship and his keynote "Second Chances, First Principles".',
    href: '/workshops/',
  },
  {
    q: 'What is the G.O.D. Framework?',
    a: 'The G.O.D. Framework is Marquis Harmon\'s method for AI adoption. The Generator creates, the Operator executes, and the Destroyer eliminates what is in the way. At the center is mind mastery, the MAEx core of mindset, execution, identity, decision-making and a personal operating system, so people stay in charge of their own judgment while AI does more of the work. It powers his AI Adoption workshop, his Claude coaching and the G.O.D. Coach.',
    href: `/workshops/${workshops[0].slug}/`,
  },
  {
    q: 'Does Marquis Harmon offer executive coaching?',
    a: 'Yes. The 7 Layer Strategy is a ground-up executive coaching engagement for senior leaders and leadership teams, moving from personal identity and presence through action mapping, team building, systems and rapid prototyping to lasting momentum.',
    href: '/executive-coaching/',
  },
  {
    q: 'What is mindset coaching with Marquis, and what is the Pattern Audit?',
    a: `Mindset coaching is one-on-one accountability for founders, executives and creators under pressure. You learn to spot the patterns running your decisions, trust your instinct and act fast. It starts with a ${patternAudit.price} Pattern Audit: one 60 to 90 minute session plus a written action map. Coaching is not therapy or medical care.`,
    href: '/mindset-coaching/',
  },
  {
    q: 'Can Marquis teach me or my team to use Claude?',
    a: 'Yes. Claude coaching teaches executives, founders, nonprofit teams and everyday people to use Claude on their real work. Options are a Claude Audit (one 60 minute session and a written action map), a Claude Sprint (two sessions and two weeks of daily reps) and a Team Workshop. No technical background is needed.',
    href: '/claude-coaching/',
  },
  {
    q: 'What is the G.O.D. Coach?',
    a: `A Claude coaching prompt built by Marquis on his G.O.D. Framework and set up in your own Claude account, for a one-time ${godCoach.price}.`,
    href: '/god-coach/',
  },
  {
    q: 'Does he speak and facilitate on-site or virtually?',
    a: 'Both. Keynotes, workshops and coaching are delivered on-site or virtually, for rooms of a dozen executives or a full company audience.',
  },
  {
    q: 'Who has Marquis worked with?',
    a: 'Stages include the United Nations, COP22, the World Syrian Refugee Summit and Hive at Harvard Business School. He designed and built the Frequency experience for Tune.FM at Philly Tech Week 2026, and helped a State of Maryland Parks Department wellness manager build an AI tool stack to organize 12 years of research.',
    href: '/about/',
  },
  {
    q: 'How much does it cost to book Marquis Harmon?',
    a: `Keynotes, workshops and executive coaching are quoted per engagement after a short briefing, so request availability with your date and audience. The Pattern Audit and the G.O.D. Coach are ${patternAudit.price} each.`,
  },
  {
    q: 'How do I book Marquis Harmon?',
    a: `Request availability at ${site.url}/contact/ or email ${site.email}. Marquis replies personally within ${site.responseTime}.`,
    href: '/contact/',
  },
];
