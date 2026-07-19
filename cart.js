function loadCart() { 
    if (localStorage.getItem('cart') != null)
        return JSON.parse(localStorage.getItem('cart'))
    else
        return []
}

function showCart() {
    let list = $(".cart-list")
    let cart = loadCart()
    let priceSum = 0

    cart.forEach(game => {
        priceSum += game.price * game.qty
        let gameNameElem = $(`<h5 class="display-6">${game.name}</h5>`)
        let gameQtyElem = $(`<span class="game-qty">x ${game.qty}</span>`)
        let gamePriceElem = $(`<span>${game.price * game.qty} RSD</span>`)
        let gameElem = $(`<ul class="game-elem"></ul>`).append(gameNameElem).append(gameQtyElem).append(gamePriceElem)
        $(list).append(gameElem);
    });

    let totalElem = $(`<ul class="game-elem"><span>Total:</span><span>${priceSum} RSD</span></ul>`)
    $(list).append(totalElem);
}

$(document).ready(function () {
    showCart()
});