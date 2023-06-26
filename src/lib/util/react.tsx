
export function joinClasses (...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}