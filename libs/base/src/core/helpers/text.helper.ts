export function getFullName(obj: { firstName: string; lastName: string } | null | undefined, emptyState = '') {
  const name = (obj ? `${obj.firstName ?? ''} ${obj.lastName ?? ''}` : '').trim();
  return name === '' ? emptyState : name;
}

export function toPascalCase(text: string | undefined | null): string {
  let result = text ?? '';
  if (result.length) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}
