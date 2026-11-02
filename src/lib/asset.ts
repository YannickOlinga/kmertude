// Préfixe un chemin d'asset du dossier public/ avec la base Vite
// (ex: '/kmertude/' sur GitHub Pages, '/' en local) afin que les
// ressources se résolvent correctement quel que soit le sous-chemin.
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
