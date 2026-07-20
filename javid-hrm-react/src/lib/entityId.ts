/** API entity ids may arrive as encrypted strings or numeric values. */
export function shortEntityId(
  id: string | number | null | undefined,
  length = 8,
): string {
  if (id === null || id === undefined || id === '') return '—';
  return String(id).slice(0, length);
}
