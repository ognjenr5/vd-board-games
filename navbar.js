const pages = [
  { key: 'index',   rs: 'index.html',   en: 'index-en.html',   labelRs: 'Početna',       labelEn: 'Home' },
  { key: 'gallery', rs: 'gallery.html', en: 'gallery-en.html', labelRs: 'Galerija',      labelEn: 'Gallery' },
  { key: 'catalog', rs: 'catalog.html', en: 'catalog-en.html', labelRs: 'Katalog igara', labelEn: 'Game Catalog' },
  { key: 'cart',    rs: 'cart.html',    en: 'cart-en.html',    labelRs: 'Moj nalog',     labelEn: 'My Account' },
  { key: 'oNama',   rs: 'oNama.html',   en: 'oNama-en.html',   labelRs: 'O nama',        labelEn: 'About Us' },

  { key: 'avalon',          rs: '../pagesRS/avalon.html',             en: '../pagesEN/avalon-en.html',              labelRs: 'Avalon',              labelEn: 'Avalon' },
  { key: 'azul',            rs: '../pagesRS/azul.html',               en: '../pagesEN/azul-en.html',                labelRs: 'Azul',                labelEn: 'Azul' },
  { key: 'catan',           rs: '../pagesRS/catan.html',              en: '../pagesEN/catan-en.html',               labelRs: 'Catan',               labelEn: 'Catan' },
  { key: 'coveceNeLjutiSe', rs: '../pagesRS/coveceNeLjutiSe.html',    en: '../pagesEN/coveceNeLjutiSe-en.html',     labelRs: 'Čoveče ne ljuti se',  labelEn: 'Ludo' },
  { key: 'druzinaOstrice',  rs: '../pagesRS/druzinaOstrice.html',     en: '../pagesEN/druzinaOstrice-en.html',      labelRs: 'Družina oštrice',     labelEn: 'Blade fellowship' },
  { key: 'memory',          rs: '../pagesRS/memory.html',             en: '../pagesEN/memory-en.html',              labelRs: 'Igra memorije',       labelEn: 'Memory' },
  { key: 'monopol',         rs: '../pagesRS/monopol.html',            en: '../pagesEN/monopol-en.html',             labelRs: 'Monopol',             labelEn: 'Monopoly' },
  { key: 'riziko',          rs: '../pagesRS/riziko.html',             en: '../pagesEN/riziko-en.html',              labelRs: 'Riziko',              labelEn: 'Risk' },
  { key: 'sah',             rs: '../pagesRS/sah.html',                en: '../pagesEN/sah-en.html',                 labelRs: 'Šah',                 labelEn: 'Chess' },

  { key: 'family',    rs: 'family.html',    en: 'family-en.html',     labelRs: 'Porodične igre',    labelEn: 'Family games' },
  { key: 'party',     rs: 'party.html',     en: 'party-en.html',      labelRs: 'Zabavne igre',      labelEn: 'Party games' },
  { key: 'strategy',  rs: 'strategy.html',  en: 'strategy-en.html',   labelRs: 'Strateške igre',    labelEn: 'Strategy games' }
];

const categories = [
  { key: 'porodicne', rs: 'Porodične igre', en: 'Family Games' },
  { key: 'strateske', rs: 'Strateške igre', en: 'Strategy Games' },
  { key: 'zabavne',   rs: 'Zabavne igre',   en: 'Party Games' }
];

function isCatalogPage(key) {
  return ['family', 'party', 'strategy'].includes(key)
}

function getCurrPage() {
  let file = window.location.pathname.split('/').pop() || 'index.html'
  let page = file.split(".")[0].replace('-en', '')
  let curr = pages.find(p => p.key == page)
  return curr
}

function getPrefix() {
  const path = window.location.pathname;
  return (path.includes('/pagesRS/') || path.includes('/pagesEN/') || path.includes('/catalogs/')) ? '../' : '';
}

function navLink(currPage, linkPage, lang) {
  const isActive = currPage.key == linkPage.key
  let navLinkHTML = `
    <li class="nav-item">
      <a class="nav-link ${isActive ? "active" : ""}" ${isActive ? 'aria-current="page"' : ''} href="${getPrefix()}${lang == 'en' ? linkPage.en : linkPage.rs}">${label(linkPage.key, lang)}</a>
    </li>
  `
  return navLinkHTML
}

function getPage(pageKey) {
  return pages.find(p => p.key == pageKey)
}

function href(pageKey, lang) {
  const p = getPage(pageKey);
  return lang == 'en' ? p.en : p.rs;
}

function label(pageKey, lang) {
  const p = getPage(pageKey);
  return lang == 'en' ? p.labelEn : p.labelRs;
}

function showNavbar() { 
    const lang = document.documentElement.lang == 'en' ? 'en' : 'rs'
    const page = getCurrPage()
    const prefix = getPrefix()

    const navbarHTML = `
      <div class="container-fluid">

      <a class="navbar-brand" href="${prefix}${href('index', lang)}">
        <img src="${prefix}img/logo.svg" alt="Logo" width="75" height="60" class="d-inline-block align-text-center">
        Kocka
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">
        </span>
      </button>

      <div class="collapse navbar-collapse align-center" id="navbarNavDropdown">
        <ul class="navbar-nav mx-auto">
          ${navLink(page, getPage('index'), lang)}
          ${navLink(page, getPage('gallery'), lang)}
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle ${isCatalogPage(page.key) ? "active" : ""}" ${isCatalogPage(page.key) ? 'aria-current="page"' : ''} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${label('catalog', lang)}
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="${prefix}catalogs/${href('family', lang)}">${label('family', lang)}</a></li>
              <li><a class="dropdown-item" href="${prefix}catalogs/${href('strategy', lang)}">${label('strategy', lang)}</a></li>
              <li><a class="dropdown-item" href="${prefix}catalogs/${href('party', lang)}">${label('party', lang)}</a></li>
            </ul>
          </li>
          ${navLink(page, getPage('cart'), lang)}
          ${navLink(page, getPage('oNama'), lang)}
        </ul>

        <div class="icons-cont">
          <div class="lang-check">
            <span>RS</span>
            <div class="form-check form-switch">
              <input class="form-check-input lang-switch" id="lang-${page.key}-${lang}" type="checkbox" role="switch" ${lang == 'en' ? 'checked' : ''}>
            </div>
            <span>EN</span>
          </div>

          <div class="cart-cont">
            <span class="position-relative">
              <a href="${prefix}${href('cart', lang)}">
                <span class="cart-icon">🛒</span>
              </a>
              <span id="cartBadge"
                class="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">0</span>
            </span>
          </div>
        </div>

      </div>

    </div>
    `

    $('nav').html(navbarHTML);
}

$(document).ready(function () {
    showNavbar()
});