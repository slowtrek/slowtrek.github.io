// Carte Leaflet + profil altimétrique interactif + visionneuse photo.
(() => {
  const fmtKm = (m) => (m / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // ---------- Carte & profil ----------
  const data = document.getElementById('trace-data');
  if (data && window.L) {
    // Une entrée par fichier GPX ; « t » met tous les points bout à bout
    // (d = distance cumulée sur la journée) pour le survol carte <-> profil.
    const segments = JSON.parse(data.textContent).segments;
    const t = { lat: [], lon: [], ele: [], d: [] };
    for (const s of segments) for (const k of Object.keys(t)) t[k].push(...s[k]);
    const pts = t.lat.map((la, i) => [la, t.lon[i]]);
    const total = t.d[t.d.length - 1] || 1;

    const map = L.map('carte', { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      subdomains: 'abc',
      attribution: 'Carte : © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA) · ' +
        'Données : © contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM',
    }).addTo(map);

    const traces = segments.map((s) => s.lat.map((la, i) => [la, s.lon[i]]));
    // Trajets entre deux traces (bus, voiture…) : pointillés gris, non comptés
    for (let i = 1; i < traces.length; i++) {
      L.polyline([traces[i - 1].at(-1), traces[i][0]], {
        color: '#6b7280', weight: 2, opacity: 0.8, dashArray: '4 8', interactive: false,
      }).addTo(map);
    }
    const ligne = L.polyline(traces, { color: '#c2410c', weight: 4, opacity: 0.9 }).addTo(map);
    map.fitBounds(ligne.getBounds(), { padding: [24, 24] });
    map.on('click', () => map.scrollWheelZoom.enable());

    const pastille = (ll, couleur, titre) =>
      L.circleMarker(ll, { radius: 7, color: '#fff', weight: 2, fillColor: couleur, fillOpacity: 1 })
        .bindTooltip(titre).addTo(map);
    pastille(pts[0], '#15803d', 'Départ');
    pastille(pts[pts.length - 1], '#b91c1c', 'Arrivée');
    // Début / fin des traces intermédiaires
    traces.forEach((tr, i) => {
      const petite = (ll, titre) => L.circleMarker(ll, {
        radius: 5, color: '#fff', weight: 2, fillColor: '#6b7280', fillOpacity: 1,
      }).bindTooltip(titre).addTo(map);
      if (i > 0) petite(tr[0], `Début de la trace ${i + 1}`);
      if (i < traces.length - 1) petite(tr.at(-1), `Fin de la trace ${i + 1}`);
    });

    const curseurCarte = L.circleMarker(pts[0], {
      radius: 6, color: '#fff', weight: 2, fillColor: '#1d4ed8', fillOpacity: 1, interactive: false,
    });

    // Index du point le plus proche d'une distance donnée (recherche dichotomique)
    const indexDistance = (d) => {
      let lo = 0, hi = t.d.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        (t.d[mid] < d ? (lo = mid) : (hi = mid));
      }
      return d - t.d[lo] < t.d[hi] - d ? lo : hi;
    };

    const profil = document.getElementById('profil');
    const plot = profil?.querySelector('.profil-plot');
    const curseur = profil?.querySelector('.profil-curseur');
    const info = profil?.querySelector('.profil-info');

    const montrer = (i) => {
      curseurCarte.setLatLng(pts[i]).addTo(map);
      if (!plot) return;
      const x = (t.d[i] / total) * 100;
      curseur.style.left = info.style.left = `${x}%`;
      info.classList.toggle('gauche', x > 70);
      info.textContent = `${fmtKm(t.d[i])} km · ${Math.round(t.ele[i])} m`;
      curseur.hidden = info.hidden = false;
    };
    const cacher = () => {
      curseurCarte.remove();
      if (curseur) curseur.hidden = info.hidden = true;
    };

    if (plot) {
      const survol = (e) => {
        const r = plot.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        montrer(indexDistance(f * total));
      };
      plot.addEventListener('pointermove', survol);
      plot.addEventListener('pointerdown', survol);
      plot.addEventListener('pointerleave', cacher);
    }

    // Survol du tracé sur la carte -> curseur sur le profil
    ligne.on('mousemove', (e) => {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const d = map.distance(e.latlng, pts[i]);
        if (d < bestD) { bestD = d; best = i; }
      }
      montrer(best);
    });
    ligne.on('mouseout', cacher);
  }

  // ---------- Visionneuse photo ----------
  const dlg = document.getElementById('visionneuse');
  if (dlg) {
    const liens = [...document.querySelectorAll('.grille-photos a')];
    const img = dlg.querySelector('img');
    const leg = dlg.querySelector('.legende');
    let courant = 0;

    const ouvrir = (i) => {
      courant = (i + liens.length) % liens.length;
      img.src = liens[courant].href;
      img.alt = leg.textContent = liens[courant].dataset.legende || '';
      if (!dlg.open) dlg.showModal();
    };

    liens.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); ouvrir(i); }));
    dlg.querySelector('.fermer').addEventListener('click', () => dlg.close());
    dlg.querySelector('.prec').addEventListener('click', () => ouvrir(courant - 1));
    dlg.querySelector('.suiv').addEventListener('click', () => ouvrir(courant + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') ouvrir(courant - 1);
      if (e.key === 'ArrowRight') ouvrir(courant + 1);
    });
    if (liens.length < 2) dlg.querySelectorAll('.prec, .suiv').forEach((b) => (b.hidden = true));
  }
})();
