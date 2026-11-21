# Slowtrek

Carnets de randonnée itinérante, publiés sur https://slowtrek.github.io/
(sites statiques Hugo ≥ 0.146).

## Organisation

    index.html          page racine (redirige pour l'instant vers /lanzarote/)
    themes/carnet/      gabarits, CSS, JS et archétype communs à tous les treks
    lanzarote/          un trek = un site Hugo → https://slowtrek.github.io/lanzarote/
      hugo.toml
      content/
        _index.md       introduction du trek
        etapes/jour-01/ une étape : index.md + trace.gpx + photos

## Créer un nouveau trek

    mkdir -p mon-trek/content/etapes
    cp lanzarote/hugo.toml mon-trek/          # puis adapter title, baseURL, timeZone…
    cp lanzarote/content/etapes/_index.md mon-trek/content/etapes/
    # écrire mon-trek/content/_index.md (introduction)

Le workflow construit automatiquement chaque répertoire contenant un `hugo.toml`
et le publie sous `/<répertoire>/`. Penser à remplacer la redirection de
`index.html` par une vraie page d'accueil quand il y aura plusieurs treks.

## Ajouter une étape

    cd lanzarote
    hugo new content etapes/jour-04/index.md

Puis, dans `content/etapes/jour-04/` :
- éditer `index.md` : `weight` = numéro du jour, titre, date, récit ;
- déposer la trace GPX et l'indiquer dans `gpx: "trace.gpx"` ;
- déposer les photos (.jpg/.png, redimensionnées automatiquement) et les lister
  dans l'ordre voulu, avec leur description :

      photos:
        - fichier: "photo-1.jpg"
          description: "Texte affiché sous la photo"

  Vignette de l'accueil : `couverture: "photo-1.jpg"` (sinon la première photo).
  Un fichier introuvable est signalé par un avertissement au build.

Distance, D+/D- et profil sont calculés à partir du GPX au moment du build
(seuil anti-bruit : `params.seuilDenivele`, 3 m par défaut).

## Développement

    cd lanzarote && hugo server

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/hugo.yml`, qui construit
tous les treks et publie le site sur GitHub Pages.
