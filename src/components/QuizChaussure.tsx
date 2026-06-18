import { useState } from "react";
import { shoes, type Shoe } from "../data/shoes";

type Answers = Record<string, string>;

interface Question {
  id: string;
  question: string;
  help?: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "terrain",
    question: "Sur quel terrain cours-tu le plus souvent ?",
    options: [
      { value: "route", label: "Route / bitume" },
      { value: "chemins", label: "Chemins roulants (parcs, gravier)" },
      { value: "sentiers", label: "Sentiers techniques (montagne)" },
      { value: "mixte", label: "Un peu des deux" },
    ],
  },
  {
    id: "objectif",
    question: "Ton objectif principal avec cette paire ?",
    options: [
      { value: "confort", label: "Confort & protection" },
      { value: "polyvalence", label: "Polyvalence (un peu tout)" },
      { value: "performance", label: "Performance & vitesse" },
    ],
  },
  {
    id: "amorti",
    question: "Quel ressenti tu préfères sous le pied ?",
    options: [
      { value: "Moelleux", label: "Moelleux, effet nuage" },
      { value: "Ferme", label: "Ferme & dynamique" },
      { value: "Équilibré", label: "Un compromis équilibré" },
      { value: "peu_importe", label: "Peu importe" },
    ],
  },
  {
    id: "poids",
    question: "Ton poids approximatif ?",
    help: "Plus on est lourd, plus l'amorti compte.",
    options: [
      { value: "leger", label: "Moins de 70 kg" },
      { value: "moyen", label: "70 – 85 kg" },
      { value: "lourd", label: "Plus de 85 kg" },
      { value: "nsp", label: "Je préfère ne pas dire" },
    ],
  },
  {
    id: "drop",
    question: "Une préférence de drop ?",
    help: "Le drop = différence de hauteur talon / avant-pied.",
    options: [
      { value: "peu_importe", label: "Peu importe / je ne sais pas" },
      { value: "eleve", label: "Élevé (8 – 12 mm)" },
      { value: "faible", label: "Faible / naturel (0 – 6 mm)" },
    ],
  },
  {
    id: "budget",
    question: "Ton budget maximum ?",
    options: [
      { value: "bas", label: "Moins de 100 €" },
      { value: "moyen", label: "100 – 160 €" },
      { value: "haut", label: "Plus de 160 €" },
      { value: "peu_importe", label: "Peu importe" },
    ],
  },
];

function getRecommendations(answers: Answers): Shoe[] {
  let pool = shoes.slice();
  if (answers.terrain === "sentiers") {
    pool = pool.filter((s) => s.usage === "trail");
  } else if (answers.terrain === "route" || answers.terrain === "chemins") {
    pool = pool.filter((s) => s.usage === "route");
  }
  // "mixte" => on garde tout

  const scored = pool.map((s) => {
    let score = s.score; // qualité de base (8 à 9)

    if (answers.amorti && answers.amorti !== "peu_importe" && s.amorti === answers.amorti) {
      score += 3;
    }
    if (answers.drop === "eleve" && s.drop >= 8) score += 2;
    if (answers.drop === "faible" && s.drop <= 6) score += 2;

    if (answers.budget === "bas") {
      if (s.price <= 100) score += 3;
      else if (s.price <= 120) score += 1;
      else score -= 2;
    } else if (answers.budget === "moyen") {
      if (s.price <= 160) score += 2;
      else score -= 1;
    }

    if (answers.objectif === "confort") {
      if (s.amorti === "Moelleux") score += 2;
      score += s.stack / 20;
    } else if (answers.objectif === "performance") {
      if (s.amorti === "Ferme") score += 1;
      score += (300 - s.weight) / 40;
    } else if (answers.objectif === "polyvalence") {
      if (s.amorti === "Équilibré") score += 2;
    }

    if (answers.poids === "lourd") {
      if (s.amorti === "Moelleux") score += 2;
      score += s.stack / 25;
    } else if (answers.poids === "leger") {
      if (s.amorti === "Ferme") score += 1;
    }

    return { shoe: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => x.shoe);
}

export default function QuizChaussure() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = QUESTIONS.length;
  const isResults = step >= total;

  function select(id: string, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (isResults) {
    const results = getRecommendations(answers);
    return (
      <div>
        <p class="font-display font-bold text-xs tracking-[0.18em] uppercase text-corail">Résultat</p>
        <h2 class="font-display font-black text-3xl md:text-4xl text-encre mt-2 mb-2">Tes meilleures paires.</h2>
        <p class="text-encre/60 mb-8">D'après tes réponses, voici les modèles les plus adaptés.</p>

        <div class="space-y-4">
          {results.map((shoe, i) => (
            <div
              key={shoe.id}
              class={
                "rounded-2xl p-5 border " +
                (i === 0 ? "bg-encre border-encre" : "bg-white border-encre/10")
              }
            >
              <div class="aspect-[16/9] bg-blanc rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={shoe.image && shoe.image.length > 0 ? shoe.image : "/images/placeholder.svg"}
                  alt={shoe.name}
                  class="w-full h-full object-contain p-2"
                />
              </div>
              <div class="flex items-center justify-between gap-3">
                <span
                  class={
                    "text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full " +
                    (i === 0 ? "bg-volt text-encre" : "bg-bleu text-white")
                  }
                >
                  {i === 0 ? "Ta meilleure correspondance" : "Aussi à considérer"}
                </span>
                <span class="font-display font-black text-lg text-encre bg-volt rounded-lg px-2.5 py-0.5">
                  {shoe.score}
                </span>
              </div>
              <h3 class={"font-display font-extrabold text-xl mt-3 " + (i === 0 ? "text-blanc" : "text-encre")}>
                {shoe.name}
              </h3>
              <p class={"text-sm mt-1 " + (i === 0 ? "text-blanc/60" : "text-encre/50")}>{shoe.brand}</p>
              <p class={"text-sm mt-3 " + (i === 0 ? "text-blanc/80" : "text-encre/70")}>{shoe.verdict}</p>
              <div class={"text-xs mt-3 " + (i === 0 ? "text-blanc/50" : "text-encre/40")}>
                {shoe.usage === "route" ? "Route" : "Trail"} · {shoe.weight} g · drop {shoe.drop} mm ·{" "}
                amorti {shoe.amorti.toLowerCase()} · {shoe.price} €
              </div>
              <a
                href={"/chaussures/" + shoe.id}
                class={
                  "inline-block mt-4 font-display font-bold text-sm px-4 py-2 rounded-lg transition hover:opacity-90 " +
                  (i === 0 ? "bg-corail text-white" : "bg-encre text-white")
                }
              >
                Voir la fiche
              </a>
            </div>
          ))}
        </div>

        <div class="flex flex-wrap gap-3 mt-8">
          <button
            onClick={restart}
            class="font-display font-bold text-sm border border-encre/30 text-encre px-5 py-3 rounded-xl hover:border-encre transition"
          >
            Refaire le quiz
          </button>
          <a
            href="/comparateur"
            class="font-display font-bold text-sm bg-volt text-encre px-5 py-3 rounded-xl hover:opacity-90 transition"
          >
            Comparer en détail
          </a>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  return (
    <div>
      <div class="mb-8">
        <div class="flex items-center justify-between text-xs text-encre/50 mb-2">
          <span class="font-semibold uppercase tracking-wide">
            Question {step + 1} / {total}
          </span>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} class="hover:text-encre transition">
              ← Retour
            </button>
          )}
        </div>
        <div class="h-2 w-full bg-encre/10 rounded-full overflow-hidden">
          <div class="h-full bg-corail rounded-full transition-all" style={{ width: progress + "%" }} />
        </div>
      </div>

      <h2 class="font-display font-black text-2xl md:text-3xl text-encre leading-tight">{q.question}</h2>
      {q.help && <p class="text-sm text-encre/50 mt-2">{q.help}</p>}

      <div class="grid gap-3 mt-6">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => select(q.id, opt.value)}
            class="text-left bg-white border-2 border-encre/10 rounded-xl px-5 py-4 font-medium text-encre hover:border-corail hover:bg-corail/5 transition"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
