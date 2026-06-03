/** Avatar label when menu items have no stored image. */
export function menuItemDisplayInitial(name: string): string {
  const ch = name.trim().charAt(0);
  return ch ? ch.toUpperCase() : "?";
}
