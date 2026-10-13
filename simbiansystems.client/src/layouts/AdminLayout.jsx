import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, LayoutDashboard, Package, FileText, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; import { confirmLogout } from '../utils/confirm';
const nav = [
  { to: '/poweradmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Products',
    icon: Package,
    children: [
      { to: '/poweradmin/products', label: 'Products' },
      { to: '/poweradmin/products/specs', label: 'Spec Templates' },
      { to: '/poweradmin/products/quotes', label: 'Product Quotes' },
    ],
  },
  { to: '/poweradmin/enquiries', label: 'Enquiries', icon: MessageSquare },
];
export default function AdminLayout() { const { user, logout } = useAuth(); const [products, setProducts] = useState(true); const [menu, setMenu] = useState(false); const navigate = useNavigate(); const { pathname } = useLocation(); const handleLogout = async () => { if (await confirmLogout()) { await logout(); navigate('/poweradmin/login'); } };
 return <div className="min-h-screen bg-slate-100 lg:flex"><aside className="w-full shrink-0 bg-[#004A7C] text-white lg:fixed lg:inset-y-0 lg:w-64"><Link className="block border-b border-white/15 px-6 py-5 text-xl font-bold" to="/poweradmin">SIMBIAN SYSTEMS</Link><nav className="p-3">{nav.map((item) => item.children ? <div key={item.label}><button className="admin-nav w-full" onClick={() => setProducts(!products)}><item.icon size={18}/>{item.label}<ChevronDown className={`ml-auto ${products ? 'rotate-180' : ''}`} size={16}/></button>{products && <div className="ml-5 border-l border-white/20">{item.children.map((child) => <NavLink key={child.to} to={child.to} className="admin-subnav">{child.label}</NavLink>)}</div>}</div> : <NavLink key={item.to} to={item.to} end className="admin-nav"><item.icon size={18}/>{item.label}</NavLink>)}</nav></aside><main className="min-w-0 flex-1 lg:ml-64"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6"><div className="text-sm text-slate-500">Admin / {pathname.split('/').filter(Boolean).slice(-1)[0] || 'Dashboard'}</div><div className="relative"><button className="flex items-center gap-2" onClick={() => setMenu(!menu)}><span className="grid h-8 w-8 place-items-center rounded-full bg-[#004A7C] text-white"><User size={16}/></span>{user?.fullName || user?.userName || user?.email || 'Admin'}<ChevronDown size={15}/></button>{menu && <div className="absolute right-0 mt-2 w-44 rounded border bg-white py-1 shadow"><Link className="block px-4 py-2 hover:bg-slate-50" to="/poweradmin/profile">Profile</Link><Link className="block px-4 py-2 hover:bg-slate-50" to="/poweradmin/change-password">Change Password</Link><button className="w-full px-4 py-2 text-left hover:bg-slate-50" onClick={handleLogout}>Logout</button></div>}</div></header><section className="p-5 lg:p-7"><Outlet /></section><footer className="px-7 pb-5 text-center text-sm text-slate-500">Powered by <a className="admin-link" href="https://www.dotsandcoms.in/" target="_blank" rel="noreferrer">Dots and Coms</a></footer></main></div>; }
