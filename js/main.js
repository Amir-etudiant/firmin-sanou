/* ============================================
   FIRMIN SANOU — site
   Vanilla JS, no framework. Loads JSON from /data
   and renders into placeholders.
   ============================================ */

const DATA = {};

// --- Utility: fetch and cache JSON files ---
async function loadJSON(name) {
  if (DATA[name]) return DATA[name];
  try {
    const res = await fetch(`data/${name}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${name}.json (${res.status})`);
    const json = await res.json();
    DATA[name] = json;
    return json;
  } catch (e) {
    console.error(`Erreur chargement ${name}:`, e);
    return null;
  }
}

// --- Utility: HTML escape ---
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Navbar scroll effect ---
function setupNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark active link based on pathname
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const target = href.replace(/^\/?/, '').replace(/^index\.html$/, '');
    if ((path === 'index.html' && (target === '' || target === 'index.html')) || (target && path === target)) {
      a.classList.add('active');
    }
  });
}

// --- Mobile menu toggle ---
function setupMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Reveal animations on scroll ---
function setupReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  items.forEach(i => io.observe(i));
}

// --- Hero & site-wide settings ---
async function renderSiteSettings() {
  const s = await loadJSON('settings');
  if (!s) return;

  // Document title (only update if it has the placeholder pattern)
  if (document.title.includes('{{')) {
    document.title = document.title.replace('{{site_title}}', s.site.titre);
  }

  // Meta description
  const desc = document.querySelector('meta[name="description"]');
  if (desc && desc.content.includes('{{')) {
    desc.content = s.site.description_meta;
  }

  // Hero
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.backgroundImage = `url('${s.hero.image}')`;
  const heroTitleBefore = document.querySelector('[data-hero-title-before]');
  const heroTitleAfter = document.querySelector('[data-hero-title-after]');
  if (heroTitleBefore) heroTitleBefore.textContent = s.hero.titre_avant;
  if (heroTitleAfter) heroTitleAfter.textContent = s.hero.titre_apres;
  const heroTagline = document.querySelector('[data-hero-tagline]');
  if (heroTagline) heroTagline.textContent = s.hero.tagline;
  const heroMeta = document.querySelector('[data-hero-meta]');
  if (heroMeta) {
    heroMeta.innerHTML = `<span>${esc(s.hero.meta_1)}</span><span>${esc(s.hero.meta_2)}</span><span>${esc(s.hero.meta_3)}</span>`;
  }

  // Intro
  const introImg = document.querySelector('[data-intro-image]');
  if (introImg) introImg.src = s.intro.image;
  const introTitleBefore = document.querySelector('[data-intro-title-before]');
  const introTitleAfter = document.querySelector('[data-intro-title-after]');
  if (introTitleBefore) introTitleBefore.textContent = s.intro.titre_avant + ' ';
  if (introTitleAfter) introTitleAfter.textContent = s.intro.titre_apres;
  const introEyebrow = document.querySelector('[data-intro-eyebrow]');
  if (introEyebrow) introEyebrow.textContent = s.intro.eyebrow;
  const introLead = document.querySelector('[data-intro-lead]');
  if (introLead) introLead.textContent = s.intro.lead;
  const introText = document.querySelector('[data-intro-text]');
  if (introText) introText.textContent = s.intro.texte;
  const introStats = document.querySelector('[data-intro-stats]');
  if (introStats) {
    introStats.innerHTML = `
      <div class="intro-stat"><span class="num">${esc(s.intro.stat_1_num)}</span><span class="lbl">${esc(s.intro.stat_1_lbl)}</span></div>
      <div class="intro-stat"><span class="num">${esc(s.intro.stat_2_num)}</span><span class="lbl">${esc(s.intro.stat_2_lbl)}</span></div>
      <div class="intro-stat"><span class="num">${esc(s.intro.stat_3_num)}</span><span class="lbl">${esc(s.intro.stat_3_lbl)}</span></div>
    `;
  }

  // Technique section header
  const techEyebrow = document.querySelector('[data-tech-eyebrow]');
  if (techEyebrow) techEyebrow.textContent = s.technique.eyebrow;
  const techTitle = document.querySelector('[data-tech-title]');
  if (techTitle) techTitle.textContent = s.technique.titre;
  const techQuote = document.querySelector('[data-tech-quote]');
  if (techQuote) techQuote.textContent = s.technique.citation;

  // Expos section header
  const expoEyebrow = document.querySelector('[data-expos-eyebrow]');
  if (expoEyebrow) expoEyebrow.textContent = s.expos_section.eyebrow;
  const expoTitle = document.querySelector('[data-expos-title]');
  if (expoTitle) expoTitle.textContent = s.expos_section.titre;
  const expoDesc = document.querySelector('[data-expos-description]');
  if (expoDesc) expoDesc.textContent = s.expos_section.description;

  // Services section header
  const svcEyebrow = document.querySelector('[data-services-eyebrow]');
  if (svcEyebrow) svcEyebrow.textContent = s.services_section.eyebrow;
  const svcTitle = document.querySelector('[data-services-title]');
  if (svcTitle) svcTitle.textContent = s.services_section.titre;
  const svcDesc = document.querySelector('[data-services-description]');
  if (svcDesc) svcDesc.textContent = s.services_section.description;

  // Contact / footer
  document.querySelectorAll('[data-contact-france-1]').forEach(el => {
    el.textContent = s.contact.france_tel_1;
    if (el.tagName === 'A') el.href = 'tel:' + s.contact.france_tel_1.replace(/\s/g, '');
  });
  document.querySelectorAll('[data-contact-france-2]').forEach(el => {
    el.textContent = s.contact.france_tel_2;
    if (el.tagName === 'A') el.href = 'tel:' + s.contact.france_tel_2.replace(/\s/g, '');
  });
  document.querySelectorAll('[data-contact-burkina]').forEach(el => {
    el.textContent = s.contact.burkina_tel;
    if (el.tagName === 'A') el.href = 'tel:' + s.contact.burkina_tel.replace(/\s/g, '');
  });
  document.querySelectorAll('[data-contact-email]').forEach(el => {
    el.textContent = s.contact.email;
    if (el.tagName === 'A') el.href = 'mailto:' + s.contact.email;
  });
  document.querySelectorAll('[data-contact-adresse]').forEach(el => {
    el.textContent = s.contact.burkina_adresse;
  });
  document.querySelectorAll('[data-contact-whatsapp]').forEach(el => {
    el.href = 'https://wa.me/' + s.contact.whatsapp.replace(/[^0-9]/g, '');
  });

  // Social
  document.querySelectorAll('[data-social-facebook]').forEach(el => { el.href = s.social.facebook; });
  document.querySelectorAll('[data-social-instagram]').forEach(el => { el.href = s.social.instagram; });
  document.querySelectorAll('[data-social-youtube]').forEach(el => { el.href = s.social.youtube; });
  document.querySelectorAll('[data-social-boutique]').forEach(el => { el.href = s.social.boutique; });
}

// --- Render œuvres (gallery) ---
async function renderOeuvres(limit = null) {
  const grid = document.querySelector('[data-oeuvres-grid]');
  if (!grid) return;
  const data = await loadJSON('oeuvres');
  if (!data || !data.oeuvres) return;

  // Sort by year desc
  let items = data.oeuvres.slice().sort((a, b) => (b.annee || 0) - (a.annee || 0));
  if (limit) items = items.slice(0, limit);

  grid.innerHTML = items.map((o, i) => `
    <article class="oeuvre-card reveal" data-oeuvre-index="${i}" data-categorie="${esc(o.categorie || 'Autre')}">
      <img src="${esc(o.image)}" alt="${esc(o.titre)}" loading="lazy">
      <div class="oeuvre-overlay">
        <div class="oeuvre-info">
          <h3>${esc(o.titre)}</h3>
          <span class="meta">${esc(o.annee || '')}${o.taille ? ' · ' + esc(o.taille) : ''}</span>
        </div>
      </div>
    </article>
  `).join('');

  // Store sorted list for lightbox
  DATA._oeuvresSorted = items;

  // Click → lightbox
  grid.querySelectorAll('.oeuvre-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.oeuvreIndex, 10);
      openLightbox(idx);
    });
  });

  // Setup filters if present
  setupGalleryFilters();
  // Re-trigger reveal observation
  setupReveals();
}

// --- Gallery category filters ---
function setupGalleryFilters() {
  const container = document.querySelector('[data-filters]');
  if (!container || !DATA._oeuvresSorted) return;

  const categories = ['Tout', ...new Set(DATA._oeuvresSorted.map(o => o.categorie).filter(Boolean))];
  container.innerHTML = categories.map((c, i) =>
    `<button class="gallery-filter ${i === 0 ? 'active' : ''}" data-filter="${esc(c)}">${esc(c)}</button>`
  ).join('');

  container.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-oeuvres-grid] .oeuvre-card').forEach(card => {
        const cat = card.dataset.categorie;
        card.style.display = (filter === 'Tout' || cat === filter) ? '' : 'none';
      });
    });
  });
}

// --- Lightbox ---
function openLightbox(index) {
  const list = DATA._oeuvresSorted || [];
  if (!list[index]) return;
  const o = list[index];
  let lb = document.querySelector('.lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer">×</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Précédent">‹</button>
      <button class="lightbox-nav lightbox-next" aria-label="Suivant">›</button>
      <div class="lightbox-content">
        <div class="lightbox-image"><img alt=""></div>
        <div class="lightbox-info">
          <span class="eyebrow"></span>
          <h3></h3>
          <p></p>
          <dl class="lightbox-meta"></dl>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-prev').addEventListener('click', () => navLightbox(-1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => navLightbox(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });
  }
  DATA._lightboxIndex = index;
  fillLightbox(o);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fillLightbox(o) {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lb.querySelector('.lightbox-image img').src = o.image;
  lb.querySelector('.lightbox-image img').alt = o.titre;
  lb.querySelector('.lightbox-info .eyebrow').textContent = o.categorie || 'Sculpture';
  lb.querySelector('.lightbox-info h3').textContent = o.titre;
  lb.querySelector('.lightbox-info p').textContent = o.description || '';
  const meta = lb.querySelector('.lightbox-meta');
  meta.innerHTML = '';
  if (o.annee) meta.innerHTML += `<dt>Année</dt><dd>${esc(o.annee)}</dd>`;
  if (o.taille) meta.innerHTML += `<dt>Hauteur</dt><dd>${esc(o.taille)}</dd>`;
  if (o.categorie) meta.innerHTML += `<dt>Type</dt><dd>${esc(o.categorie)}</dd>`;
  meta.innerHTML += `<dt>Matière</dt><dd>Bronze, cire perdue</dd>`;
}

function navLightbox(direction) {
  const list = DATA._oeuvresSorted || [];
  let idx = (DATA._lightboxIndex ?? 0) + direction;
  if (idx < 0) idx = list.length - 1;
  if (idx >= list.length) idx = 0;
  DATA._lightboxIndex = idx;
  fillLightbox(list[idx]);
}

function closeLightbox() {
  const lb = document.querySelector('.lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// --- Render technique steps ---
async function renderTechnique() {
  const grid = document.querySelector('[data-technique-steps]');
  if (!grid) return;
  const data = await loadJSON('technique');
  if (!data) return;
  grid.innerHTML = data.etapes.map((e, i) => `
    <div class="technique-step reveal reveal-delay-${(i % 3) + 1}">
      <span class="num">${esc(e.numero)}</span>
      <h4>${esc(e.titre)}</h4>
      <p>${esc(e.description)}</p>
    </div>
  `).join('');

  // Histoire bloc (full technique page)
  const hist = document.querySelector('[data-technique-histoire]');
  if (hist && data.histoire) {
    hist.querySelector('[data-h-title]').textContent = data.histoire.titre;
    hist.querySelector('[data-h-text]').textContent = data.histoire.texte;
  }
  setupReveals();
}

// --- Render expositions ---
async function renderExpositions(limit = null) {
  const grid = document.querySelector('[data-expos-grid]');
  if (!grid) return;
  const data = await loadJSON('expositions');
  if (!data || !data.expositions) return;

  let items = data.expositions.slice().sort((a, b) => (b.date_tri || '').localeCompare(a.date_tri || ''));
  if (limit) items = items.slice(0, limit);

  grid.innerHTML = items.map((e, i) => `
    <article class="expo-card reveal reveal-delay-${(i % 3) + 1}">
      <div class="expo-image">
        <img src="${esc(e.image)}" alt="${esc(e.titre)}" loading="lazy">
      </div>
      <div class="expo-content">
        <span class="expo-date">${esc(e.date_affichage)}</span>
        <h3>${esc(e.titre)}</h3>
        <div class="expo-location">${esc(e.lieu)}</div>
        ${e.description ? `<p class="expo-description">${esc(e.description)}</p>` : ''}
      </div>
    </article>
  `).join('');
  setupReveals();
}

// --- Render parcours timeline ---
async function renderParcours() {
  const tl = document.querySelector('[data-parcours-timeline]');
  if (!tl) return;
  const data = await loadJSON('parcours');
  if (!data || !data.parcours) return;
  tl.innerHTML = data.parcours.map((p, i) => `
    <div class="timeline-item reveal">
      <div class="timeline-year">${esc(p.annee)}</div>
      <div class="timeline-content">
        <h4>${esc(p.titre)}</h4>
        <p>${esc(p.description)}</p>
      </div>
    </div>
  `).join('');
  setupReveals();
}

// --- Render stages content ---
async function renderStages() {
  const root = document.querySelector('[data-stages-root]');
  if (!root) return;
  const data = await loadJSON('stages');
  if (!data) return;

  const intro = root.querySelector('[data-stages-intro]');
  if (intro) intro.textContent = data.intro;

  const formules = root.querySelector('[data-stages-formules]');
  if (formules) {
    formules.innerHTML = data.formules.map(f => `
      <li>
        <div>
          <strong>${esc(f.titre)}</strong>
          <p class="muted" style="margin-top:4px; font-size:0.85rem; color: var(--text-muted);">${esc(f.description)}</p>
        </div>
      </li>
    `).join('');
  }

  const etapesList = root.querySelector('[data-stages-etapes]');
  if (etapesList) {
    etapesList.innerHTML = data.etapes.map((e, i) => `
      <li><strong style="color:var(--accent); margin-right:8px;">${String(i + 1).padStart(2, '0')}</strong>${esc(e)}</li>
    `).join('');
  }

  const tarifs = root.querySelector('[data-stages-tarifs]');
  if (tarifs) {
    tarifs.innerHTML = data.tarifs.map(t => `
      <div class="pricing-row">
        <span class="price">${esc(t.prix)}</span>
        <span class="label">${esc(t.label)}</span>
      </div>
    `).join('');
  }

  const publicEl = root.querySelector('[data-stages-public]');
  if (publicEl) publicEl.textContent = data.public;

  const noteEl = root.querySelector('[data-stages-note]');
  if (noteEl) noteEl.textContent = data.note;

  // Fonderie
  const fonderie = root.querySelector('[data-fonderie]');
  if (fonderie && data.fonderie) {
    fonderie.querySelector('[data-fonderie-title]').textContent = data.fonderie.titre;
    fonderie.querySelector('[data-fonderie-intro]').textContent = data.fonderie.intro;
    const svcList = fonderie.querySelector('[data-fonderie-services]');
    if (svcList) {
      svcList.innerHTML = data.fonderie.services.map(s => `
        <li>
          <div>
            <strong>${esc(s.titre)}</strong>
            <p class="muted" style="margin-top:4px; font-size:0.85rem; color: var(--text-muted);">${esc(s.description)}</p>
          </div>
        </li>
      `).join('');
    }
  }
}

// --- Render partenaires ---
async function renderPartenaires() {
  const grid = document.querySelector('[data-partenaires-grid]');
  if (!grid) return;
  const data = await loadJSON('partenaires');
  if (!data || !data.partenaires) return;
  grid.innerHTML = data.partenaires.map((p, i) => `
    <a class="partner-link reveal reveal-delay-${(i % 3) + 1}" href="${esc(p.lien)}" target="_blank" rel="noopener" title="${esc(p.description || p.nom)}">
      <img src="${esc(p.image)}" alt="${esc(p.nom)}" loading="lazy">
    </a>
  `).join('');
  setupReveals();
}

// --- Footer year ---
function setupFooter() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// --- Init based on page ---
async function init() {
  setupNavbar();
  setupMobileMenu();
  setupFooter();

  // Always-needed (settings, social links in footer/nav)
  await renderSiteSettings();

  // Page-specific renderers (each is no-op if its DOM target doesn't exist)
  await Promise.all([
    renderOeuvres(document.body.dataset.page === 'home' ? 9 : null),
    renderExpositions(document.body.dataset.page === 'home' ? 3 : null),
    renderTechnique(),
    renderParcours(),
    renderStages(),
    renderPartenaires(),
  ]);

  // After all content is in the DOM, set up reveals once more (safe to call multiple times)
  setupReveals();
}

document.addEventListener('DOMContentLoaded', init);
