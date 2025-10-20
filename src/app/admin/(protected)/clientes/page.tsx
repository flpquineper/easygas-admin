"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { User } from "@/types/user";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { EditUserModal } from "@/components/EditUserModal";

export default function GerenciarClientesPage() {
  const [clientes, setClientes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<User | null>(
    null
  );
  const [clienteParaEditar, setClienteParaEditar] = useState<User | null>(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await api.get("/users");
        setClientes(response.data);
      } catch {
        toast.error("Erro ao carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  async function handleDeleteCliente() {
    if (!clienteParaDeletar) return;

    try {
      await api.delete(`/users/${clienteParaDeletar.id}`);
      toast.success("Cliente removido com sucesso!");
      setClientes(clientes.filter((c) => c.id !== clienteParaDeletar.id));
    } catch {
      toast.error("Erro ao remover o cliente.");
    } finally {
      setClienteParaDeletar(null); // Fecha a modal
    }
  }

  function handleUpdateClienteNaLista(updatedUser: User) {
    setClientes(
      clientes.map((c) => (c.id === updatedUser.id ? updatedUser : c))
    );
  }

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Gerenciar Clientes
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          className="w-full max-w-lg p-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50  text-gray-600">
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  {cliente.id}
                </td>
                <td className="px-5 py-4 border-b border-gray-200  text-gray-600 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {cliente.name}
                  </p>
                  <p className="text-gray-600 whitespace-no-wrap text-xs">
                    {cliente.email}
                  </p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 text-gray-700 bg-white text-sm">
                  {cliente.phone}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm  text-gray-700 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setClienteParaEditar(cliente)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    >
                      <HiOutlinePencil size={20} />
                    </button>
                    <button
                      onClick={() => setClienteParaDeletar(cliente)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                    {clienteParaDeletar && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                          <h3 className="text-lg font-semibold">
                            Confirmar Exclusão
                          </h3>
                          <p className="my-4">
                            Tem certeza que deseja excluir o cliente{" "}
                            {clienteParaDeletar.name}?
                          </p>
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setClienteParaDeletar(null)}
                              className="py-2 px-4 rounded border"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleDeleteCliente}
                              className="py-2 px-4 rounded bg-red-600 text-white"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* // modal de edição */}
                    {clienteParaEditar && (
                      <EditUserModal
                        user={clienteParaEditar}
                        onClose={() => setClienteParaEditar(null)}
                        onSave={handleUpdateClienteNaLista}
                      />
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
