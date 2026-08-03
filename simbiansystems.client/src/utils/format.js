export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  const errors = data.errors || data.Errors;
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors).flat().find(Boolean);
    if (first) return first;
  }

  return data.message || data.Message || error?.message || fallback;
}

export const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';

/** Short list date like GNN admin: "17 Jul 2026" */
export const formatListDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    : '—';

