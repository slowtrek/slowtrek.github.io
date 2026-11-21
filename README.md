# Lanzatrip

Carnet de randonnée itinérante, site statique Hugo (≥ 0.146, sans thème).

## Ajouter une étape

    hugo new content etapes/jour-03/index.md

Puis, dans `content/etapes/jour-03/` :
- éditer `index.md` : `weight` = numéro du jour, titre, date, récit ;
- déposer la trace `trace.gpx` (un seul fichier .gpx par étape) ;
- déposer les photos (.jpg/.png) : elles sont redimensionnées automatiquement.
  Légendes optionnelles via `resources` dans le front matter,
  vignette choisie avec `couverture: "photo.jpg"`.

Distance, D+/D- et profil sont calculés à partir du GPX au moment du build
(seuil anti-bruit réglable : `params.seuilDenivele` dans `hugo.toml`).

## Développement

    hugo server

## Déploiement

Pousser sur la branche `main` d'un dépôt GitHub. Dans *Settings → Pages*,
choisir **Source : GitHub Actions**. Le workflow `.github/workflows/hugo.yml`
construit et publie le site.
