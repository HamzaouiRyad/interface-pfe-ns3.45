# 📖 Guide d'Intégration - Page de Comparaison 4G/5G

## 🎯 Fichiers créés

```
src/app/comparison/
└── page.tsx                              (Page principale avec upload CSV)

src/components/comparison/
├── ThroughputChart.tsx                  (Débit vs Temps)
├── RSRPChart.tsx                        (RSRP vs Distance)
├── LatencyChart.tsx                     (Latence avec badge TTI)
├── SINRChart.tsx                        (SINR vs Temps)
├── PacketLossChart.tsx                  (Histogramme de perte)
└── PowerConversionSection.tsx           (Formule + Table + Courbe)

public/
├── Fichier-4g.csv                       (Exemple données 4G)
└── Fichier_5g.csv                       (Exemple données 5G)

COMPARISON_PAGE_README.md                (Documentation complète)
INTEGRATION_GUIDE.md                     (Ce fichier)
```

## 🚀 Démarrage rapide

### 1. Démarrer en développement
```bash
npm run dev
```
Puis accédez à: `http://localhost:3000/comparison`

### 2. Build production
```bash
npm run build
npm run start
```

## 📊 Description des graphiques

### Graphe 1 - Débit (Throughput)
- **Fichier**: `ThroughputChart.tsx`
- **Type**: Line Chart (2 courbes)
- **Données**: Débit 4G (rouge) vs 5G (bleu) au fil du temps

### Graphe 2 - RSRP vs Distance
- **Fichier**: `RSRPChart.tsx`
- **Type**: Line Chart (3 courbes UE)
- **Données**: Signal 3 équipements utilisateurs avec distance

### Graphe 3 - Latence / TTI
- **Fichier**: `LatencyChart.tsx`
- **Type**: Line Chart + Badge info
- **Données**: Latence 4G vs 5G avec configuration TTI fixe

### Graphe 4 - Conversion de Puissance
- **Fichier**: `PowerConversionSection.tsx`
- **Type**: Colonne gauche (Formule + Table) | Colonne droite (Graphique)
- **Données**: Conversion logarithmique P(dBm) = 10×log₁₀(P_mW)

### Graphe 5 - SINR
- **Fichier**: `SINRChart.tsx`
- **Type**: Line Chart (2 courbes)
- **Données**: Qualité signal 4G (fluctuant) vs 5G (stable)

### Graphe 6 - Taux de perte
- **Fichier**: `PacketLossChart.tsx`
- **Type**: Grouped Bar Chart
- **Données**: 3 scénarios avec barres 4G/5G côte à côte

## �� Personnalisation

### Changer les couleurs
```typescript
// Dans chaque composant Chart, modifier les props stroke:
<Line dataKey="4G LTE" stroke="#EF4444" /> {/* Rouge */}
<Line dataKey="5G NR" stroke="#0EA5E9" />  {/* Bleu */}
```

### Modifier les données
**Option 1 - Données statiques (actuellement)**:
```typescript
// Dans ThroughputChart.tsx
const data = [
  { time: 0, '4G LTE': 5, '5G NR': 8 },
  // ...
];
```

**Option 2 - Données dynamiques (CSV)**:
```typescript
// Dans page.tsx, les données importées deviennent accessibles
interface ChartProps {
  data?: CSVData[];
}

<ThroughputChart data={csvData4G} data5g={csvData5G} />
```

### Ajouter l'upload CSV réel
Les fonctions `parseCSV()` et `handleFileUpload()` sont déjà implémentées dans `page.tsx`. 
Il suffit de passer les données parsées aux composants en tant que props.

## 🔧 Modifications avancées

### Changer les échelles d'axes
```typescript
// Dans RSRPChart.tsx, exemple:
<YAxis
  domain={[-130, -60]}  {/* Changer ces valeurs */}
  ticks={[-60, -80, -100, -120, -130]}  {/* Changer les marqueurs */}
/>
```

### Ajouter du zoom/tooltips personnalisés
```typescript
// Recharts supporte nativement:
<Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
<ZoomableChart />  // Composant optionnel Recharts
```

### Exporter les graphiques en images
Installer une dépendance:
```bash
npm install html2canvas jspdf
```

Puis dans le composant:
```typescript
import html2canvas from 'html2canvas';

const downloadChart = async (ref) => {
  const canvas = await html2canvas(ref.current);
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'chart.png';
  link.click();
};
```

## 📈 Structure de données CSV attendue

### Fichier 4G (Fichier-4g.csv)
```csv
temps(s),debit_mbps,latence_ms,rsrp_dbm,sinr_db,perte_paquets_pourcent
0,5,1.8,-85,8,0.2
10,15,1.9,-95,6,0.3
...
```

### Fichier 5G (Fichier_5g.csv)
```csv
temps(s),debit_mbps,latence_ms,rsrp_dbm,sinr_db,perte_paquets_pourcent
0,8,0.15,-90,28,0.1
10,35,0.14,-100,29,0.1
...
```

## ✅ Checklist de déploiement

- [x] Page créée et routée (`/comparison`)
- [x] 6 graphiques implémentés
- [x] Design responsive (mobile-first)
- [x] Tooltips interactifs
- [x] Légendes colorées
- [x] TypeScript type-safe
- [x] Recharts intégré
- [x] Build test réussi
- [x] Fichiers CSV exemple
- [ ] Upload CSV réel (optionnel)
- [ ] Export PDF (optionnel)
- [ ] Animation de chargement (optionnel)
- [ ] Persistance de données (optionnel)

## 🐛 Dépannage

**Erreur: `Module not found 'recharts'`**
```bash
npm install recharts
```

**Page blanche**
```bash
# Vérifier les logs
npm run dev
# Ouvrir DevTools (F12) pour les erreurs console
```

**Graphiques non affichés**
```bash
# Vérifier que le bouton "Générer les Graphiques" a été cliqué
# Les graphiques s'affichent seulement après clic
```

**Import d'icônes non trouvé**
```bash
npm install lucide-react
```

## 📞 Support & Questions

Pour toute question ou besoin de modification:
1. Consulter `COMPARISON_PAGE_README.md`
2. Vérifier les fichiers composants (bien documentés)
3. Lire la documentation Recharts: https://recharts.org
4. Consulter la documentation Next.js: https://nextjs.org

---

**Page créée pour l'Université USTO-MB (M2 RT) ✨**
