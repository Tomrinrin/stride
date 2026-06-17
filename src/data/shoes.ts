export interface Shoe {
  id: string;
  name: string;
  brand: string;
  usage: "route" | "trail";
  drop: number;
  weight: number;
  price: number;
  score: number;
  stack: number;
  amorti: "Ferme" | "Équilibré" | "Moelleux";
}

// Données d'exemple — à terme alimentées par ton Google Sheet → JSON.
export const shoes: Shoe[] = [
  { id: "nova-glide-3", name: "Nova Glide 3", brand: "Aerys", usage: "route", drop: 8, weight: 245, price: 139, score: 8.9, stack: 36, amorti: "Équilibré" },
  { id: "tempo-lite", name: "Tempo Lite", brand: "Aerys", usage: "route", drop: 6, weight: 210, price: 149, score: 8.7, stack: 30, amorti: "Ferme" },
  { id: "summit-pro", name: "Summit Pro", brand: "Kestrel", usage: "trail", drop: 4, weight: 300, price: 175, score: 9.1, stack: 33, amorti: "Équilibré" },
  { id: "trail-apex", name: "Trail Apex", brand: "Kestrel", usage: "trail", drop: 6, weight: 285, price: 159, score: 8.6, stack: 31, amorti: "Ferme" },
  { id: "cloud-runner-x", name: "Cloudrunner X", brand: "Halo", usage: "route", drop: 10, weight: 260, price: 129, score: 8.2, stack: 38, amorti: "Moelleux" },
  { id: "ridge-gtx", name: "Ridge GTX", brand: "Vata", usage: "trail", drop: 8, weight: 320, price: 169, score: 7.9, stack: 29, amorti: "Ferme" },
];
