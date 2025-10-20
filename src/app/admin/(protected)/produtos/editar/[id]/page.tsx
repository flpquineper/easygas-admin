'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { api } from '@/services/api';
import { Product } from '@/types/product';

export default function EditarProdutoPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`)
        .then(response => {
          const fetchedProduct = response.data;
          setProduct(fetchedProduct);
          setName(fetchedProduct.name);
          setPrice(String(fetchedProduct.price));
        })
        .catch(() => {
          toast.error("Produto não encontrado.");
          router.push('/admin/produtos');
        });
    }
  }, [id, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/products/${id}`, { name, price });
      toast.success("Produto atualizado com sucesso!");
      router.push('/admin/produtos');
    } catch{
      toast.error("Erro ao atualizar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!product) {
    return <div>Carregando produto...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Editar Produto: {product.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (ex: 69.99)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}