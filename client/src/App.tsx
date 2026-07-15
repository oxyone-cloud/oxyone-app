import React, { useState, useEffect } from 'react';

interface Maillon {
  id: string;
  nom: string;
  type: 'stockage' | 'transport' | 'chambre_froide' | 'client';
  tempConsigne: number;
  tempActuelle: number;
  unites: number;
  dernierControle: string;
  controleStatut: 'VALIDE' | 'EN_COURS' | 'ECHEC';
  pointsDeControle: string[];
}

export default function App() {
  const [maillons, setMaillons] = useState<Maillon[]>([
    {
      id: '1',
      nom: '1. Stockage Central (Zone Négative)',
      type: 'stockage',
      tempConsigne: -22,
      tempActuelle: -21.8,
      unites: 1200,
      dernierControle: '14:05',
      controleStatut: 'VALIDE',
      pointsDeControle: ['Dégivrage automatique OK', 'Ventilation forcée active', 'Enregistreur étalonné']
    },
    {
      id: '2',
      nom: '2. Camion Frigo #04 (Transport)',
      type: 'transport',
      tempConsigne: -18,
      tempActuelle: -17.2,
      unites: 350,
      dernierControle: '13:50',
      controleStatut: 'VALIDE',
      pointsDeControle: ['Prise de température à l\'embarquement', 'Étanchéité des portes', 'Enregistrement GPS actif']
    },
    {
      id: '3',
      nom: '3. Chambre Froide Hypermarché (Réception)',
      type: 'chambre_froide',
      tempConsigne: 3,
      tempActuelle: 5.4,
      unites: 420,
      dernierControle: '14:10',
      controleStatut: 'EN_COURS',
      pointsDeControle: ['Contrôle à cœur des produits', 'Temps d\'exposition sur quai < 15 min', 'Vérification du groupe froid']
    },
    {
      id: '4',
      nom: '4. Zone de Retrait (Client Final)',
      type: 'client',
      tempConsigne: 4,
      tempActuelle: 4.1,
      unites: 25,
      dernierControle: '14:00',
      controleStatut: 'VALIDE',
      pointsDeControle: ['Sac isotherme fourni', 'Signature de décharge thermique', 'Temps d\'attente < 10 min']
    }
  ]);

  const [maillonSelectionne, setMaillonSelectionne] = useState<Maillon | null>(maillons[0]);

  // États pour la recherche, le filtrage et le tri du tableau dynamique
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<'TOUS' | 'VALIDE' | 'EN_COURS' | 'ECHEC'>('TOUS');
  const [triColonne, setTriColonne] = useState<'nom' | 'tempActuelle' | 'unites'>('nom');
  const [triAscendant, setTriAscendant] = useState(true);

  // Simulation des fluctuations de température
  useEffect(() => {
    const interval = setInterval(() => {
      setMaillons(prev =>
        prev.map(m => {
          const variation = (Math.random() - 0.5) * 0.8;
          const nouvelleTemp = parseFloat((m.tempActuelle + variation).toFixed(1));
          const ecart = Math.abs(nouvelleTemp - m.tempConsigne);

          let nouveauStatut = m.controleStatut;
          if (ecart > 3.5) nouveauStatut = 'ECHEC';
          else if (ecart > 1.8 && m.controleStatut === 'VALIDE') nouveauStatut = 'EN_COURS';

          return {
            ...m,
            tempActuelle: nouvelleTemp,
            controleStatut: nouveauStatut
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const validerControle = (id: string) => {
    const heureActuelle = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setMaillons(prev =>
      prev.map(m => {
        if (m.id === id) {
          const ecart = Math.abs(m.tempActuelle - m.tempConsigne);
          return {
            ...m,
            controleStatut: ecart < 3 ? 'VALIDE' : 'ECHEC',
            dernierControle: heureActuelle
          };
        }
        return m;
      })
    );
  };

  // Traitement dynamique des données (Filtre + Recherche + Tri)
  const maillonsTraites = maillons
    .filter(m => {
      const matchRecherche = m.nom.toLowerCase().includes(recherche.toLowerCase());
      const matchFiltre = filtreStatut === 'TOUS' || m.controleStatut === filtreStatut;
      return matchRecherche && matchFiltre;
    })
    .sort((a, b) => {
      let valeurA = a[triColonne];
      let valeurB = b[triColonne];

      if (typeof valeurA === 'string' && typeof valeurB === 'string') {
        return triAscendant ? valeurA.localeCompare(valeurB) : valeurB.localeCompare(valeurA);
      }
      if (typeof valeurA === 'number' && typeof valeurB === 'number') {
        return triAscendant ? valeurA - valeurB : valeurB - valeurA;
      }
      return 0;
    });

  const basculerTri = (colonne: 'nom' | 'tempActuelle' | 'unites') => {
    if (triColonne === colonne) {
      setTriAscendant(!triAscendant);
    } else {
      setTriColonne(colonne);
      setTriAscendant(true);
    }
  };

  return (
    <div style={{
      background: '#0d0f12',
      color: '#00ff41',
      fontFamily: 'monospace',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* En-tête */}
      <header style={{
        borderBottom: '2px solid #00ff41',
        paddingBottom: '15px',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '2px' }}>OxyONE // SYSTÈME DE CONTRÔLE DYNAMIQUE</h1>
        <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.8rem' }}>
          Visualisation temps réel et supervision de la chaîne logistique du froid
        </p>
      </header>

      {/* Barre d'outils dynamique (Recherche et Filtres) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        background: '#14181f',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #2a3545',
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Recherche */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>RECHERCHER</span>
            <input 
              type="text" 
              placeholder="Ex: Camion, Chambre..." 
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={{
                background: '#0d0f12',
                border: '1px solid #00ff41',
                color: '#00ff41',
                padding: '8px',
                fontFamily: 'monospace',
                outline: 'none',
                borderRadius: '3px'
              }}
            />
          </div>

          {/* Filtre Statut */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>STATUT CONTRÔLE</span>
            <select 
              value={filtreStatut} 
              onChange={(e) => setFiltreStatut(e.target.value as any)}
              style={{
                background: '#0d0f12',
                border: '1px solid #00ff41',
                color: '#00ff41',
                padding: '8px',
                fontFamily: 'monospace',
                outline: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              <option value="TOUS">Tous les maillons</option>
              <option value="VALIDE">Conforme (VALIDE)</option>
              <option value="EN_COURS">Vigilance (EN COURS)</option>
              <option value="ECHEC">Rupture (ECHEC)</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          Lignes affichées : <strong style={{ color: '#00ff41' }}>{maillonsTraites.length} / {maillons.length}</strong>
        </div>
      </div>

      {/* Tableau Dynamique */}
      <div style={{
        background: '#14181f',
        border: '1px solid #2a3545',
        borderRadius: '5px',
        overflowX: 'auto',
        marginBottom: '25px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #2a3545', background: '#1c222b' }}>
              <th 
                onClick={() => basculerTri('nom')} 
                style={{ padding: '12px', cursor: 'pointer', userSelect: 'none', color: triColonne === 'nom' ? '#00ff41' : '#fff' }}
              >
                MAILLON {triColonne === 'nom' ? (triAscendant ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '12px', color: '#fff' }}>CONSIGNE</th>
              <th 
                onClick={() => basculerTri('tempActuelle')} 
                style={{ padding: '12px', cursor: 'pointer', userSelect: 'none', color: triColonne === 'tempActuelle' ? '#00ff41' : '#fff' }}
              >
                TEMP. REELLE {triColonne === 'tempActuelle' ? (triAscendant ? '▲' : '▼') : '↕'}
              </th>
              <th 
                onClick={() => basculerTri('unites')} 
                style={{ padding: '12px', cursor: 'pointer', userSelect: 'none', color: triColonne === 'unites' ? '#00ff41' : '#fff' }}
              >
                UNITE STOCK {triColonne === 'unites' ? (triAscendant ? '▲' : '▼') : '↕'}
              </th>
              <th style={{ padding: '12px', color: '#fff' }}>STATUT</th>
              <th style={{ padding: '12px', color: '#fff' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {maillonsTraites.map(m => {
              const ecart = Math.abs(m.tempActuelle - m.tempConsigne);
              let couleurTemp = '#00ff41';
              if (ecart > 3) couleurTemp = '#ff3b30';
              else if (ecart > 1.5) couleurTemp = '#ffb300';

              return (
                <tr 
                  key={m.id} 
                  onClick={() => setMaillonSelectionne(m)}
                  style={{ 
                    borderBottom: '1px solid #222c3a', 
                    cursor: 'pointer',
                    background: maillonSelectionne?.id === m.id ? '#1c222b' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{m.nom}</td>
                  <td style={{ padding: '12px', color: '#888' }}>{m.tempConsigne} °C</td>
                  <td style={{ padding: '12px', color: couleurTemp, fontWeight: 'bold' }}>{m.tempActuelle} °C</td>
                  <td style={{ padding: '12px' }}>{m.unites} U</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      background: m.controleStatut === 'VALIDE' ? '#00ff4122' : m.controleStatut === 'EN_COURS' ? '#ffb30022' : '#ff3b3022',
                      color: m.controleStatut === 'VALIDE' ? '#00ff41' : m.controleStatut === 'EN_COURS' ? '#ffb300' : '#ff3b30',
                      border: `1px solid ${m.controleStatut === 'VALIDE' ? '#00ff41' : m.controleStatut === 'EN_COURS' ? '#ffb300' : '#ff3b30'}`
                    }}>
                      {m.controleStatut}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        validerControle(m.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #00ff41',
                        color: '#00ff41',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      Inspecter ✓
                    </button>
                  </td>
                </tr>
              );
            })}
            {maillonsTraites.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                  Aucun maillon ne correspond aux critères de recherche actuels.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Volet de Détail Contextuel */}
      {maillonSelectionne && (
        <div style={{
          background: '#14181f',
          border: '1px solid #00ff41',
          padding: '20px',
          borderRadius: '5px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
              [ RAPPORT ACTUFIER : {maillonSelectionne.nom.toUpperCase()} ]
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>
              Dernier contrôle enregistré : <strong>{maillonSelectionne.dernierControle}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#00ff41', display: 'block', marginBottom: '8px' }}>
                PROTOCOLES DE SÉCURITÉ REQUIS :
              </span>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6' }}>
                {maillonSelectionne.pointsDeControle.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div style={{ borderLeft: '1px solid #222c3a', paddingLeft: '15px' }}>
              <span style={{ fontSize: '0.8rem', color: '#00ff41', display: 'block', marginBottom: '8px' }}>
                DIVERGENCES DÉTECTÉES :
              </span>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>
                Écart thermique :{' '}
                <strong style={{
                  color: Math.abs(maillonSelectionne.tempActuelle - maillonSelectionne.tempConsigne) > 3 ? '#ff3b30' : '#00ff41'
                }}>
                  {Math.abs(maillonSelectionne.tempActuelle - maillonSelectionne.tempConsigne).toFixed(1)} °C
                </strong>
                <br />
                {Math.abs(maillonSelectionne.tempActuelle - maillonSelectionne.tempConsigne) > 3 
                  ? "⚠️ Rupture critique du flux de froid détectée. Action corrective obligatoire."
                  : "✓ Système stable. Aucune anomalie détectée."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}