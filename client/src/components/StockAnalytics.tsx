import React from "react";
import { StockItem } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, PieChart as PieIcon } from "lucide-react";

interface Props {
  stock: StockItem[];
}

export function StockAnalytics({ stock }: Props) {
  // Agrégation des données par chambre / emplacement
  const chartData = stock.reduce((acc, item) => {
    const key = item.emplacement || "Non assigné";
    const existing = acc.find((d) => d.emplacement === key);
    const qte = parseFloat(item.quantiteKg) || 0;
    const temp = parseFloat(item.temperatureC) || 0;

    if (existing) {
      existing.quantiteKg += qte;
      existing.tempTotal += temp;
      existing.count += 1;
      existing.tempMoyenne = parseFloat((existing.tempTotal / existing.count).toFixed(1));
    } else {
      acc.push({
        emplacement: key,
        quantiteKg: qte,
        tempTotal: temp,
        count: 1,
        tempMoyenne: temp,
      });
    }
    return acc;
  }, [] as Array<{ emplacement: string; quantiteKg: number; tempTotal: number; count: number; tempMoyenne: number }>);

  // Fonction d'export CSV / Excel
  const exportToExcel = () => {
    if (stock.length === 0) return;

    const headers = ["ID", "Code-Barres", "Code Lot", "Produit", "Emplacement", "Quantité (kg)", "Température (°C)", "Statut"];
    const rows = stock.map((item) => [
      item.id,
      `"${item.codeBarre || ""}"`,
      `"${item.codeLot}"`,
      `"${item.nomProduit}"`,
      `"${item.emplacement}"`,
      item.quantiteKg,
      item.temperatureC,
      item.statut,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" + // BOM UTF-8 pour Excel
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Stock_OxyONE_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Barre d'action Export */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-primary" />
          Répartition & Volumes par Chambre Froide
        </h3>
        <Button variant="outline" size="sm" onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4 text-green-600" /> Exporter en Excel (.CSV)
        </Button>
      </div>

      {/* Graphique Recharts */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl h-72 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Aucune donnée à afficher dans le graphique.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="emplacement" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="quantiteKg" name="Volume Total (kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="tempMoyenne" name="Température Moy. (°C)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}