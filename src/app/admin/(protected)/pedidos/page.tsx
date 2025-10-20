'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { Order } from '@/types/order';
import Link from 'next/link';

export default function GerenciarPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await api.get('/orders/all');
        setOrders(response.data);
      } catch {
        toast.error("Erro ao carregar a lista de pedidos.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Gerenciar Pedidos</h1>

      {/* Futuramente, adicionaremos os botões de filtro por status aqui */}

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
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm font-semibold">#{order.id}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{order.user.name}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  {/* O 'select' para alterar o status entrará aqui */}
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
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