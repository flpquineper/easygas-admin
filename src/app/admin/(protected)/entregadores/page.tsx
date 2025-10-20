'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { DeliveryMan } from '@/types/deliveryMan';
import { DeliveryManFormModal } from '@/components/DeliveryManFormModal';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

export default function GerenciarEntregadoresPage() {
  const [drivers, setDrivers] = useState<DeliveryMan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DeliveryMan | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<DeliveryMan | null>(null);
  
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await api.get('/deliverymen');
        setDrivers(response.data);
      } catch  {
        toast.error("Erro ao carregar entregadores.");
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  const handleSave = (savedDriver: DeliveryMan) => {
    if (editingDriver) {
      setDrivers(drivers.map(d => (d.id === savedDriver.id ? savedDriver : d)));
    } else {
      setDrivers([...drivers, savedDriver]);
    }
  };

  async function handleDeleteDriver() {
    if (!driverToDelete) return;
    try {
      await api.delete(`/deliverymen/${driverToDelete.id}`);
      toast.success("Entregador removido com sucesso!");
      setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
    } catch {
      toast.error("Erro ao remover o entregador.");
    } finally {
      setDriverToDelete(null);
    }
  }

  if (loading) {
    return <div>Carregando entregadores...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Entregadores</h1>
        <button 
          onClick={() => { setEditingDriver(null); setIsModalOpen(true); }} 
          className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
          Adicionar Novo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 border-b border-gray-200 text-gray-800 bg-white text-sm">{driver.id}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-gray-800 bg-white text-sm">{driver.name}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-gray-800 bg-white text-sm">{driver.email}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-gray-800 bg-white text-sm text-center">
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => { setEditingDriver(driver); setIsModalOpen(true); }} 
                      className="text-yellow-500 hover:text-yellow-700 transition-colors">
                      <HiOutlinePencil size={20} />
                    </button>
                   <button onClick={() => setDriverToDelete(driver)} className="text-red-500 ...">
                      <HiOutlineTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DeliveryManFormModal
          initialData={editingDriver}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {driverToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg text-gray-700 font-semibold">Confirmar Exclusão</h3>
            <p className="my-4 text-gray-600">Tem certeza que deseja excluir o entregador {driverToDelete.name} ?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDriverToDelete(null)} className="py-2 text-gray-700 px-4 rounded border">Cancelar</button>
              <button onClick={handleDeleteDriver} className="py-2 px-4 rounded bg-red-600 text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}