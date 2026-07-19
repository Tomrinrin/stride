import shoesData from "./shoes.json";

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  usage: "route" | "trail";
  image?: string;
  drop: number;
  weight: number;
  price: number;
  score: number;
  stack: number;
  amorti: "Ferme" | "Équilibré" | "Moelleux";
  verdict: string;
  affiliateUrl?: string;
  pronation?: string;
  plaqueCarbone?: boolean;
  impermeable?: boolean;
  largeur?: string;
}

// Visuel de marque généré automatiquement quand une chaussure n'a pas de photo.
// S'adapte aux specs : épaisseur de semelle = stack, crampons = trail, trait volt = plaque carbone.
function esc(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(name: string, max = 17): string[] {
  const words = name.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= max) cur = (cur + " " + w).trim();
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

function placeholder(s: Shoe): string {
  const route = s.usage === "route";
  const accent = route ? "#FF4D2E" : "#2B4BFF";
  const tint = route ? "#FFF2EE" : "#EDF1FF";
  const label = route ? "ROUTE" : "TRAIL";
  const trail = s.usage === "trail";
  const carbon = !!s.plaqueCarbone;

  const T = Math.max(18, Math.min(40, 20 + ((s.stack - 30) / 15) * 18));
  const bot = 100, top = bot - T;
  const r = (n: number) => Math.round(n);

  let sole = "";
  if (trail) {
    for (let x = 34; x < 270; x += 20)
      sole += `<rect x="${x}" y="${r(bot + 2)}" width="9" height="8" rx="2" fill="${accent}"/>`;
  } else {
    sole = `<path d="M 24 ${r(bot - 2)} L 282 ${r(bot - 2)}" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.4"/>`;
  }
  const plate = carbon
    ? `<path d="M 30 ${r((top + bot) / 2)} L 274 ${r((top + bot) / 2)}" stroke="#D6FF3C" stroke-width="5" stroke-linecap="round"/>`
    : "";

  const lines = wrap(s.name).map(esc);
  const brand = esc(s.brand.toUpperCase());
  const nameTxt = lines.length === 1
    ? `<text x="300" y="322" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700" fill="#6B7280" letter-spacing="2">${brand}</text><text x="300" y="360" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#14141A">${lines[0]}</text>`
    : `<text x="300" y="308" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" fill="#6B7280" letter-spacing="2">${brand}</text><text x="300" y="341" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="800" fill="#14141A">${lines[0]}</text><text x="300" y="376" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="800" fill="#14141A">${lines[1]}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><g transform="translate(36,32)"><path d="M0 4 L17 19 L0 34" fill="none" stroke="${accent}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4 L33 19 L16 34" fill="none" stroke="#D6FF3C" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/></g><g transform="translate(482,34)"><rect width="82" height="30" rx="15" fill="${accent}"/><text x="41" y="20" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" fill="#fff" letter-spacing="1.5">${label}</text></g><g transform="translate(150,92)"><path d="M 40 ${r(top)} L 250 ${r(top)} C 270 ${r(top)} 284 ${r(top + 7)} 287 ${r(bot - 8)} C 289 ${r(bot - 1)} 283 ${r(bot + 3)} 273 ${r(bot + 3)} L 40 ${r(bot + 3)} C 30 ${r(bot + 3)} 14 ${r(bot - 1)} 16 ${r(bot - 9)} C 18 ${r(top + 6)} 26 ${r(top)} 40 ${r(top)} Z" fill="#FFFFFF"/><path d="M 40 ${r(top)} C 40 ${r(top - 16)} 50 ${r(top - 28)} 70 ${r(top - 32)} C 78 ${r(top - 34)} 85 ${r(top - 31)} 87 ${r(top - 22)} C 89 ${r(top - 14)} 95 ${r(top - 9)} 103 ${r(top - 10)} C 115 ${r(top - 12)} 125 ${r(top - 19)} 135 ${r(top - 28)} L 161 ${r(top - 41)} C 189 ${r(top - 51)} 221 ${r(top - 50)} 247 ${r(top - 37)} C 259 ${r(top - 31)} 263 ${r(top - 21)} 261 ${r(top - 9)} L 259 ${r(top)} Z" fill="${accent}"/><path d="M 112 ${r(top - 18)} l 16 -9 M 125 ${r(top - 12)} l 17 -10 M 138 ${r(top - 7)} l 17 -10" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity="0.9"/>${plate}${sole}</g>${nameTxt}</svg>`;

  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export const shoes: Shoe[] = (shoesData as Shoe[]).map((s) => ({
  ...s,
  image: s.image && s.image.length > 0 ? s.image : placeholder(s),
}));
