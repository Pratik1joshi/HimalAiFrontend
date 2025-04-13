/**
 * Combines multiple class names into a single string, removing any falsy values.
 * This is a simplified version of the `clsx` or `classnames` library
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
