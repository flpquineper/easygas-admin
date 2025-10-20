'use client';
import { useAuth } from '@/contexts/AuthContext';
import { HiOutlineBars3 } from 'react-icons/hi2';

interface AdminHeaderProps {
  onMenuButtonClick: () => void;
}

export default function AdminHeader({ onMenuButtonClick }: AdminHeaderProps) {
  const { admin } = useAuth();
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={onMenuButtonClick}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <HiOutlineBars3 size={24} />
        </button>

        <div className="flex-1 flex justify-end">
          {admin && (
            <span className="text-sm text-gray-700">
              Logado como: <span className="font-semibold text-emerald-800">{admin.name}</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}