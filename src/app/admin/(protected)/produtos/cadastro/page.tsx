'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { api } from '@/services/api';

export default function NovoProdutoPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name || !price || !imageFile) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Produto criado com sucesso!");
      router.push('/admin/produtos'); 
    } catch {
      toast.error("Erro ao criar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (ex: 69.99)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}