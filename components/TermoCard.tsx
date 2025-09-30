// components/TermoCard.tsx
"use client";

import { useState } from "react";

type Termo = {
  id: number;
  termo: string;
  definicao: string;
  fonte: string;
};

type Props = {
  termoData: Termo;
};

export default function TermoCard({ termoData }: Props) {
  const [editing, setEditing] = useState(false);
  const [termo, setTermo] = useState(termoData.termo);
  const [definicao, setDefinicao] = useState(termoData.definicao);
  const [fonte, setFonte] = useState(termoData.fonte);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/termos/${termoData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termo, definicao, fonte }),
      });
      setEditing(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow mb-4">
      {editing ? (
        <>
          <input
            className="border p-1 mb-2 w-full"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <textarea
            className="border p-1 mb-2 w-full"
            value={definicao}
            onChange={(e) => setDefinicao(e.target.value)}
          />
          <input
            className="border p-1 mb-2 w-full"
            value={fonte}
            onChange={(e) => setFonte(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => setEditing(false)}
            disabled={saving}
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <h3 className="font-bold text-lg">{termo}</h3>
          <p className="mb-1">{definicao}</p>
          <small className="text-gray-500">{fonte}</small>
          <button
            className="bg-yellow-400 text-black px-2 py-1 rounded mt-2"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        </>
      )}
    </div>
  );
}