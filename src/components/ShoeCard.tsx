import type { Shoe } from "../data/shoes";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-encre/50">{label}</div>
      <div className="font-display font-bold text-base text-encre">{value}</div>
    </div>
  );
}

interface Props {
  shoe: Shoe;
  selected?: boolean;
  onToggle?: () => void;
}

export default function ShoeCard({ shoe, selected = false, onToggle }: Props) {
  const img = shoe.image && shoe.image.length > 0 ? shoe.image : "/images/placeholder.svg";
  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition ${
        selected ? "border-corail ring-1 ring-corail" : "border-encre/10"
      }`}
    >
      <div className="aspect-[16/9] bg-blanc rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <img src={img} alt={shoe.name} loading="lazy" className="w-full h-full object-contain p-2" />
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white ${
              shoe.usage === "trail" ? "bg-bleu" : "bg-corail"
            }`}
          >
            {shoe.usage}
          </span>
          <h3 className="font-display font-extrabold text-xl text-encre mt-2">{shoe.name}</h3>
          <p className="text-sm text-encre/50 mb-1">{shoe.brand} · 2026</p>
          <p className="text-sm text-encre/70 italic mb-4">{shoe.verdict}</p>

          <div className="flex gap-5 mb-4">
            <Spec label="Drop" value={`${shoe.drop} mm`} />
            <Spec label="Poids" value={`${shoe.weight} g`} />
            <Spec label="Prix" value={`${shoe.price} €`} />
          </div>

          {onToggle ? (
            <button
              onClick={onToggle}
              className={`font-display font-bold text-sm px-3.5 py-2 rounded-lg transition ${
                selected ? "bg-encre text-volt" : "bg-corail text-white hover:opacity-90"
              }`}
            >
              {selected ? "✓ Ajoutée" : "+ Comparer"}
            </button>
          ) : (
            <a
              href={"/chaussures/" + shoe.id}
              className="inline-block font-display font-bold text-sm bg-corail text-white px-3.5 py-2 rounded-lg hover:opacity-90 transition"
            >
              Voir la fiche
            </a>
          )}
        </div>

        <div className="bg-volt rounded-2xl w-[74px] min-w-[74px] h-[74px] flex flex-col items-center justify-center">
          <div className="font-display font-black text-2xl text-encre leading-none">{shoe.score.toFixed(1)}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#3A4A00]">score</div>
        </div>
      </div>
    </div>
  );
}
