$(document).ready(function(){
    console.log("Found buttons:", $('.add-to-cart').length);

     //er handlekurven
    const $menuCartElement = $('.menu-cart');
    const $cartItemsElement =$('.cart-list');
    const $cartElement = $('.cart');
    const $mainElement = $('.main');

    let cart = [];

    //funksjonen som legger til handlerkurv som bilder inhold og pris

  function addToCart(productElement) {
    const $productElement = $(productElement);
    const productId = $productElement.data('product');
    const productName = $productElement.find('.product-title').text();
    const productPrice = parseFloat($productElement.find('.product-price').text().replace('$', ''));
    const productImage = $productElement.find('.product-img').attr('src');

    let existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const newItem = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      };
      cart.push(newItem);
    }

    updateCartCount();
    renderCartItems();
    }
    //funskjonen jeg glemte helt å gjøre som hjelper at pris og innhold blir lagt in i Your cart
   function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('.cart-count').text(totalCount);
  }
    function renderCartItems() {
    $cartItemsElement.empty();

    if (cart.length === 0) {
        $cartItemsElement.html(`
        <div class="cart-empty">
            <img src="images/empty.svg" alt="Empty cart">
            <p>Your Cart is Empty</p>
        </div>
        `);
    } else {
        cart.forEach(item => {
        const $cartItemElement = $(`
            <div class="cart-item">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-desc">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-quantity">
                <button class="change-quantity" data-id="${item.id}" data-action="decrement">-</button>
                <span>${item.quantity}</span>
                <button class="change-quantity" data-id="${item.id}" data-action="increment">+</button>
                </div>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `);
        $cartItemsElement.append($cartItemElement);
        });
    }

    updateOrderSummary();
    }

        //hvordan prisen blir lagt sammen
    function updateOrderSummary()  {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.15; //skatt er antatt 15 prosent
        const total = subtotal + tax;

        $('#total-price .cart-amount-value').text(`$${subtotal.toFixed(2)}`);
        $('#tax .cart-amount-value').text(`$${(subtotal * 0.15).toFixed(2)}`);
        $('#final-price .cart-amount-value').text(`$${(subtotal * 1.15).toFixed(2)}`);
    }


    $('.add-to-cart').on('click', function(){
        console.log("🛒 Add to cart clicked!");
        const productElement = $(this).closest('.product');
        addToCart(productElement);
    });

        //legger til kvantitet i handlekurv isteden for 1 kan den gi flere per pluss og minus
    $cartItemsElement.on('click', '.change-quantity', function(){
        const itemId = $(this).data('id');
        const action = $(this).data('action');
        const item = cart.find(item => item.id === itemId);

        if (action === 'increment') {
            item.quantity += 1;
        } else if (action === 'decrement' && item.quantity > 1) {
            item.quantity -= 1;
        }
        updateCartCount();
        renderCartItems();
        

    

    }); //fjerner ting fra handlekurven

    $cartItemsElement.on('click','.cart-item-remove', function(){
        const itemId = $(this).data('id');
        cart = cart.filter(item => item.id !== itemId);

        updateCartCount();
        renderCartItems();
    });
            //legger til klikk funskjon
    $menuCartElement.on('click', function(){
        $cartElement.toggleClass('collapsed');
        $mainElement.toggleClass('expanded', $cartElement.hasClass('collapsed'));
    });

    renderCartItems();
    
});  
