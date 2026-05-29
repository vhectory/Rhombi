// ════════════════════════════════════════════════════════════
//  Rhombi — Sitemap generator
//  Leest fotos.json en maakt een complete sitemap.xml met
//  alle foto's per map. Zo indexeert Google alle afbeeldingen.
//
//  GEBRUIK:
//    1. Zet dit bestand in dezelfde map als fotos.json
//    2. Open een terminal in die map
//    3. Typ:  node maak-sitemap.js
//    4. sitemap.xml wordt aangemaakt/bijgewerkt
// ════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const SITE = 'https://rhombi.nl';

// Beschrijvende titels per map (voor betere Google-indexering)
const MAP_INFO = {
  hero:       { titel: 'Rhombi modulair lichtobject',        caption: 'Rhombi modulair lichtobject — geometrisch 3D-geprint design, Studio Vhector Middelburg.' },
  tafel:      { titel: 'Rhombi tafellichtobject',            caption: 'Rhombi tafellichtobject — modulair geometrisch design, 3D-geprint PLA.' },
  accent:     { titel: 'Rhombi accentlichtobject',           caption: 'Rhombi accentlichtobject — sculpturaal geometrisch lichtobject, 3D-geprint.' },
  wand:       { titel: 'Rhombi wandlichtobject',             caption: 'Rhombi wandlichtobject — geometrisch lichtobject voor wandmontage.' },
  plafond:    { titel: 'Rhombi plafondlichtobject',          caption: 'Rhombi plafondlichtobject — geometrisch lichtobject voor het plafond, 3D-geprint.' },
  hang:       { titel: 'Rhombi hanglichtobject',             caption: 'Rhombi hanglichtobject — geometrisch hangend lichtobject, modulair design.' },
  uitleg:     { titel: 'Rhombi lichtobject in interieur',    caption: 'Rhombi lichtobject in interieur — Galerie T Middelburg.' },
  ontwerper:  { titel: 'Studio Vhector — Vincent Hector',    caption: 'Vincent Hector, ontwerper van Rhombi lichtobjecten.' },
  geometrie:  { titel: 'Rhombi geometrie detail',            caption: 'Detail van het geometrische ruitpatroon in een Rhombi lichtobject.' },
  'materiaal/basic':       { titel: 'Rhombi PLA Basic',       caption: 'Rhombi lichtobject in PLA Basic afwerking.' },
  'materiaal/mat':         { titel: 'Rhombi PLA Mat',         caption: 'Rhombi lichtobject in matte PLA afwerking.' },
  'materiaal/cf':          { titel: 'Rhombi PLA Carbon',      caption: 'Rhombi lichtobject in carbonvezel PLA.' },
  'materiaal/nebula':      { titel: 'Rhombi PLA Nebula',      caption: 'Rhombi lichtobject in Nebula PLA met kosmische glans.' },
  'materiaal/translucent': { titel: 'Rhombi PLA Translucent', caption: 'Rhombi lichtobject in doorschijnend PLA.' },
};

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Lees fotos.json
let fotos;
try {
  fotos = JSON.parse(fs.readFileSync('fotos.json', 'utf-8'));
} catch (e) {
  console.error('FOUT: kon fotos.json niet lezen. Staat dit script in dezelfde map?');
  console.error(e.message);
  process.exit(1);
}

const vandaag = new Date().toISOString().slice(0, 10);

// Bouw de image-blokken voor de homepage
let imageBlocks = '';
let totaalFotos = 0;

for (const [map, bestanden] of Object.entries(fotos)) {
  if (!Array.isArray(bestanden)) continue;
  const info = MAP_INFO[map] || { titel: 'Rhombi lichtobject', caption: 'Rhombi geometrisch lichtobject, Studio Vhector.' };
  for (const bestand of bestanden) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(bestand)) continue;
    imageBlocks += `
    <image:image>
      <image:loc>${SITE}/fotos/${map}/${esc(bestand)}</image:loc>
      <image:title>${esc(info.titel)}</image:title>
      <image:caption>${esc(info.caption)}</image:caption>
    </image:image>`;
    totaalFotos++;
  }
}

// Volledige sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>${SITE}/</loc>
    <lastmod>${vandaag}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>${imageBlocks}
  </url>

  <url>
    <loc>${SITE}/viewer.html</loc>
    <lastmod>${vandaag}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${SITE}/rhombi-prijslijst.html</loc>
    <lastmod>${vandaag}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${SITE}/rhombi-matrix-prijslijst.html</loc>
    <lastmod>${vandaag}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('✓ sitemap.xml aangemaakt met ' + totaalFotos + ' foto\'s uit ' + Object.keys(fotos).length + ' mappen.');
console.log('  Upload sitemap.xml naar je site en dien hem opnieuw in via Search Console.');
