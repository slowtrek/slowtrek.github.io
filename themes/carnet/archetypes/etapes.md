---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
# date: {{ .Date }}   # facultatif : la date n'est affichée que si elle est renseignée
weight: 0          # numéro du jour
depart: ""
arrivee: ""
description: ""    # sites du jour, affichés sous le titre
pratique: |
  Nuit à …, dîner à …
gpx: "trace.gpx"   # fichier GPX déposé dans le dossier de l'étape
# gpx: ["matin.gpx", "apres-midi.gpx"]   # ou plusieurs, dans l'ordre de la journée
photos:            # dans l'ordre d'affichage de la galerie
  - fichier: "photo-1.jpg"
    description: "Texte affiché sous la photo"
# couverture: "photo-1.jpg"   # vignette sur l'accueil (sinon : la première photo)
---

Récit de la journée…
