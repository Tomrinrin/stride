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

export const shoes: Shoe[] = shoesData as Shoe[];
