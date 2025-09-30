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
  const [form, setForm] = useState({ termo: "", definicao: "", fonte: "" });
  const [editId, setEditId] = useState<number | null>(null);
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

  // Criar ou atualizar termo
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/termos/${editId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/termos", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }
    setForm({ termo: "", definicao: "", fonte: "" });
    carregar();
  }

  // Apagar termo
  async function apagar(id: number) {
    if (confirm("Deseja realmente apagar este termo?")) {
      await fetch(`/api/termos/${id}`, { method: "DELETE" });
      carregar();
    }
  }

  // Editar termo
  function editar(t: Termo) {
    setForm({ termo: t.termo, definicao: t.definicao, fonte: t.fonte });
    setEditId(t.id);
  }

  // Filtrar termos pela busca
  const termosFiltrados = termos.filter((t) =>
    t.termo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">📖 Glossário Canônico</h1>

      {/* Campo de busca */}
      <input
        className="border p-3 rounded-lg w-full mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Buscar termo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Formulário */}
      <form onSubmit={salvar} className="flex flex-col gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
        <input
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Termo"
          value={form.termo}
          onChange={(e) => setForm({ ...form, termo: e.target.value })}
          required
        />
        <textarea
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Definição"
          value={form.definicao}
          onChange={(e) => setForm({ ...form, definicao: e.target.value })}
          required
        />
        <input
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Fonte (cânon)"
          value={form.fonte}
          onChange={(e) => setForm({ ...form, fonte: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          {editId ? "Atualizar Termo" : "Adicionar Termo"}
        </button>
      </form>

      {/* Lista de termos */}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {termosFiltrados.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">Nenhum termo encontrado.</p>
        ) : (
          termosFiltrados.map((t) => (
            <li
              key={t.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition"
            >
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
            </li>
          ))
        )}
      </ul>
    </main>
  );
}

