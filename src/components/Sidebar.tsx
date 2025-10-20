'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineChartPie, HiOutlineUserGroup, HiOutlineShoppingBag, HiOutlineCube, HiOutlineTruck } from 'react-icons/hi2';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HiOutlineChartPie },
  { name: 'Pedidos', href: '/admin/pedidos', icon: HiOutlineShoppingBag },
  { name: 'Produtos', href: '/admin/produtos', icon: HiOutlineCube },
  { name: 'Clientes', href: '/admin/clientes', icon: HiOutlineUserGroup },
  { name: 'Entregadores', href: '/admin/entregadores', icon: HiOutlineTruck },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${ isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`fixed top-0 left-0 h-full w-64 bg-emerald-800 text-white flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${ isSidebarOpen ? 'translate-x-0' : '-translate-x-full' } lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
        <div className="h-20 flex items-center justify-center border-b border-emerald-700">
          <h1 className="text-2xl font-bold tracking-wider">Easy Gas</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${ isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-700 hover:text-white' }`}>
                <link.icon className="h-6 w-6" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}