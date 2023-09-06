import { randomBytes } from "crypto";

export const cryptoToken = () => randomBytes(64).toString("hex");
export function generateSlug(text) {
  // Convert the input to a string explicitly.
  text = String(text);

  // Convert the string to lowercase letters.
  text = text.toLowerCase();

  // Remove any whitespaces from the beginning or end of the string.
  text = text.trim();

  // Replace any whitespace between words with the separator character.
  const separator = "-";
  text = text.replace(/\s+/g, separator);

  // Remove any special characters.
  const specialCharacters = /[^a-z0-9-]+/g;
  text = text.replace(specialCharacters, "");

  return text;
}
