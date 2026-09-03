// Dünya çapında başlıca CNC tezgah üreticileri ve bilinen model örnekleri.
// Bu liste; marka/model alanlarında otomatik tamamlama (autocomplete) için kullanılır.
// Listede olmayan bir marka/model her zaman serbest metin olarak girilebilir.

export type CncBrandEntry = {
  name: string;
  models: string[];
};

export const CNC_BRANDS: CncBrandEntry[] = [
  // --- İşleme merkezi / Freze / Torna ---
  { name: "Haas Automation", models: ["VF-2", "VF-3", "VF-4", "VF-5", "VF-6", "ST-10", "ST-20", "ST-30", "DS-30", "UMC-750", "TL-1", "EC-400", "Mini Mill"] },
  { name: "DMG Mori", models: ["DMU 50", "DMU 65 monoBLOCK", "DMU 80 P duoBLOCK", "NLX 2500", "NLX 4000", "CTX beta 800", "CTX 510", "CMX 50 U", "NHX 4000", "NTX 1000", "NVX 5100"] },
  { name: "Mazak", models: ["VARIAXIS i-600", "VARIAXIS j-500", "INTEGREX i-200", "INTEGREX j-200", "QUICK TURN 250", "QUICK TURN Nexus 200", "VCN-530C", "HCN-5000", "VTC-800"] },
  { name: "Okuma", models: ["GENOS L300", "GENOS M560-V", "MULTUS B300", "MULTUS U3000", "MA-600HII", "MB-46VAE", "LB3000 EX", "MCR-A5C"] },
  { name: "DN Solutions (Doosan)", models: ["DNM 500", "DNM 6700", "PUMA 2600", "PUMA GT2100", "LYNX 2100", "NHM 5000", "DVF 5000"] },
  { name: "Hyundai WIA", models: ["F400", "F600D", "L210", "L300A", "SKT21", "HS4000i"] },
  { name: "Hurco", models: ["VM10i", "VMX30i", "VMX42SRTi", "TM8i", "TM10i", "BX50i"] },
  { name: "Makino", models: ["a51nx", "a61nx", "a71nx", "PS95", "D500", "D800Z", "S33", "T1"] },
  { name: "Brother", models: ["SPEEDIO S500X1", "SPEEDIO S700X1", "SPEEDIO R450X1", "SPEEDIO U500Xd1"] },
  { name: "Kitamura", models: ["Mycenter-3XiF", "Mycenter-4XiF", "HX250iG", "Mytrunnion-5X"] },
  { name: "Matsuura", models: ["MAM72-35V", "MAM72-63V", "VX-1000", "H.Plus 300", "Cubex 63"] },
  { name: "Nakamura-Tome", models: ["WT-150", "WT-300", "NTY3-100", "SC-300", "AS-200"] },
  { name: "Star Micronics", models: ["SR-32J", "SR-38", "SV-32"] },
  { name: "Citizen", models: ["Cincom L20", "Cincom A20-VII", "Cincom M32", "Cincom D25"] },
  { name: "Tsugami", models: ["B0205", "S205", "M08SY", "SS207"] },
  { name: "Takisawa", models: ["TC-2", "TC-3", "TT-2000"] },
  { name: "Hardinge", models: ["Talent 6/51", "Talent 8/51", "Conquest T51", "Bridgeport VMC 1000"] },
  { name: "Bridgeport", models: ["VMC 800", "GX 480", "Interact 6", "XR 760"] },
  { name: "Fadal", models: ["VMC 4020", "VMC 6030", "VMC 3016"] },
  { name: "Cincinnati Milacron", models: ["Arrow 500", "Sabre 750", "Arrow 750"] },
  { name: "Milltronics", models: ["VM30", "RH20", "VH20", "SL5"] },
  { name: "Hermle", models: ["C 22", "C 32", "C 42 U", "C 400", "C 650"] },
  { name: "Chiron", models: ["DZ 08", "FZ 12", "Mill 800", "Mill 1250"] },
  { name: "Grob", models: ["G350", "G550", "G750", "G160"] },
  { name: "Deckel Maho", models: ["DMU 60 monoBLOCK", "DMC 60H", "DMU 125 P"] },
  { name: "Gildemeister", models: ["CTX 310", "GMX 400", "CTX 510 ecoline"] },
  { name: "Index", models: ["G200", "C200", "MS40", "R200"] },
  { name: "Traub", models: ["TNL12", "TNL18", "TNX65"] },
  { name: "EMAG", models: ["VL2", "VSC 400", "VMC 200"] },
  { name: "Emco", models: ["Concept Turn 155", "VMC 200", "Emcoturn 342"] },
  { name: "Spinner", models: ["U5-1520", "TC600", "PD32"] },
  { name: "Feeler", models: ["FV-1000", "FTC-20", "FVL-1200"] },
  { name: "Victor Taichung", models: ["V-56", "Vturn 20", "Vcenter-100"] },
  { name: "Johnford", models: ["VMC-1000", "DMC-1300", "ST-30"] },
  { name: "Leadwell", models: ["V-40i", "LTC-30", "V-30i"] },
  { name: "Awea", models: ["VP-1000", "LP-1500", "BM-1300"] },
  { name: "Kao Ming", models: ["KMC-1000", "BMC-1600", "KMC-1300U"] },
  { name: "YCM (Yeong Chin)", models: ["NV1020A", "MV106A", "FV1050A"] },
  { name: "Litz", models: ["LC-1600", "LU-800", "V-86"] },
  { name: "Tongtai", models: ["TMV-720A", "TCM-30", "TMV-1050P"] },
  { name: "Goodway", models: ["GS-2000", "GLS-1500Y", "GA-32"] },
  { name: "Quaser", models: ["MV184", "UX600", "MF400"] },
  { name: "FFG (Fair Friend Group)", models: ["VMC 850", "MC-1000", "Sharp SV-2412"] },
  { name: "Sharp Industries", models: ["SV-2412", "LTY-20", "Sharp Turn 20"] },
  { name: "Supermax", models: ["YCM Supra 5", "VMC 1500", "Max-3VS"] },
  { name: "Romi", models: ["GL 240", "Discovery 760", "Centur 30S"] },
  { name: "TOS Varnsdorf", models: ["WHN 13", "WRD 150", "WHN 110"] },
  { name: "Pinacho", models: ["S90", "S200", "Smart Turn 200"] },
  { name: "CMZ", models: ["TA 25", "TA 45 Y", "TBI 800"] },
  { name: "Danobat", models: ["SORT", "TX", "Overbed 1600"] },
  { name: "Doosan Machine Tools", models: ["Puma 240", "DNM 4500", "Lynx 220"] },
  { name: "Kia (Kia Machine Tool)", models: ["KIT-25", "SKT-21"] },
  { name: "Samsung Machine Tools", models: ["SL20", "PL20"] },

  // --- Lazer kesim ---
  { name: "Trumpf", models: ["TruLaser 3030", "TruLaser 5030", "TruLaser Tube 7000", "TruLaser 1030", "TruLaser Cell 3000"] },
  { name: "Bystronic", models: ["BySprint Fiber 3015", "ByStar Fiber 4020", "ByJet Flex", "ByAutonom 6"] },
  { name: "Amada", models: ["ENSIS-3015", "LCG 3015", "REGIUS 3015", "FOL-3015"] },
  { name: "Salvagnini", models: ["L3", "L5", "L1X"] },
  { name: "LVD", models: ["Electra FL", "Phoenix FL", "Impuls FL"] },
  { name: "Ermaksan", models: ["Cutbend Fiber 3015", "LaserMak", "Speedy Combi"] },
  { name: "Durma", models: ["HD-Laser 3015", "FL Serisi", "HD-F 3015"] },
  { name: "Han's Laser", models: ["G3015F", "G6020", "GF Serisi"] },
  { name: "Bodor", models: ["GC 6020", "P6", "A Serisi"] },
  { name: "HSG Laser", models: ["HGS 3015", "HGF 3015"] },
  { name: "Cincinnati Incorporated", models: ["CL-960", "CL-707"] },
  { name: "Messer Cutting Systems", models: ["MetalMaster", "MultiTool", "Omnimat"] },
  { name: "Prima Power", models: ["Platino Fiber", "Combi Genius", "Laser Genius+"] },

  // --- Plazma kesim ---
  { name: "Hypertherm", models: ["Powermax 65", "Powermax 105", "XPR170", "MAXPRO200"] },
  { name: "ESAB", models: ["Victory 1250", "Avenger II", "m3 Plasma"] },
  { name: "Koike", models: ["CG Master", "D-RonicPro"] },
  { name: "Farley Laserlab", models: ["LaserWave", "Cobra Plasma"] },
  { name: "Vanguard", models: ["Cyclone", "Fusion"] },
  { name: "Burny", models: ["Phantom", "Reflex CNC"] },

  // --- Abkant pres / Sac büküm ---
  { name: "Baykal", models: ["APHS", "APB", "PBS Serisi"] },
  { name: "EHT", models: ["Variopress", "Sigma"] },
  { name: "Beyeler", models: ["PR Serisi", "Compact 100"] },
  { name: "Gasparini", models: ["GP Serisi", "GN Genius"] },
  { name: "Cidan", models: ["Combi", "Variobend"] },
  { name: "Adira", models: ["PQ Serisi", "PA Serisi"] },

  // --- Erozyon (EDM) ---
  { name: "Sodick", models: ["AQ537L", "AG60L", "AP1L", "ALN400G"] },
  { name: "Mitsubishi Electric", models: ["MV1200S", "FA30", "MP1200"] },
  { name: "GF Machining Solutions", models: ["FORM 200", "CUT 1000", "AgieCharmilles CUT 30 P"] },
  { name: "ONA Electroerosion", models: ["Vega", "NX Serisi"] },
  { name: "Chmer", models: ["CM323C", "CW540"] },
  { name: "Excetek", models: ["V650", "H500"] },
  { name: "Joemars", models: ["JM-D3225", "JM-P800"] },

  // --- CNC Router (ahşap / kompozit) ---
  { name: "Biesse", models: ["Rover A", "Rover B", "Rover K"] },
  { name: "SCM Group", models: ["Accord 30 FX", "Pratix", "Morbidelli"] },
  { name: "Homag", models: ["Venture", "BAZ Serisi", "Optimat"] },
  { name: "C.R. Onsrud", models: ["144F12", "150G12"] },
  { name: "Multicam", models: ["3000 Series", "5000 Series"] },
  { name: "AXYZ", models: ["Infinite Series", "Trident"] },
  { name: "Thermwood", models: ["Model 45", "Model 67"] },
];

// Otomatik tamamlamada tüm markalar için alfabetik marka isimleri
export const CNC_BRAND_NAMES: string[] = CNC_BRANDS.map((b) => b.name).sort((a, b) =>
  a.localeCompare(b, "tr")
);

// Marka + model çiftlerinin düz listesi (marka henüz seçilmemişken model alanında
// tüm markalardaki modeller içinde arama yapabilmek için kullanılır)
export const CNC_ALL_MODELS: { label: string; brand: string }[] = CNC_BRANDS.flatMap((b) =>
  b.models.map((m) => ({ label: m, brand: b.name }))
);
