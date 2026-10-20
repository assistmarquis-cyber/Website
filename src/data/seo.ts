// Structured data (schema.org JSON-LD) so search engines and AI answer engines
// (ChatGPT search via Bing, Google, Perplexity, Claude) can tell who Marquis is,
// what he offers and who it is for. Base.astro prints the site-wide graph on every page;
// pages add their own nodes (Service, FAQPage, Offer) through the `schema` prop.
import { site, affiliations } from './site';

export const ids = {
  person: `${site.url}/#person`,
  org: `${site.url}/#org`,
  website: `${site.url}/#website`,
  book: `${site.url}/#book`,
};

// Profiles that are clearly Marquis. Add his LinkedIn, Instagram, YouTube and speaker
// directory profiles here as they are confirmed; each one helps engines link them to this site.
export const sameAs = [
  affiliations[0].url,
];

export const audiences = [
  'Nonprofit and impact organizations',
  'Executives and senior leadership teams',
  'Founders and creators',
  'Conference and event organizers',
];

export const siteGraph = [
  {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    alternateName: ['The Big Picture Arkitect', 'The Big Picture Architect', 'Digital Griot'],
    url: `${site.url}/about/`,
    image: `${site.url}/og.jpg`,
    email: `mailto:${site.email}`,
    jobTitle: ['Keynote Speaker', 'AI Adoption Workshop Facilitator', 'Executive Coach', 'Mindset Coach', 'Claude AI Coach'],
    description: 'Marquis Harmon, The Big Picture Arkitect, is a keynote speaker, AI adoption workshop facilitator, executive coach and mindset coach. He helps nonprofit and impact organizations, executives and everyday people put AI to work without losing their own judgment, using his G.O.D. Framework (Generator, Operator, Destroyer). He has spoken at the United Nations, COP22, the World Syrian Refugee Summit and Hive at Harvard Business School, and is the author of Thinking Out Loud to Myself: Psalms 1:3.',
    worksFor: { '@id': ids.org },
    founder: { '@id': ids.org },
    memberOf: { '@type': 'Organization', name: affiliations[0].name, url: 'https://justeconomyinstitute.org/' },
    knowsAbout: ['AI adoption', 'Generative AI for nonprofits', 'Claude (AI assistant)', 'AI governance', 'Leadership development', 'Executive coaching', 'Mindset coaching', 'Accountability coaching', 'Decision-making under pressure', 'Social impact', 'Regenerative economics', 'Rapid prototyping', 'Hackathons', 'Augmented and virtual reality experiences'],
    sameAs,
  },
  {
    '@type': 'ProfessionalService',
    '@id': ids.org,
    name: `${site.name}, The Big Picture Arkitect`,
    legalName: site.legal,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    image: `${site.url}/og.jpg`,
    email: site.email,
    founder: { '@id': ids.person },
    areaServed: 'Worldwide',
    description: 'Keynotes, AI adoption workshops, executive coaching, mindset coaching and Claude AI coaching by Marquis Harmon, delivered on-site or virtually.',
    knowsAbout: ['AI adoption workshops', 'Keynote speaking', 'Executive coaching', 'Mindset coaching', 'Claude coaching'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'Bookings', email: site.email, url: `${site.url}/contact/` },
  },
  {
    '@type': 'WebSite',
    '@id': ids.website,
    url: site.url,
    name: `${site.name} | The Big Picture Arkitect`,
    publisher: { '@id': ids.org },
    about: { '@id': ids.person },
    inLanguage: 'en-US',
  },
  {
    '@type': 'Book',
    '@id': ids.book,
    name: 'Thinking Out Loud to Myself: Psalms 1:3',
    author: { '@id': ids.person },
    bookFormat: 'https://schema.org/Paperback',
    url: site.bookUrl,
  },
];

// One service Marquis offers, with him as the provider.
export function service(o: { name: string; serviceType: string; url: string; description: string; audience?: string[]; offers?: object }) {
  return {
    '@type': 'Service',
    '@id': `${o.url}#service`,
    name: o.name,
    serviceType: o.serviceType,
    url: o.url,
    description: o.description,
    provider: { '@id': ids.person },
    brand: { '@id': ids.org },
    areaServed: 'Worldwide',
    audience: (o.audience ?? audiences).map((a) => ({ '@type': 'Audience', audienceType: a })),
    ...(o.offers ? { offers: o.offers } : {}),
  };
}

export function offer(price: string, url: string, name: string) {
  return { '@type': 'Offer', name, price: price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', url, availability: 'https://schema.org/InStock' };
}

// FAQ answers rendered on the page, repeated as FAQPage so answer engines can quote them.
export function faqPage(url: string, faq: string[][]) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}
