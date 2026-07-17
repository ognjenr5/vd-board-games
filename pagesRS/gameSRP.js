const storage = (() => {
  try {
    localStorage.setItem('__t', '1'); localStorage.removeItem('__t');
    return localStorage;
  } catch (e) {
    const mem = {};
    return {
      getItem: k => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: k => { delete mem[k]; }
    };
  }
})();

const REVIEWS_KEY = 'reviews';
const CART_KEY = 'cart';

const LABELS = {
  added: '✓ Dodato u korpu',
  noRatingsShort: 'Jos nema ocena',
  beFirst: 'Budite prvi koji ce oceniti ovu igru.',
  noComments: 'Nema komentara.',
  anonymous: 'Anoniman',
  formError: 'Unesite ocenu ili napisite komentar.',
  currency: 'RSD',
  minSuffix: ' min',
  summaryTpl: 'Prosecna ocena: {avg} od 5 — na osnovu {rated} ocena, {total} komentara.'
};
const LOCALE = 'sr-RS';

const root = document.getElementById('gameData');
const game = {
  id: root.dataset.id,
  name: root.dataset.name,
  description: root.dataset.description,
  minPlayers: +root.dataset.minPlayers,
  maxPlayers: +root.dataset.maxPlayers,
  minAge: +root.dataset.minAge,
  durationMin: +root.dataset.durationMin,
  durationMax: +root.dataset.durationMax,
  price: +root.dataset.price
};

function loadAllReviews() {
  try { return JSON.parse(storage.getItem(REVIEWS_KEY)) || {}; }
  catch (e) { return {}; }
}
function getReviews(id) { return loadAllReviews()[id] || []; }
function saveReview(id, review) {
  const all = loadAllReviews();
  (all[id] = all[id] || []).push(review);
  storage.setItem(REVIEWS_KEY, JSON.stringify(all));
}
function averageRating(id) {
  const r = getReviews(id).map(x => x.rating).filter(n => n >= 1);
  return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null;
}

function starsHTML(value) {
  let h = '';
  for (let i = 1; i <= 5; i++)
    h += `<span class="${i <= Math.round(value) ? 'on' : ''}">★</span>`;
  return h;
}
const fmtPrice = n => n.toLocaleString(LOCALE) + ' ' + LABELS.currency;
const fmtRange = (a, b, suf = '') => (a === b ? a : a + '–' + b) + suf;

function renderGame() {
  document.getElementById('gameName').textContent = game.name;
  document.getElementById('gameDesc').textContent = game.description;
  document.getElementById('mPlayers').textContent = fmtRange(game.minPlayers, game.maxPlayers);
  document.getElementById('mAge').textContent = game.minAge + '+';
  document.getElementById('mDuration').textContent = fmtRange(game.durationMin, game.durationMax, LABELS.minSuffix);
  document.getElementById('mPrice').textContent = fmtPrice(game.price);
}

function renderReviews() {
  const reviews = getReviews(game.id);
  const avg = averageRating(game.id);
  const rated = reviews.filter(r => r.rating >= 1).length;

  document.getElementById('avgStars').innerHTML = starsHTML(avg || 0);
  document.getElementById('avgText').textContent =
    avg ? `${avg.toFixed(1)} / 5 (${rated})` : LABELS.noRatingsShort;

  document.getElementById('summary').textContent =
    avg ? buildSummary(avg.toFixed(1), rated, reviews.length) : LABELS.beFirst;

  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  if (!reviews.length) {
    list.innerHTML = '<p class="text-muted">' + LABELS.noComments + '</p>';
    return;
  }
  reviews.slice().reverse().forEach(r => {
    const date = new Date(r.date).toLocaleDateString(LOCALE);
    const card = document.createElement('div');
    card.className = 'card review-card mb-2';
    card.innerHTML = `
      <div class="card-body py-3">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong>${escapeHTML(r.author || LABELS.anonymous)}</strong>
          <small class="text-muted">${date}</small>
        </div>
        ${r.rating ? `<div class="stars mb-2">${starsHTML(r.rating)}</div>` : ''}
        ${r.comment ? `<p class="mb-0">${escapeHTML(r.comment)}</p>` : ''}
      </div>`;
    list.appendChild(card);
  });
}

function buildSummary(avg, rated, total) {
  return LABELS.summaryTpl
    .replace('{avg}', avg)
    .replace('{rated}', rated)
    .replace('{total}', total);
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let selectedRating = 0;
const starInput = document.getElementById('starInput');
const stars = [...starInput.querySelectorAll('span')];
const ratingLabel = document.getElementById('ratingLabel');

function paintStars(n) {
  stars.forEach((s, i) => s.classList.toggle('hl', i < n));
}
stars.forEach(s => {
  const v = +s.dataset.v;
  s.addEventListener('mouseenter', () => paintStars(v));
  s.addEventListener('click', () => {
    selectedRating = v;
    ratingLabel.textContent = v + ' / 5';
  });
  s.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); }
  });
});
starInput.addEventListener('mouseleave', () => paintStars(selectedRating));

document.getElementById('submitReview').addEventListener('click', () => {
  const author = document.getElementById('author').value.trim();
  const comment = document.getElementById('commentText').value.trim();
  const err = document.getElementById('formError');

  if (!selectedRating && !comment) {
    err.textContent = LABELS.formError;
    return;
  }
  err.textContent = '';

  saveReview(game.id, {
    rating: selectedRating || 0,
    comment,
    author,
    date: new Date().toISOString()
  });

  selectedRating = 0;
  paintStars(0);
  ratingLabel.textContent = '';
  document.getElementById('author').value = '';
  document.getElementById('commentText').value = '';

  renderReviews();
});

function loadCart() {
  try { return JSON.parse(storage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}
function updateCartBadge() {
  const count = loadCart().reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartBadge').textContent = count;
}
document.getElementById('addToCart').addEventListener('click', () => {
  const cart = loadCart();
  const item = cart.find(i => i.id === game.id);
  if (item) item.qty += 1;
  else cart.push({ id: game.id, name: game.name, price: game.price, qty: 1 });
  storage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  document.getElementById('cartMsg').textContent = LABELS.added;
});

renderGame();
renderReviews();
updateCartBadge();
