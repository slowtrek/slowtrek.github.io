// Carte de tout le parcours (page d'accueil) : une couleur par jour,
// clic sur une trace ou un numéro = ouvrir l'étape.
(() => {
  const data = document.getElementById('parcours-data');
  if (!data || !window.L) return;
  const jours = JSON.parse(data.textContent);

  const couleurs = ['#c2410c', '#1d4ed8', '#7c3aed', '#be185d', '#0f766e', '#b45309', '#4338ca', '#15803d'];

  const map = L.map('carte-parcours', { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    subdomains: 'abc',
    attribution: 'Carte : © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA) · ' +
      'Données : © contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM',
  }).addTo(map);
  map.on('click', () => map.scrollWheelZoom.enable());

  const limites = L.latLngBounds([]);

  // Numéro du jour, dans une pastille (pleine : jour avec trace ; claire : sans trace)
  const numero = (ll, j, couleur, sansTrace) => L.marker(ll, {
    icon: L.divIcon({
      className: '',
      html: `<span class="numero-jour${sansTrace ? ' sans-trace' : ''}" style="--c:${couleur}">${j.jour}</span>`,
      iconSize: [26, 26],
      // repère sans trace décalé au-dessus du point, pour ne pas masquer une autre pastille
      iconAnchor: sansTrace ? [13, 34] : [13, 13],
    }),
    title: `Jour ${j.jour} · ${j.titre}${sansTrace ? ' (sans trace GPX)' : ''}`,
    keyboard: true,
  }).on('click', () => { location.href = j.url; }).addTo(map);

  jours.forEach((j, n) => {
    const couleur = couleurs[n % couleurs.length];
    if (j.position) {
      L.circleMarker(j.position, { radius: 3, color: couleur, weight: 2, fillOpacity: 1, interactive: false }).addTo(map);
      numero(j.position, j, couleur, true);
      limites.extend(j.position);
      return;
    }
    const traces = j.traces.map((t) => t.lat.map((la, i) => [la, t.lon[i]]));
    const titre = `Jour ${j.jour} · ${j.titre}`;

    const ligne = L.polyline(traces, { color: couleur, weight: 4, opacity: 0.9 })
      .bindTooltip(titre, { sticky: true })
      .on('click', () => { location.href = j.url; })
      .on('mouseover', () => ligne.setStyle({ weight: 7 }))
      .on('mouseout', () => ligne.setStyle({ weight: 4 }))
      .addTo(map);
    limites.extend(ligne.getBounds());

    numero(traces[0][0], j, couleur, false);
  });

  map.fitBounds(limites, { padding: [24, 24] });
})();
