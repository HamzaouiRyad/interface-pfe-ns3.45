# 📊 Page de Comparaison Interactive 4G LTE vs 5G NR

## 🎯 Vue d'ensemble

Une page de comparaison interactive et moderne pour visualiser les métriques de performance entre les réseaux **4G LTE** et **5G NR**. Cette page digitalise les données de performance issues de notes de laboratoire (Université USTO-MB, M2 RT).

## 📍 URL d'accès

```
http://localhost:3000/comparison
```

## 🏗️ Architecture & Structure

### Page principale
- **Fichier**: `src/app/comparison/page.tsx`
- Framework: **Next.js 16** avec **React 19** et **TypeScript**
- Styling: **Tailwind CSS 4** + gradients personnalisés
- Graphiques: **Recharts 3.8** (interactive charts)

### Composants modulaires
```
src/components/comparison/
├── ThroughputChart.tsx        (Débit vs Temps)
├── RSRPChart.tsx              (RSRP vs Distance)
├── LatencyChart.tsx           (Latence / TTI vs Distance)
├── SINRChart.tsx              (SINR vs Temps/Distance)
├── PacketLossChart.tsx        (Taux de perte de paquets)
└── PowerConversionSection.tsx (Conversion de puissance)
```

## 📊 Sections & Graphiques

### 1️⃣ En-tête de page
- Titre principal avec gradient bleu-cyan-rouge
- Sous-titre: Université USTO-MB (M2 RT)

### 2️⃣ Configuration des sources
- **Zone d'upload**: 2 boutons (4G.csv / 5G.csv) avec icônes cloud
- **Bouton d'action**: "Générer les Graphiques" (révèle tous les graphiques)

### 3️⃣ Graphe 1 - Débit (Throughput) vs Temps
- **Type**: Line Chart avec 2 courbes
- **Axes**: 
  - X: Temps (0-50s, pas de 10)
  - Y: Débit (0-120 Mbps, pas de 20)
- **Données**: 
  - 4G LTE (rouge): monte lentement → ~50 Mbps
  - 5G NR (bleu): monte rapidement → ~110 Mbps

### 4️⃣ Graphe 2 - RSRP vs Distance
- **Type**: Line Chart multi-courbes (3 UE)
- **Axes**:
  - X: Distance (100-500m, pas de 100)
  - Y: RSRP (-60 à -130 dBm, échelle inversée)
- **Courbes**:
  - UE 1 - 4G (rouge) - Signal le plus stable
  - UE 2 - 5G (cyan) - Signal intermédiaire
  - UE 3 - 5G (bleu) - Signal avec forte atténuation

### 5️⃣ Graphe 3 - Latence / TTI vs Distance
- **Type**: Line Chart
- **Axes**:
  - X: Distance (100-600m)
  - Y: Temps réponse (0.5-2.5 ms)
- **Courbes**:
  - 4G LTE: 1.8-2.5 ms (latence élevée)
  - 5G NR: 0.14-0.19 ms (ultra-faible latence)
- **Badge**: Configuration TTI fixe (TTI 4G = 1ms | TTI 5G = 0.125ms)

### 6️⃣ Section - Conversion de Puissance (Layout 2 colonnes)
**Colonne gauche**:
- Encadré mathématique: `P(dBm) = 10 × log₁₀(P_mW)`
- Tableau avec conversions:
  - 0.001 mW → -30.00 dBm
  - 0.01 mW → -20.00 dBm
  - 0.1 mW → -10.00 dBm
  - 1.0 mW → 0.00 dBm
  - 100.0 mW → 20.00 dBm

**Colonne droite**:
- Graphique avec courbes de tendance logarithmiques
- Axe X: Puissance (1-1000 mW, échelle log)
- Axe Y: P(dBm) (-30 à 30)
- 2 tendances: 4G et 5G

### 7️⃣ Graphe 4 - SINR vs Temps/Distance
- **Type**: Line Chart
- **Axes**:
  - X: Temps/Distance (10-60)
  - Y: Niveau signal (-10 à 30 dB)
- **Courbes**:
  - 5G NR: Stable ~28-30 dB (excellent)
  - 4G LTE: Fluctuant 2-8 dB (faible)

### 8️⃣ Graphe 5 - Taux de perte de paquets
- **Type**: Grouped Bar Chart
- **Axes**:
  - X: 3 scénarios (groupes de barres)
  - Y: Taux perte (0-12%)
- **Données**:
  ```
  Scénario 1: 4G=3.5% | 5G=1.2%
  Scénario 2: 4G=5.8% | 5G=1.9%
  Scénario 3: 4G=11.2% | 5G=3.6%
  ```

## 🎨 Design & Couleurs

### Palette de couleurs
- **Arrière-plan**: Gradient sombre (`from-slate-950 via-blue-900 to-slate-900`)
- **4G LTE**: Rouge/Corail (`#EF4444` - `#FCA5A5`)
- **5G NR**: Bleu/Cyan (`#0EA5E9` - `#38BDF8`)
- **Accents**: Cyan (`#06B6D4`), Purple (`#9333EA`)
- **Texte**: Gris clair (`#E5E7EB`, `#9CA3AF`)

### Composants UI
- Cards: `bg-slate-800/50` avec backdrop blur
- Tooltips interactives au survol
- Animations fluides sur les points de données
- Légendes colorées pour chaque réseau

## 🚀 Utilisation

### Mode développement
```bash
npm run dev
```
Accédez à: `http://localhost:3000/comparison`

### Mode production
```bash
npm run build
npm run start
```

## 🔄 Flux d'utilisation

1. **Charger les données** (simulation UI):
   - Cliquer sur le bouton upload 4G ou 5G
   - Sélectionner un fichier CSV (optionnel, simulation)

2. **Générer les graphiques**:
   - Cliquer sur le bouton "Générer les Graphiques"
   - Tous les graphiques s'affichent avec animations fluides

3. **Interagir avec les graphiques**:
   - Survoler pour voir les tooltips détaillés
   - Cliquer sur les légendes pour masquer/afficher les courbes
   - Zoom possible sur certains graphiques (Recharts)

## 📦 Dépendances principales

```json
{
  "react": "^19.2.7",
  "next": "^16.2.9",
  "recharts": "^3.8.1",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## 📝 Notes techniques

- **Client-side rendering** (`'use client'`): Tous les composants sont interactifs côté client
- **TypeScript strict**: Type-safe pour éviter les bugs
- **Responsive design**: S'adapte aux mobiles (grid `grid-cols-1 md:grid-cols-2`)
- **Performance**: Recharts optimisé pour les animations fluides
- **Accessibilité**: Tooltips clairs, légendes lisibles

## 🔧 Intégration personnalisée

Pour utiliser vos propres données CSV:

1. Modifier les données dans chaque composant (`data` array)
2. Parser les fichiers CSV en utilisant une librairie comme `papaparse`
3. Passer les données comme props aux composants

Exemple:
```typescript
// Dans page.tsx
const [lte4GData, setLte4GData] = useState(defaultData);
const [nr5GData, setNr5GData] = useState(defaultData);

// Dans le composant de chart
<ThroughputChart data={lte4GData} data5g={nr5GData} />
```

## ✨ Fonctionnalités futures possibles

- 📥 Import réel de fichiers CSV avec parsing
- 📈 Statistiques agrégées (min, max, moyenne)
- 📊 Export de graphiques en PNG/PDF
- 🔍 Filtrage par plage de distance/temps
- 📱 Mode comparaison côte à côte
- 🎨 Thème clair/sombre toggle

---

**Créé avec ❤️ pour l'Université USTO-MB (M2 RT)**
