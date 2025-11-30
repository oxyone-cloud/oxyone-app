// Exact configuration from the user snippet
export const CONFIG = {
  internal: {
    L: 2.74, // meters
    W: 1.83, // meters
    H: 2.00  // meters
  },
  panelThickness_m: 0.080, // 80 mm
  doorThickness_m: 0.060,  // 60 mm
  doorHeight_m: 0.80,      // meters
  ambientTemp: 25,
  storageTempDefault: 4,
  storageRange: [1, 10],
  loadDensity_kg_m2: 250
} as const;

// Mapping real-world meters to pixels for display
export const PIXELS_PER_M = 110;

export const STEPS = [
  { id: 0, label: "Étape 1 : Positionnement des panneaux (réception des modules)", description: "Déballage et préparation de la zone de montage. Vérification du sol." },
  { id: 1, label: "Étape 2 : Montage des parois latérales et alignement", description: "Assemblage des panneaux verticaux par système de crochets excentriques." },
  { id: 2, label: "Étape 3 : Fixation du plancher et du toit", description: "Pose des panneaux de sol renforcés et fermeture du plafond." },
  { id: 3, label: "Étape 4 : Installation de la porte amovible (ép. 60 mm)", description: "Mise en place du bloc porte et réglage des charnières." },
  { id: 4, label: "Étape 5 : Installation du groupe froid et tests électriques", description: "Raccordement du monobloc et branchement au secteur." },
  { id: 5, label: "Étape 6 : Test final, contrôle température & charge", description: "Mise en froid et validation des performances." }
];
