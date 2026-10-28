export const mockSpecies = [
  {
    id: "HY-01",
    commonName: "Hoya Bintang",
    scientificName: "Hoya carnosa",
    category: "Hoya",
    photoUrl: "https://images.unsplash.com/photo-1610450948928-8671607a7266?w=500&q=80",
    observationCount: 24
  },
  {
    id: "KY-01",
    commonName: "Jati Emas",
    scientificName: "Tectona grandis",
    category: "Kayu",
    photoUrl: "https://images.unsplash.com/photo-1596328546171-77e37b5fec33?w=500&q=80",
    observationCount: 156
  },
  {
    id: "PL-01",
    commonName: "Fitoplankton Hijau",
    scientificName: "Chlorophyta",
    category: "Plankton",
    photoUrl: "https://images.unsplash.com/photo-1638271707963-3aabfa996917?w=500&q=80",
    observationCount: 1042
  }
];

export const mockObservations = [
  {
    id: "OBS-01",
    status: "validated",
    latitude: -2.5,
    longitude: 118,
    photoUrl: "https://images.unsplash.com/photo-1596328546171-77e37b5fec33?w=500&q=80",
    speciesName: "Jati Emas",
    scientificName: "Tectona grandis",
    date: "2026-03-11",
    observer: "Tim Riset BRIN"
  },
  {
    id: "OBS-02",
    status: "validated",
    latitude: -1.0,
    longitude: 114,
    photoUrl: "https://images.unsplash.com/photo-1610450948928-8671607a7266?w=500&q=80",
    speciesName: "Hoya Bintang",
    scientificName: "Hoya carnosa",
    date: "2026-03-10",
    observer: "Vina"
  }
];

export const stats = {
  totalObservations: 2042,
  totalSpecies: 314,
  totalContributors: 128
};