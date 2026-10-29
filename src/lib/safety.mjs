// Shared by the browser (before anything is sent) and by the alan function (again, on arrival).
// Pure functions, no network, no storage.

// Removes details that identify a person or a record. This is best effort: it catches
// formats (emails, phone numbers, ID numbers, dates, addresses), not names in free text.
const PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.-]+/g,                                   // email
  /\bhttps?:\/\/\S+|\bwww\.\S+/gi,                               // links
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,                          // SSN
  /\b(?:\d[ -]?){13,19}\b/g,                                     // card-like numbers
  /(?:\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // phone
  /\b(?:mrn|dob|member id|policy|account|patient id|ssn)\s*[:#]?\s*[\w-]{3,}/gi, // labelled ids
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g,                          // dates like 4/12/1988
  /\b\d{1,6}\s+(?:[A-Z][a-z]+\s+){1,3}(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Drive|Ln|Lane|Ct|Court|Way)\b\.?/g, // street address
];

export const scrub = (text = '') => {
  let n = 0;
  let out = String(text);
  for (const re of PATTERNS) out = out.replace(re, () => { n++; return '[removed]'; });
  return { text: out, removed: n };
};

// Words that mean a person may be in danger. When this matches, no AI is called
// and nothing is logged; the person is shown real help right away.
const CRISIS = [
  /\bsuicid/i, /\bkill(?:ing)? myself\b/i, /\bend(?:ing)? (?:my|it all|my own) life\b/i, /\bwant(?:ed)? to die\b/i,
  /\bdon'?t want to (?:be here|live|wake up)\b/i, /\bbetter off (?:dead|without me)\b/i, /\bself[- ]?harm/i,
  /\b(?:hurt|hurting|cut|cutting) myself\b/i, /\boverdos/i, /\b(?:he|she|they|someone) (?:is|are|'s) (?:hurting|hitting|abusing) me\b/i,
  /\bnot safe (?:at home|right now)\b/i, /\bgoing to hurt (?:someone|him|her|them)\b/i,
];
export const isCrisis = (text = '') => CRISIS.some((re) => re.test(text));

export const CRISIS_MESSAGE = 'What you wrote sounds serious, and you deserve a real person right now, not an app. In the US you can call or text 988 (Suicide and Crisis Lifeline) at any hour. If you or someone else is in immediate danger, call 911. Outside the US, local emergency services or a crisis line near you can help. I will be here after, and nothing you wrote was sent or saved.';
