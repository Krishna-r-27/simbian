import { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { TableSkeleton } from '../ui/Skeleton';

export default function DataTable({
  columns,
  data = [],
  totalCount = 0,
  page = 1,
  pageSize = 10,
  search = '',
  loading,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  onBulkDelete,
  onExportCsv,
  onExportExcel,
}) {
  const [selected, setSelected] = useState([]);
  const [term, setTerm] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => onSearchChange?.(term), 350);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    setSelected([]);
  }, [data]);

  if (loading && !data.length) return <TableSkeleton />;

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const allSelected = data.length > 0 && selected.length === data.length;
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);

  const exportFile = async (action, extension) => {
    const response = await action();
    if (!response?.data) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(response.data);
    link.download = `export.${extension}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
        <div className="relative min-w-[180px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            className="admin-input pl-10"
            placeholder="Search..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        {onExportCsv && (
          <button
            type="button"
            className="admin-button-outline gap-1.5"
            onClick={() => exportFile(onExportCsv, 'csv')}
          >
            <Download size={16} aria-hidden />
            CSV
          </button>
        )}
        {onExportExcel && (
          <button
            type="button"
            className="admin-button-outline gap-1.5"
            onClick={() => exportFile(onExportExcel, 'xlsx')}
          >
            <Download size={16} aria-hidden />
            Excel
          </button>
        )}
        {onBulkDelete && selected.length > 0 && (
          <button
            type="button"
            className="admin-danger"
            onClick={() => onBulkDelete(selected).then(() => setSelected([]))}
          >
            Delete ({selected.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  onChange={() =>
                    setSelected(allSelected ? [] : data.map((r) => r.id))
                  }
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`p-4 text-left font-semibold uppercase tracking-wide text-slate-400 ${
                    c.sortable !== false ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={() => c.sortable !== false && onSortChange?.(c.key)}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="p-4">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={selected.includes(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="p-4 align-middle">
                    {c.render ? c.render(row) : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
            {!data.length && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-10 text-center text-slate-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <span>
          Showing {from}–{to} of {totalCount}.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="admin-input w-auto py-1.5"
            value={pageSize}
            aria-label="Rows per page"
            onChange={(e) => onPageSizeChange?.(+e.target.value)}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <button
            type="button"
            className="admin-page-btn"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Prev
          </button>
          <span className="min-w-[3.5rem] text-center tabular-nums text-slate-500">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            className="admin-page-btn"
            disabled={page >= totalPages || totalCount === 0}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
