import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, CheckCircle2, XCircle, MessageSquare, MailOpen } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { Skeleton } from '../../components/ui/Skeleton';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.stats,
  });

  const cards = [
    {
      label: 'Total Products',
      value: data?.totalProducts,
      to: '/poweradmin/products',
      icon: Package,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Active Products',
      value: data?.activeProducts,
      to: '/poweradmin/products?isPublished=true',
      icon: CheckCircle2,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Inactive Products',
      value: data?.inactiveProducts,
      to: '/poweradmin/products?isPublished=false',
      icon: XCircle,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Total Enquiries',
      value: data?.totalEnquiries,
      to: '/poweradmin/enquiries',
      icon: MessageSquare,
      tone: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Unread Enquiries',
      value: data?.unreadEnquiries,
      to: '/poweradmin/enquiries?status=Unread',
      icon: MailOpen,
      tone: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-[#004A7C]">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="admin-card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`rounded-2xl p-3 ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold text-[#004A7C]">{card.value ?? 0}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
