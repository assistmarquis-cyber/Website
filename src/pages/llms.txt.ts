// /llms.txt: a plain-text summary of the site for AI assistants and answer engines.
// Built from the same data as the pages so it never drifts out of date.
import { site, keynotes, workshops } from '../data/site';
import { answers } from '../data/answers';

export function GET() {
  const u = (p: string) => `${site.url}${p}`;
  const body = `# ${site.name}, The Big Picture Arkitect

> ${answers[0].a}

Audiences: nonprofit and impact organizations, executives and leadership teams, founders and creators, and conference and event organizers. Delivered on-site or virtually.

## Offers

- [Keynotes](${u('/keynotes/')}): story-driven talks on leadership, AI and social impact.
${keynotes.map((k) => `  - [${k.title}](${u(`/keynotes/${k.slug}/`)}): ${k.summary}`).join('\n')}
- [AI adoption and leadership workshops](${u('/workshops/')}): built on the G.O.D. Framework (Generator, Operator, Destroyer).
${workshops.map((w) => `  - [${w.title}](${u(`/workshops/${w.slug}/`)}): ${w.summary}`).join('\n')}
- [Executive coaching: The 7 Layer Strategy](${u('/executive-coaching/')}): ground-up coaching for senior leaders and leadership teams.
- [Mindset coaching](${u('/mindset-coaching/')}): one-on-one accountability for people under pressure, starting with a Pattern Audit.
- [Claude coaching](${u('/claude-coaching/')}): coaching and team workshops on using Claude for real work.
- [G.O.D. Coach](${u('/god-coach/')}): a Claude coaching prompt set up in your own account.
- [IRL Productions](${u('/irl-productions/')}): AR and VR galleries, live performance pop-ups and hackathons.

## Questions buyers ask

${answers.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}

## Contact

- [Request availability](${u('/contact/')})
- Email: ${site.email}
- [About Marquis](${u('/about/')})
- [Speaker one-sheet (PDF)](${u(site.oneSheet)})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
