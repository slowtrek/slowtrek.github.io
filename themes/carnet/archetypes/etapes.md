---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
# date: {{ .Date }}   # facultatif : la date n'est affichée que si elle est renseignée
weight: 0          # numéro du jour
depart: ""
arrivee: ""
description: ""    # sites du jour, affichés sous le titre
pratique: |
  Nuit à …, dîner à …
# couverture: "photo.jpg"   # photo de vignette (sinon : la première photo)
# resources:
#   - src: "photo.jpg"
#     title: "Légende de la photo"
---

Récit de la journée…
