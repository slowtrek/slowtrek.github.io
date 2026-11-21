---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
weight: 0          # numéro du jour
depart: ""
arrivee: ""
description: ""
# couverture: "photo.jpg"   # photo de vignette (sinon : la première photo)
# resources:
#   - src: "photo.jpg"
#     title: "Légende de la photo"
---

Récit de la journée…
