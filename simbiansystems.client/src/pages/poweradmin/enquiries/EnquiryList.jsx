import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import DataTable from '../../../components/table/DataTable';
import { usePagedQuery } from '../../../hooks/usePagedQuery';
import { enquiryService } from '../../../services/enquiryService';
import { formatDate } from '../../../utils/format';
import { confirmDelete } from '../../../utils/confirm';

export default function EnquiryList() {
  const qc = useQueryClient();
  const q = usePagedQuery('enquiries', enquiryService.getPaged);
  const r = q.data || {};
  const refresh = () => qc.invalidateQueries({ queryKey: ['enquiries'] });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdOn',
      label: 'Received',
      render: (x) => formatDate(x.createdOn),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (x) => (
        <div className="flex items-center gap-2">
          <select
            className="admin-input w-auto py-1.5"
            value={x.status}
            onChange={async (e) => {
              await enquiryService.status(x.id, e.target.value);
              refresh();
            }}
          >
            {['New', 'InProgress', 'Resolved', 'Closed'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn-danger"
            title="Delete"
            aria-label="Delete"
            onClick={async () => {
              if (await confirmDelete('this enquiry')) {
                await enquiryService.delete(x.id);
                refresh();
              }
            }}
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
        title="Enquiries"
        description="Manage contact enquiries and follow-up status."
      />
      <DataTable
        columns={columns}
        data={r.items || []}
        totalCount={r.totalCount || 0}
        loading={q.isLoading}
        {...q.params}
        onPageChange={(page) => q.setParams({ page })}
        onPageSizeChange={(pageSize) => q.setParams({ pageSize })}
        onSearchChange={(search) => q.setParams({ search })}
        onBulkDelete={async (ids) => {
          if (await confirmDelete('selected enquiries')) {
            await enquiryService.bulkDelete(ids);
            refresh();
          }
        }}
        onExportCsv={() => enquiryService.export(false)}
        onExportExcel={() => enquiryService.export(true)}
      />
    </>
  );
}
