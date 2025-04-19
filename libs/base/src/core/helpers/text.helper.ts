export function getFullName(obj: any, defaultValue = '') {
  const firstNameKeys = ['firstName', 'first_name', 'firstname', 'FirstName'];
  const lastNameKeys = ['lastName', 'last_name', 'lastname', 'LastName'];

  if (!obj) return defaultValue;

  const firstNameKey = firstNameKeys.find((key) => key in obj);
  const lastNameKey = lastNameKeys.find((key) => key in obj);

  const name = `${firstNameKey ? (obj[firstNameKey] ?? '') : ''} ${lastNameKey ? (obj[lastNameKey] ?? '') : ''}`.trim();

  return name.length ? name : defaultValue;
}

export function toPascalCase(text: string | undefined | null): string {
  let result = text ?? '';
  if (result.length) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

export const TextHelper = {
  toPascalCase(text: string | undefined | null): string {
    let result = text ?? '';
    if (result.length) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  },
  getFullName(obj: any, defaultValue = '') {
    const firstNameKeys = ['firstName', 'first_name', 'firstname', 'FirstName'];
    const lastNameKeys = ['lastName', 'last_name', 'lastname', 'LastName'];

    if (!obj) return defaultValue;

    const firstNameKey = firstNameKeys.find((key) => key in obj);
    const lastNameKey = lastNameKeys.find((key) => key in obj);

    const name =
      `${firstNameKey ? (obj[firstNameKey] ?? '') : ''} ${lastNameKey ? (obj[lastNameKey] ?? '') : ''}`.trim();

    return name.length ? name : defaultValue;
  },
};
