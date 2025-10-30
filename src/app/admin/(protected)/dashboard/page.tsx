'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { StatCard } from '@/components/StatCard';
import { 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineUserGroup, 
  HiOutlineTruck, 
  HiOutlineCube 
} from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface OrderSummary {
  received: number;
  delivered: number;
  customers: number;
  drivers: number;
  products: number;
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
        const data = response.data;

        const normalizedSummary: OrderSummary = {
          received: data.received ?? 0,
          delivered: data.delivered ?? 0,
          customers: data.customers ?? 0,
          drivers: data.drivers ?? 0,
          products: data.products ?? 0,
        };

        setSummary(normalizedSummary);
      } catch (error) {
        console.error(error);
        toast.error('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  const handleNavigate = (status: string) => {
    router.push(`/admin/pedidos?status=${status}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pedidos Recebidos */}
        <div onClick={() => handleNavigate('recebido')} className="cursor-pointer">
          <StatCard
            title="Pedidos Recebidos"
            value={summary?.received ?? 0}
            icon={HiOutlineClock}
            color="bg-red-500"
            href="/admin/pedidos?status=recebido"
          />
        </div>

        {/* Pedidos Entregues */}
        <div onClick={() => handleNavigate('entregue')} className="cursor-pointer">
          <StatCard
            title="Pedidos Entregues"
            value={summary?.delivered ?? 0}
            icon={HiOutlineCheckCircle}
            color="bg-green-500"
            href="/admin/pedidos?status=entregue"
          />
        </div>

        {/* Clientes cadastrados */}
        <StatCard
          title="Clientes Cadastrados"
          value={summary?.customers ?? 0}
          icon={HiOutlineUserGroup}
          color="bg-blue-500"
          href="/admin/clientes"
        />

        {/* Entregadores cadastrados */}
        <StatCard
          title="Entregadores Cadastrados"
          value={summary?.drivers ?? 0}
          icon={HiOutlineTruck}
          color="bg-yellow-500"
          href="/admin/entregadores"
        />

        {/* Produtos cadastrados */}
        <StatCard
          title="Produtos Cadastrados"
          value={summary?.products ?? 0}
          icon={HiOutlineCube}
          color="bg-purple-500"
          href="/admin/produtos"
        />
      </div>
    </div>
  );
}
