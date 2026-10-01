// Wraps any [bracketed placeholder] in a highlighted span so it's easy to find.
// Input is always our own static copy, never user input.
export function ph(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return esc.replace(/\[[^\]]+\]/g, (m) => `<mark class="ph">${m}</mark>`);
}
