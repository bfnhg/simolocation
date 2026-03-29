export type CarCategory = "sport" | "luxe" | "eco" | "pickup";

export interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;        // MAD par jour
  fuel: string;
  transmission: string;
  seats: number;
  image: string;
  description: string;
  category: CarCategory;
  franchise: number;    // Franchise en MAD
}

export const categories: { value: CarCategory | "all"; label: string }[] = [
  { value: "all",    label: "Tous"    },
  { value: "eco",    label: "Éco"     },
  { value: "sport",  label: "Sport"   },
  { value: "pickup", label: "Pick-up" },
];

export const cars: Car[] = [
  // ─── ÉCO ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Kia Picanto",
    brand: "Kia",
    year: 2026,
    price: 25,
    fuel: "Essence",
    transmission: "Automatique",
    seats: 5,
    image: "/images/kiapicanto.webp",
    description:
      "Citadine parfaite pour naviguer dans les ruelles de Marrakech. Économique, maniable et facile à garer.",
    category: "eco",
    franchise: 300,
  },
  {
    id: 2,
    name: "Hyundai Grand i10",
    brand: "Hyundai",
    year: 2026,
    price: 30,
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/images/hyundaigrand.webp",
    description:
      "Citadine fiable et spacieuse pour sa catégorie. Idéale pour les courts séjours en ville.",
    category: "eco",
    franchise: 350,
  },
  {
    id: 3,
    name: "Renault Clio 5",
    brand: "Renault",
    year: 2026,
    price: 35,
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/images/clio.webp",
    description:
      "Compacte moderne avec écran tactile, GPS intégré, caméra de recul et finition soignée.",
    category: "eco",
    franchise: 400,
  },
  {
    id: 4,
    name: "Peugeot 208",
    brand: "Peugeot",
    year: 2026,
    price: 35,
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/images/peugeot.webp",
    description:
      "Design élégant, cockpit i-Cockpit digital et comportement sportif pour une conduite dynamique.",
    category: "eco",
    franchise: 400,
  },
  // ─── SPORT / SUV ────────────────────────────────────────────────────────
  {
    id: 5,
    name: "Renault Kardian",
    brand: "Renault",
    year: 2026,
    price: 40,
    fuel: "Essence",
    transmission: "Automatique",
    seats: 5,
    image: "/images/renaultkardian.webp",
    description:
      "Nouveau SUV urbain au design sportif et connecté. Parfait pour Marrakech et ses alentours.",
    category: "eco",
    franchise: 500,
  },
  {
    id: 6,
    name: "Hyundai Creta",
    brand: "Hyundai",
    year: 2026,
    price: 55,
    fuel: "Essence",
    transmission: "Automatique",
    seats: 5,
    image: "/images/hyundaicreta.webp",
    description:
      "SUV compact moderne avec toit panoramique, système multimédia avancé et finition premium.",
    category: "sport",
    franchise: 600,
  },
  {
    id: 7,
    name: "Hyundai Tucson",
    brand: "Hyundai",
    year: 2026,
    price: 75,
    fuel: "Diesel",
    transmission: "Automatique",
    seats: 5,
    image: "/images/hyundaitucson.webp",
    description:
      "SUV familial spacieux et confortable. Idéal pour les excursions vers Essaouira ou Agadir.",
    category: "sport",
    franchise: 800,
  },
  // ─── PICKUP ─────────────────────────────────────────────────────────────
  {
    id: 8,
    name: "Dacia Duster",
    brand: "Dacia",
    year: 2026,
    price: 45,
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/images/daciaduster.webp",
    description:
      "Le 4x4 accessible par excellence. Robuste et fiable pour les pistes du désert et l'Atlas.",
    category: "pickup",
    franchise: 700,
  },
];