"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { Order } from "@/types/order"; 
import { DeliveryMan } from "@/types/deliveryMan"; 
import { OrderStatus } from "@/types/orderStatus";
import { OrderItem } from "@/types/orderItem";
import { PaymentMethod } from "@/types/paymentMethod"; 

import Link from "next/link";

interface OrderDetails extends Order {
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  orderNote: string | null;
  status: OrderStatus;

  user: {
    name: string;
    phone: string;
  };
  deliveryMan: {
    id: number;
    name: string;
  } | null;
}

export default function DetalhesPedidoPage() {
  const params = useParams(); // Pega { id: '123' } da URL
  const id = params.id;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectedDriver, setSelectedDriver] = useState<string>(""); 

  useEffect(() => {
    if (!id) return;

    async function fetchPageData() {
      setLoading(true);
      try {
        const orderResponse = await api.get(`/orders/${id}`);
        setOrder(orderResponse.data);
        setSelectedStatus(orderResponse.data.status.id);
        setSelectedDriver(
          orderResponse.data.deliveryMan?.id?.toString() || "null"
        );

        const deliveryMenResponse = await api.get("/deliverymen");
        setDeliveryMen(deliveryMenResponse.data);

        const statusesResponse = await api.get("/orderStatus");
        setStatuses(statusesResponse.data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error)
            toast.error(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [id]);

  const handleStatusChange = async (newStatusId: number) => {
    try {
      await api.patch(`/orders/${id}/status`, { statusId: newStatusId });
      setSelectedStatus(newStatusId);
      toast.success("Status do pedido atualizado!");
      if (order) {
        const newStatus = statuses.find((s) => s.id === newStatusId);
        if (newStatus) {
          setOrder({ ...order, status: newStatus });
        }
      }
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDriverChange = async (newDriverId: string) => {
    const idToUpdate = newDriverId === "null" ? null : Number(newDriverId);
    try {
      await api.patch(`/orders/${id}/assign-delivery`, {
        deliveryManId: idToUpdate,
      });
      setSelectedDriver(newDriverId);
      toast.success("Entregador atribuído!");
      if (order) {
        const newDriver = deliveryMen.find((d) => d.id === idToUpdate);
        setOrder({ ...order, deliveryMan: newDriver || null });
      }
    } catch {
      toast.error("Erro ao atribuir entregador.");
    }
  };

  if (loading || !order) {
    return <div>Carregando detalhes do pedido...</div>;
  }

  const totalPedido = order.items.reduce(
    (acc: number, item: OrderItem) => acc + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <Link
        href="/admin/pedidos"
        className="text-emerald-600 hover:underline mb-4 block"
      >
        &larr; Voltar para todos os pedidos
      </Link>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Detalhes do Pedido #{order.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna de Ações (Admin) */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Alterar Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(Number(e.target.value))}
              className="w-full p-2 text-gray-700 border border-gray-300 rounded-md"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.statusName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <label
              htmlFor="driver"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Atribuir Entregador
            </label>
            <select
              id="driver"
              value={selectedDriver}
              onChange={(e) => handleDriverChange(e.target.value)}
              className="w-full p-2 border text-gray-700 border-gray-300 rounded-md"
            >
              <option value="null">-- Não Atribuído --</option>
              {deliveryMen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coluna de Detalhes do Pedido */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 border text-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Informações do Cliente
            </h3>
            <p>
              <strong>Nome:</strong> {order.user.name}
            </p>
            <p>
              <strong>Telefone:</strong> {order.user.phone}
            </p>
            <p>
              <strong>Endereço:</strong> {order.orderNote}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Itens do Pedido
            </h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item: OrderItem) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-700">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-800">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="pt-3 mt-3 border-t border-gray-300 text-right">
              <p className="font-bold text-gray-700 text-lg">
                Total: R$ {totalPedido.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Pagamento: {order.paymentMethod.methodName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
