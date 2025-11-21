'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { Order } from '@/types/order';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GerenciarPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get('status') || '';

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await api.get('/orders/all');
        let fetchedOrders: Order[] = response.data;

        // Filtro pelo status vindo da URL (recebido / entregue)
        if (statusFilter) {
          fetchedOrders = fetchedOrders.filter(
            order => order.status.statusName.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        setOrders(fetchedOrders);
      } catch {
        toast.error("Erro ao carregar a lista de pedidos.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [statusFilter]);

  const handleFilterChange = (status: string) => {
    if (status) {
      router.push(`/admin/pedidos?status=${status}`);
    } else {
      router.push(`/admin/pedidos`);
    }
  };

  if (loading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Pedidos</h1>

        <div>
          <label htmlFor="statusFilter" className="mr-2 font-medium text-gray-700">Filtrar por status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 text-gray-700 rounded-md px-3 py-1"
          >
            <option value="">Todos</option>
            <option value="recebido">Recebido</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 border-b text-gray-700 border-gray-200 bg-white text-sm font-semibold">#{order.id}</td>
                <td className="px-5 py-4 border-b text-gray-700 border-gray-200 bg-white text-sm">{order.user.name}</td>
                <td className="px-5 py-4 border-b text-gray-700 border-gray-200 bg-white text-sm">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status.statusName === 'entregue'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {order.status.statusName}
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-emerald-600 hover:underline font-semibold">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
