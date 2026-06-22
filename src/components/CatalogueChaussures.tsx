import { useState, useMemo } from "react";
import type { Shoe } from "../data/shoes";

export default function CatalogueChaussures({ shoes }: { shoes: Shoe[] }) {
  const [usage, setUsage] = useState<"tout" | "route" | "trail">("tout");
  const [brand, setBrand] = useState("toutes");
  const [sort, setSort] = useState("note");

  const brands = useMemo(
    () => Array.from(new Set(shoes.map((s) => s.brand))).sort((a, b) => a.localeCompare(b)),
    [shoes]
  );

  const list = useMemo(() => {
    const filtered = shoes.filter(
      (s) => (usage === "tout" || s.usage === usage) && (brand === "toutes" || s.brand === brand)
    );
    return [...filtered].sort((a, b) => {
      if (sort === "prix-asc") return a.price - b.price;
      if (sort === "prix-desc") return b.price - a.price;
      if (sort === "poids") return a.weight - b.weight;
      return b.score - a.score;
    });
  }, [shoes, usage, brand, sort]);

  const usages: { key: "tout" | "route" | "trail"; label: string }[] = [
    { key: "tout", label: "Tout" },
    { key: "route", label: "Route" },
    { key: "trail", label: "Trail" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="inline-flex rounded-xl bg-white border border-encre/10 p-1">
          {usages.map((u) => (
            <button
              key={u.key}
              onClick={() => setUsage(u.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-display font-bold transition ${
                usage === u.key ? "bg-encre text-white" : "text-encre/60 hover:text-encre"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-xl border border-encre/15 bg-white px-4 py-2.5 text-sm text-encre focus:border-corail focus:outline-none"
        >
          <option value="toutes">Toutes les marques</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-encre/15 bg-white px-4 py-2.5 text-sm text-encre focus:border-corail focus:outline-none"
        >
          <option value="note">Trier : meilleure note</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="poids">Plus légères</option>
        </select>

        <span className="text-sm text-encre/50 sm:ml-auto">
          {list.length} chaussure{list.length > 1 ? "s" : ""}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-encre/50 py-12 text-center">Aucune chaussure ne correspond à ces filtres.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((shoe) => (
            <a
              key={shoe.id}
              href={"/chaussures/" + shoe.id}
              className="group block bg-white border border-encre/10 rounded-2xl p-5 hover:border-corail transition"
            >
              <div className="aspect-[16/9] bg-blanc rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={shoe.image && shoe.image.length > 0 ? shoe.image : "/images/placeholder.svg"}
                  alt={shoe.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white ${
                    shoe.usage === "trail" ? "bg-bleu" : "bg-corail"
                  }`}
                >
                  {shoe.usage === "route" ? "Route" : "Trail"}
                </span>
                <span className="font-display font-black text-lg text-encre bg-volt rounded-lg px-2.5 py-0.5">
                  {shoe.score}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-lg text-encre mt-3 group-hover:text-corail transition">
                {shoe.name}
              </h2>
              <p className="text-sm text-encre/50 mt-1">{shoe.brand}</p>
              <p className="text-sm text-encre/60 mt-3 line-clamp-2">{shoe.verdict}</p>
              <div className="text-xs text-encre/40 mt-4">
                {shoe.weight} g · drop {shoe.drop} mm · {shoe.price} €
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
