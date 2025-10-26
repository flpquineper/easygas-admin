// src/app/admin/(protected)/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { StatCard } from '@/components/StatCard';
import { HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface OrderSummary {
  pending: number;
  delivered: number;
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await api.get('/stats/order-summary');
        setSummary(response.data);
      } catch {
        toast.error("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pedidos Recebidos"
          value={summary?.pending ?? 0}
          icon={HiOutlineClock}
          color="bg-red-500"
          href="admin/pedidos?status=pendente"
        />
        <StatCard 
          title="Pedidos Entregues"
          value={summary?.delivered ?? 0}
          icon={HiOutlineCheckCircle}
          color="bg-green-500"
          href="admin/pedidos?status=entregue"
        />
      </div>
    </div>
  );
}