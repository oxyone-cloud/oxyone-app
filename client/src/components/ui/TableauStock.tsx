import { verifierAlerteStockage } from "@/lib/stockUtils";
import { AlertTriangle, Clock } from "lucide-react";

// À l'intérieur du mapping du tableau :
{stockFiltre.map((item) => {
  const alerte = verifierAlerteStockage(item);

  return (
    <TableRow 
      key={item.id} 
      className={alerte.estDepasse ? "bg-red-500/10 hover:bg-red-500/20" : "hover:bg-muted/30"}
    >
      <TableCell>
        <div className="font-mono text-xs font-bold flex items-center gap-1.5">
          <Barcode className="h-4 w-4 text-primary" />
          {item.codeBarre || "Non scanné"}
        </div>
        <div className="text-[11px] text-muted-foreground font-mono">{item.codeLot}</div>
      </TableCell>
      <TableCell className="font-medium">{item.nomProduit}</TableCell>
      <TableCell>{item.emplacement}</TableCell>
      <TableCell>{item.quantiteKg} kg</TableCell>
      <TableCell>
        <span className="flex items-center gap-1 font-semibold text-blue-500">
          <Thermometer className="h-4 w-4" />
          {item.temperatureC} °C
        </span>
      </TableCell>

      {/* Colonne Temps de Stockage & Alerte */}
      <TableCell>
        {alerte.estDepasse ? (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit animate-pulse">
            <AlertTriangle className="h-3 w-3" /> Dépassement ({alerte.joursEnStock}j / {alerte.dureeMax}j)
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1 w-fit text-slate-600">
            <Clock className="h-3 w-3" /> {alerte.joursEnStock}j / {alerte.dureeMax}j
          </Badge>
        )}
      </TableCell>

      <TableCell className="text-right space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenPrint(item)}
          title="Imprimer Code-Barres"
        >
          <Printer className="h-3.5 w-3.5 mr-1" /> Étiquette
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate(item.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
})}