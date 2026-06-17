import { useState } from "react";
import type { Shoe } from "../data/shoes";
import ShoeCard from "./ShoeCard";

const FILTERS = [
  { id: "tout", label: "Tout" },
  { id: "route", label: "Route" },
  { id: "trail", label: "Trail" },
] as const;

const MAX = 4;

interface RowConfig {
  label: string;
  get: (s: Shoe) => string;
  best?: (s: Shoe) => boolean;
}

function ComparisonTable({
  chosen,
  rows,
  onRemove,
  onReset,
}: {
  chosen: Shoe[];
  rows: RowConfig[];
  onRemove: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="bg-white border border-encre/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-extrabold text-xl text-encre">La comparaison</h2>
        <button onClick={onReset} className="text-sm font-medium text-corail hover:underline">
          Réinitialiser
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left w-32"></th>
              {chosen.map((s) => (
                <th key={s.id} className="px-3 py-2 align-top text-center min-w-[130px]">
                  <div className="font-display font-extrabold text-encre text-lg leading-tight">{s.name}</div>
                  <div className="text-xs text-encre/50">{s.brand}</div>
                  <button
                    onClick={() => onRemove(s.id)}
                    className="mt-1 text-xs text-encre/40 hover:text-corail transition"
                  >
                    retirer
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 1 ? "bg-encre/[0.02]" : ""}>
                <td className="px-3 py-3 text-xs uppercase tracking-wide text-encre/50 font-medium">{row.label}</td>
                {chosen.map((s) => {
                  const isBest = row.best ? row.best(s) : false;
                  return (
                    <td key={s.id} className="px-2 py-3 text-center">
                      <span
                        className={
                          isBest
                            ? "inline-block bg-volt font-display font-extrabold text-encre px-3 py-1 rounded-lg"
                            : "font-display font-bold text-encre"
                        }
                      >
                        {row.get(s)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-encre/50 mt-4">
        <span className="inline-block w-3 h-3 rounded-sm bg-volt align-middle mr-1"></span>
        = la meilleure valeur de ta sélection.
      </p>
    </div>
  );
}

export default function ComparateurTool({ shoes }: { shoes: Shoe[] }) {
  const [filter, setFilter] = useState<string>("tout");
  const [selected, setSelected] = useState<string[]>([]);

  const pool = filter === "tout" ? shoes : shoes.filter((s) => s.usage === filter);
  const chosen = shoes.filter((s) => selected.includes(s.id));

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= MAX ? prev : [...prev, id]
    );

  const bestScore = chosen.length ? Math.max(...chosen.map((s) => s.score)) : null;
  const bestPrix = chosen.length ? Math.min(...chosen.map((s) => s.price)) : null;
  const bestPoids = chosen.length ? Math.min(...chosen.map((s) => s.weight)) : null;

  const rows: RowConfig[] = [
    { label: "Score", get: (s) => s.score.toFixed(1), best: (s) => s.score === bestScore },
    { label: "Prix", get: (s) => `${s.price} €`, best: (s) => s.price === bestPrix },
    { label: "Poids", get: (s) => `${s.weight} g`, best: (s) => s.weight === bestPoids },
    { label: "Drop", get: (s) => `${s.drop} mm` },
    { label: "Hauteur (stack)", get: (s) => `${s.stack} mm` },
    { label: "Amorti", get: (s) => s.amorti },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {FILTERS.map((o) => (
          <button
            key={o.id}
            onClick={() => setFilter(o.id)}
            className={`font-display font-bold text-sm px-4 py-2 rounded-full border transition ${
              filter === o.id
                ? "bg-encre text-volt border-encre"
                : "bg-transparent text-encre/70 border-encre/15 hover:border-encre/40"
            }`}
          >
            {o.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-encre/50">{selected.length}/{MAX} sélectionnées</span>
      </div>

      {chosen.length >= 2 && (
        <div className="mb-10">
          <ComparisonTable chosen={chosen} rows={rows} onRemove={toggle} onReset={() => setSelected([])} />
        </div>
      )}

      {chosen.length === 1 && (
        <p className="mb-8 text-sm text-encre/70 bg-volt/30 border border-volt rounded-xl px-4 py-3">
          Ajoute au moins une 2ᵉ chaussure pour lancer la comparaison.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {pool.map((s) => (
          <ShoeCard key={s.id} shoe={s} selected={selected.includes(s.id)} onToggle={() => toggle(s.id)} />
        ))}
      </div>
    </div>
  );
}
