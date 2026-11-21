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

  jours.forEach((j, n) => {
    const couleur = couleurs[n % couleurs.length];
    const traces = j.traces.map((t) => t.lat.map((la, i) => [la, t.lon[i]]));
    const titre = `Jour ${j.jour} · ${j.titre}`;

    const ligne = L.polyline(traces, { color: couleur, weight: 4, opacity: 0.9 })
      .bindTooltip(titre, { sticky: true })
      .on('click', () => { location.href = j.url; })
      .on('mouseover', () => ligne.setStyle({ weight: 7 }))
      .on('mouseout', () => ligne.setStyle({ weight: 4 }))
      .addTo(map);
    limites.extend(ligne.getBounds());

    // Numéro du jour au point de départ
    L.marker(traces[0][0], {
      icon: L.divIcon({
        className: '',
        html: `<span class="numero-jour" style="background:${couleur}">${j.jour}</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
      title: titre,
      keyboard: true,
    }).on('click', () => { location.href = j.url; }).addTo(map);
  });

  map.fitBounds(limites, { padding: [24, 24] });
})();
