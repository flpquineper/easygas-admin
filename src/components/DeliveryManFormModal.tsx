'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { DeliveryMan } from '@/types/deliveryMan';

interface ModalProps {
  initialData: DeliveryMan | null; // Se 'null', é modo de criação. Se tiver dados, é edição.
  onClose: () => void;
  onSave: (savedDriver: DeliveryMan) => void;
}

export function DeliveryManFormModal({ initialData, onClose, onSave }: ModalProps) {
 
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email || !name || (!isEditing && !password)) {
      toast.error("Nome, email e senha (na criação) são obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name, email, ...(password && { password }) };

      let response;
      if (isEditing) {
        response = await api.patch(`/deliverymen/${initialData.id}`, payload);
      } else {

        response = await api.post('/deliverymen/register', payload);
      }

      toast.success(`Entregador ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      onSave(response.data);
      onClose(); 
    } catch  {
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} entregador.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg text-gray-700 font-semibold mb-4">
          {isEditing ? 'Editar Entregador' : 'Adicionar Novo Entregador'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border text-gray-800 border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border text-gray-800 border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha {isEditing && <span className="text-xs text-gray-500">(Deixe em branco para não alterar)</span>}
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border text-gray-800 border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={onClose} className="py-2 text-gray-600 px-4 rounded border">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="py-2 px-4 rounded bg-emerald-600 text-white">
            {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
}