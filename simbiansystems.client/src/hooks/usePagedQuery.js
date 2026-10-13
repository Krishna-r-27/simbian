import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
export function usePagedQuery(key, fetcher, initial = {}) {
  const [params, setParams] = useState({ page: 1, pageSize: 10, search: '', sortBy: '', sortDir: 'desc', ...initial });
  const query = useQuery({ queryKey: [key, params], queryFn: () => fetcher(params), placeholderData: (old) => old });
  const update = (values) => setParams((p) => ({ ...p, ...values, page: values.page ?? (values.search !== undefined || values.pageSize ? 1 : p.page) }));
  return { ...query, params, setParams: update };
}
