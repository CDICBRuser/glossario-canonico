"use client";

import { useEffect, useState } from "react";

interface Termo {
  id: number;
  termo: string;
  definicao: string;
  fonte: string;
}

export default function Home() {
  const [termos, setTermos] = useState<Termo[]>([]);
  const [novoForm, setNovoForm] = useState({ termo: "", definicao: "", fonte: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ termo: "", definicao: "", fonte: "" });
  const [search, setSearch] = useState("");

  // Carregar termos da API
  async function carregar() {
    const res = await fetch("/api/termos");
    const data: Termo[] = await res.json();
    data.sort((a, b) => a.termo.localeCompare(b.termo));
    setTermos(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  // Criar novo termo
  async function criarNovo(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/termos", {
      method: "POST",
      body: JSON.stringify(novoForm),
    });
    setNovoForm({ termo: "", definicao: "", fonte: "" });
    carregar();
  }

  // Atualizar termo existente
  async function atualizar(e: React.FormEvent) {
    e.preventDefault();
    if (editId !== null) {
      await fetch(`/api/termos/${editId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      setEditForm({ termo: "", definicao: "", fonte: "" });
      carregar();
    }
  }

  // Apagar termo
  async function apagar(id: number) {
    if (confirm("Deseja realmente apagar este termo?")) {
      await fetch(`/api/termos/${id}`, { method: "DELETE" });
      carregar();
    }
  }

  // Iniciar edição
  function editar(t: Termo) {
    setEditId(t.id);
    setEditForm({ termo: t.termo, definicao: t.definicao, fonte: t.fonte });
  }

  // Filtrar termos pela busca
  const termosFiltrados = termos.filter((t) =>
    t.termo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        📖 Glossário Canônico
      </h1>

      {/* Campo de busca */}
      <input
        className="border p-3 rounded-lg w-full mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Buscar termo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lista de termos */}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Card de criação */}
        <li className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
          <strong className="text-lg text-blue-700">➕ Adicionar novo termo</strong>
          <input
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Termo"
            value={novoForm.termo}
            onChange={(e) => setNovoForm({ ...novoForm, termo: e.target.value })}
          />
          <textarea
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Definição"
            value={novoForm.definicao}
            onChange={(e) => setNovoForm({ ...novoForm, definicao: e.target.value })}
          />
          <input
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Fonte"
            value={novoForm.fonte}
            onChange={(e) => setNovoForm({ ...novoForm, fonte: e.target.value })}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            onClick={criarNovo}
          >
            Adicionar Termo
          </button>
        </li>

        {termosFiltrados.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">
            Nenhum termo encontrado.
          </p>
        ) : (
          termosFiltrados.map((t) => (
            <li
              key={t.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition"
            >
              {editId === t.id ? (
                <form onSubmit={atualizar} className="flex flex-col gap-2">
                  <input
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editForm.termo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, termo: e.target.value })
                    }
                    required
                  />
                  <textarea
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editForm.definicao}
                    onChange={(e) =>
                      setEditForm({ ...editForm, definicao: e.target.value })
                    }
                    required
                  />
                  <input
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editForm.fonte}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fonte: e.target.value })
                    }
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      type="submit"
                    >
                      Atualizar
                    </button>
                    <button
                      className="bg-gray-400 text-black px-3 py-1 rounded hover:bg-gray-500 transition"
                      onClick={() => setEditId(null)}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <strong className="text-xl text-blue-700">{t.termo}</strong>
                    <p className="mt-2">{t.definicao}</p>
                    <em className="text-sm text-gray-500 mt-1">Fonte: {t.fonte}</em>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                      onClick={() => editar(t)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => apagar(t.id)}
                    >
                      Apagar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}