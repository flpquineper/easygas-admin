import { IconType } from 'react-icons';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  color: string;
  href: string;
}

export function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
  return (
    <Link href={href} className={`${color} text-white p-6 rounded-xl shadow-lg flex items-center justify-between`}>
      <div>
        <p className="text-lg font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <Icon size={48} className="opacity-60" />
    </Link>
  );
}