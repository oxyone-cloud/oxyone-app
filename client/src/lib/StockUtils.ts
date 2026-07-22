import { StockItem } from "@shared/schema";

export function verifierAlerteStockage(item: StockItem) {
  const dateEntree = item.misEnStockLe ? new Date(item.misEnStockLe) : new Date();
  const aujourdhui = new Date();

  // Calcul de la différence en jours
  const diffTemps = Math.abs(aujourdhui.getTime() - dateEntree.getTime());
  const joursEnStock = Math.floor(diffTemps / (1000 * 3600 * 24));

  const dureeMax = (item as any).dureeMaxJours || 30; // 30 jours par défaut
  const estDepasse = joursEnStock > dureeMax;

  return {
    joursEnStock,
    dureeMax,
    estDepasse,
    joursRestants: dureeMax - joursEnStock,
  };
}