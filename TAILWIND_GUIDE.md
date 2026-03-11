# Guide Tailwind CSS pour le Responsive Design

## Installation ✅
Tailwind CSS est maintenant installé et configuré dans votre projet.

## Breakpoints par défaut
Tailwind utilise ces breakpoints :
- `sm`: 640px et plus
- `md`: 768px et plus  
- `lg`: 1024px et plus
- `xl`: 1280px et plus
- `2xl`: 1536px et plus

## Syntaxe Responsive
Ajoutez les préfixes de breakpoint avant les classes :

```html
<!-- Mobile first : 1 colonne -->
<div className="grid grid-cols-1">

<!-- Tablet : 2 colonnes -->
<div className="grid grid-cols-1 md:grid-cols-2">

<!-- Desktop : 3 colonnes -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Exemples pratiques

### 1. Grilles responsives
```html
<!-- Cartes responsives -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white p-6 rounded-lg">Carte 1</div>
  <div className="bg-white p-6 rounded-lg">Carte 2</div>
  <div className="bg-white p-6 rounded-lg">Carte 3</div>
</div>
```

### 2. Texte responsive
```html
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Titre responsive
</h1>
<p className="text-sm sm:text-base lg:text-lg">
  Paragraphe responsive
</p>
```

### 3. Espacement responsive
```html
<div className="px-4 sm:px-6 lg:px-8 py-8">
  <!-- Padding horizontal différent selon la taille -->
</div>
```

### 4. Navigation responsive
```html
<nav className="flex flex-col sm:flex-row justify-between items-center">
  <!-- Vertical sur mobile, horizontal sur desktop -->
</nav>
```

### 5. Images responsives
```html
<img 
  src="image.jpg" 
  className="w-full h-auto max-w-full rounded-lg"
  alt="Image responsive"
/>
```

## Classes utilitaires fréquentes

### Display
- `block sm:hidden` : visible seulement sur mobile
- `hidden sm:block` : caché sur mobile, visible sur tablet+
- `flex lg:hidden` : flex sur mobile/tablet, caché sur desktop

### Positionnement
- `text-center sm:text-left` : centré sur mobile, aligné à gauche sur desktop
- `w-full sm:w-auto` : pleine largeur sur mobile, auto sur desktop

## Migration depuis CSS
Remplacez vos classes CSS par des classes Tailwind :

| CSS | Tailwind |
|-----|----------|
| `display: flex` | `flex` |
| `justify-content: center` | `justify-center` |
| `align-items: center` | `items-center` |
| `margin: 1rem` | `m-4` |
| `padding: 2rem` | `p-8` |
| `background: white` | `bg-white` |
| `border-radius: 8px` | `rounded-lg` |

## Conseils pour votre projet kmertude

### 1. Structure de page
```html
<div className="min-h-screen bg-gray-50">
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Navigation -->
    </div>
  </header>
  
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Contenu -->
  </main>
</div>
```

### 2. Cartes et formulaires
```html
<div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
  <h2 className="text-xl sm:text-2xl font-bold mb-4">Titre</h2>
  <!-- Contenu -->
</div>
```

### 3. Boutons responsives
```html
<button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Bouton responsive
</button>
```

## Test du responsive
Utilisez les outils de développement de votre navigateur :
1. F12 → Outils de développement
2. Cliquez sur l'icône de responsive (téléphone/tablette)
3. Testez différentes tailles d'écran

## Prochaines étapes
1. Convertissez progressivement vos composants existants
2. Utilisez les classes utilitaires pour espacement et couleurs
3. Testez sur différentes tailles d'écran
4. Supprimez les fichiers CSS devenus inutiles
