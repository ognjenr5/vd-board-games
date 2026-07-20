let games = [
    {
        id: "avalon",
        name_en: "The Resistance: Avalon",
        name_rs: "Avalon",
        price: 2799,
        rating: 0,
        category: 'family'
    },
    {
        id: "azul",
        name_en: "Azul",
        name_rs: "Azul",
        price: 3999,
        rating: 0,
        category: 'party'
    },
    {
        id: "catan",
        name_en: "Catan",
        name_rs: "Catan",
        price: 3499,
        rating: 0,
        category: 'strategy'
    },
    {
        id: "covece-ne-ljuti-se",
        name_en: "Ludo",
        name_rs: "Čoveče ne ljuti se",
        price: 999,
        rating: 0,
        category: 'party'
    },
    {
        id: "druzina-ostrice",
        name_en: "Blade Fellowship",
        name_rs: "Družina oštrice",
        price: 4599,
        rating: 0,
        category: 'party'
    },
    {
        id: "memory",
        name_en: "Memory",
        name_rs: "Memorija",
        price: 799,
        rating: 0,
        category: 'family'
    },
    {
        id: "monopol",
        name_en: "Monopoly",
        name_rs: "Monopol",
        price: 2999,
        rating: 0,
        category: 'family'
    },
    {
        id: "riziko",
        name_en: "Risk",
        name_rs: "Riziko",
        price: 3299,
        rating: 0,
        category: 'strategy'
    },
    {
        id: "sah",
        name_en: "Chess",
        name_rs: "Šah",
        price: 1499,
        rating: 0,
        category: 'strategy'
    }
]

const lang = document.documentElement.lang == 'en' ? 'en' : 'rs'
let searchVal = '';

function createGameCard(game) {
    const link = `../pages${lang.toUpperCase()}/${game.id}${lang == 'en' ? '-en' : ''}.html`
    const imgLink = `../img/${game.id}-1.jpg`

    let gameCardHTML = `
            <a href="${link}">
                <div class="game-card">
                    <div class="game-img-cont">
                        <img src="${imgLink}" class="game-img">
                    </div>
                    <div class="game-card-body">
                        <div class="game-card-header">
                            <h5 class="display-6 game-name">${lang == 'en' ? game.name_en : game.name_rs}</h5>
                            <p class="game-price text-uppercase">${game.price} RSD</p>
                        </div>
                        <small class="text-muted game-description">
                            Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Eveniet totam non voluptas similique. Debitis impedit explicabo reiciendis
                            doloremque, sit rerum magnam dolorem autem, sequi cumque ducimus unde suscipit facere
                            quo.
                        </small>
                    </div>
                </div>
            </a>
    `
    return $(gameCardHTML)
}

const sortOptions = {
  priceAsc:   (a, b) => a.price - b.price,
  priceDesc:  (a, b) => b.price - a.price,
  nameAsc:    (a, b) => lang == 'en' ? a.name_en.localeCompare(b.name_en) : a.name_rs.localeCompare(b.name_rs),
  nameDesc:   (a, b) => lang == 'en' ? b.name_en.localeCompare(a.name_en) : b.name_rs.localeCompare(a.name_rs),
};

let sortOption = sortOptions.nameAsc

function displayCards(games) {
    $('.games-cont').empty();
    let gamesSorted = games.sort(sortOption)
    gamesSorted.forEach(game => {
        $('.games-cont').append(createGameCard(game))
    });
}

function search(games) {
    $('.games-cont').empty();
    let searchOption = $('#search-by').val()
    return games.filter(g => lang == 'en' ? g.name_en.toLowerCase().includes(searchVal) : g.name_rs.toLowerCase().includes(searchVal))
}

function priceFilter(games) {
    let low = parseInt($('#price-range-low').val())
    let high =  parseInt($('#price-range-high').val())

    if (low > high) {
        let tmp = low
        low = high
        high = tmp
    }
    $('#price-range-display').text(`${low} - ${high} RSD`)

    return games.filter(g => g.price >= low && g.price <= high)
}

$(document).ready(function () {
    const lang = document.documentElement.lang == 'en' ? 'en' : 'rs'
    const category = $('body').attr('id');
    let gamesFiltered = games.filter(g => g.category == category)

    displayCards(gamesFiltered)

    $('#sort-by').on('change', function() {
        sortOption = sortOptions[$(this).val()]
        displayCards(search(priceFilter(gamesFiltered)))
    })

    $('#search').on('input', function() {
        searchVal = $(this).val()
        displayCards(search(priceFilter(gamesFiltered)))
    })

    let minPrice = gamesFiltered.reduce((minElem, curr) => curr.price < minElem.price ? curr : minElem).price
    let maxPrice = gamesFiltered.reduce((maxElem, curr) => curr.price > maxElem.price ? curr : maxElem).price
    $('#price-range-display').text(`${minPrice} - ${maxPrice} RSD`)

    $('.price-range').attr('min', minPrice)
    $('.price-range').attr('max', maxPrice)

    $('#price-range-low').attr('value', minPrice)
    $('#price-range-high').attr('value', maxPrice)

    $('.price-range').on('input', function() {
        displayCards(search(priceFilter(gamesFiltered)))
    })
});