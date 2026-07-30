// Fresh-install state: no categories ship by default. Add them through
// Admin → Categories → Add Category — CategoriesContext reads/writes this
// shape straight to localStorage, so nothing here is a hardcoded limit.
export const CATEGORY_SEED = [];
