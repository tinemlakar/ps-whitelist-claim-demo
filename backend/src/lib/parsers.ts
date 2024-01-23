/**
 * Returns parser function which converts a value to a string.
 */
export function stringTrimParser() {
  return (value: any) => {
    try {
      return value.toString().trim();
    } catch (e) {
      return null;
    }
  };
}

/**
 * Returns parser function which converts a value to a string.
 */
export function stringLowerCaseParser() {
  return (value: any) => {
    try {
      return value.toString().toLowerCase();
    } catch (e) {
      return null;
    }
  };
}
