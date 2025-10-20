// src/app/admin/(protected)/produtos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { Product } from "@/types/product";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";

export default function GerenciarProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch {
        toast.error("Erro ao carregar a lista de produtos.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function handleDeleteProduct() {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/${productToDelete.id}`);
      toast.success("Produto removido com sucesso!");
      setProducts(products.filter((p) => p.id !== productToDelete.id));
    } catch {
      toast.error("Erro ao remover o produto.");
    } finally {
      setProductToDelete(null);
    }
  }

  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Gerenciar Produtos
        </h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-emerald-600 font-bold text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Novo Produto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Imagem
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-cover rounded"
                  />
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-700 whitespace-no-wrap">
                    {product.name}
                  </p>
                </td>
                <td className="px-5 py-4 border-b text-gray-700 border-gray-200 bg-white text-sm">
                  R$ {Number(product.price).toFixed(2).replace(".", ",")}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                  <div className="flex justify-center gap-4">
                    <Link
                      href={`/admin/produtos/editar/${product.id}`}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    >
                      <HiOutlinePencil size={20} />
                    </Link>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <HiOutlineTrash size={20} />
                    </button>

                    {productToDelete && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                          <h3 className="text-lg font-semibold text-black">
                            Confirmar Exclusão
                          </h3>
                          <p className="my-4 text-gray-700">
                            Tem certeza que deseja excluir o produto {productToDelete.name}?
                          </p>
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setProductToDelete(null)}
                              className="py-2 px-4 rounded border text-black"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleDeleteProduct}
                              className="py-2 px-4 rounded bg-red-600 text-white"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
