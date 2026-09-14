// Reserved backend product assignment. It is deliberately not an occasion
// taxonomy row, so it must be supplied by the product UI rather than fetched
// from GET /occasions.
export const ALL_OCCASIONS_SLUG = 'all-occasions';
export const ALL_OCCASIONS_NAME = 'All Occasions';

export const ALL_OCCASIONS_OPTION = {
  slug: ALL_OCCASIONS_SLUG,
  name: ALL_OCCASIONS_NAME,
};

export function normalizeAllOccasions(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === ALL_OCCASIONS_NAME.toLowerCase()
    ? ALL_OCCASIONS_SLUG
    : value;
}
