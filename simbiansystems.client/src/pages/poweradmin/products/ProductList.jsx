import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import PictureImage from '../../../components/ui/PictureImage';
import AdminToggle from '../../../components/ui/AdminToggle';
import DataTable from '../../../components/table/DataTable';
import { usePagedQuery } from '../../../hooks/usePagedQuery';
import { productService } from '../../../services/productService';
import { confirmDelete } from '../../../utils/confirm';
import { formatListDate, getApiErrorMessage } from '../../../utils/format';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qc = useQueryClient();
  const [togglingId, setTogglingId] = useState(null);
  const publishedParam = searchParams.get('isPublished');
  const initialPublished =
    publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined;

  const q = usePagedQuery('products', (params) =>
    productService.getPaged({
      ...params,
      isPublished: params.isPublished ?? initialPublished,
    }),
  );

  useEffect(() => {
    if (publishedParam === 'true' || publishedParam === 'false') {
      q.setParams({ isPublished: publishedParam === 'true' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedParam]);

  const result = q.data || {};
  const refresh = () => qc.invalidateQueries({ queryKey: ['products'] });

  const remove = async (id) => {
    if (await confirmDelete('this product')) {
      await productService.delete(id);
      toast.success('Product deleted.');
      refresh();
    }
  };

  const setPublished = async (row, isPublished) => {
    setTogglingId(row.id);
    try {
      await productService.setPublished(row.id, isPublished);
      toast.success(isPublished ? 'Product published.' : 'Product unpublished.');
      refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      key: 'featuredImage',
      label: 'Image',
      sortable: false,
      render: (r) => (
        <PictureImage
          imageBasePath={r.featuredImage}
          alt={r.name}
          className="h-12 w-16 rounded border border-slate-200"
          imgClassName="h-full w-full object-cover"
        />
      ),
    },
    {
      key: 'name',
      label: 'Product',
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{r.name}</div>
          <div className="mt-0.5 text-xs text-slate-400">
            {formatListDate(r.updatedOn || r.createdOn)}
          </div>
        </div>
      ),
    },
    {
      key: 'categoryName',
      label: 'Category',
      render: (r) => <span className="text-slate-600">{r.categoryName || '—'}</span>,
    },
    {
      key: 'isPublished',
      label: 'Front-end',
      sortable: false,
      render: (r) => (
        <AdminToggle
          checked={!!r.isPublished}
          disabled={togglingId === r.id}
          label={`Publish ${r.name}`}
          onChange={(next) => setPublished(r, next)}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-icon-btn"
            title="Edit"
            aria-label="Edit"
            onClick={() => navigate(`/poweradmin/products/${r.id}/edit`)}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="admin-icon-btn"
            title="Duplicate"
            aria-label="Duplicate"
            onClick={async () => {
              await productService.duplicate(r.id);
              toast.success('Product duplicated.');
              refresh();
            }}
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn-danger"
            title="Delete"
            aria-label="Delete"
            onClick={() => remove(r.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage products, visibility, and catalog content."
        action={
          <Link className="admin-button" to="/poweradmin/products/new">
            Add product
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={result.items || result.data || []}
        totalCount={result.totalCount || 0}
        loading={q.isLoading}
        {...q.params}
        onPageChange={(page) => q.setParams({ page })}
        onPageSizeChange={(pageSize) => q.setParams({ pageSize })}
        onSearchChange={(search) => q.setParams({ search })}
        onSortChange={(sortBy) => q.setParams({ sortBy })}
        onBulkDelete={async (ids) => {
          if (await confirmDelete('selected products')) {
            await productService.bulkDelete(ids);
            refresh();
          }
        }}
        onExportCsv={() => productService.export(false)}
        onExportExcel={() => productService.export(true)}
      />
    </>
  );
}
