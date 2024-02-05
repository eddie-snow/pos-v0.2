
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCardHTML = document.querySelector('.listCard');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart') //if is not there it will, if it is it will delete
})

closeCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
})
//item de json para html lista de produtos
const addDataToHTML =() =>{
    listProductHTML.innerHTML = '';
    if(listProducts.length>0){
        listProducts.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                 <img src="${product.image}" alt="item">
                 <h2>${product.name}</h2>
                 <div class="price">
                  ${product.price} $
                 </div>
                 <button class="addCart">Adicionar ao Carrinho</button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }
}

listProductHTML.addEventListener('click', (event) =>{
    let positionOnClick = event.target;
    if(positionOnClick.classList.contains('addCart')){
        let product_id = positionOnClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

//item de lista de productos para carinho de compras
const addToCart = (product_id) =>{
    let positionOnThisProductInCart =carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if (positionOnThisProductInCart < 0){ //product not in the cart
        carts.push({
            product_id: product_id,
            quantity: 1,
        })
    }else{ //if already in the cart
        carts[positionOnThisProductInCart].quantity = carts[positionOnThisProductInCart].quantity +1
    }
    addCartToHTML();
    
    addCartToMemory(); // serve para guardar os dados mesmo se o usurio fechar o pc 
}
const addCartToMemory = () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
    //localStorage is a web storage technology in web browsers that allows websites and web applications to store key-value pairs in a client's web browser.
}

const addCartToHTML = () =>{
    listCardHTML.innerHTML = '';
    let totalQuantity = 0; //o carinho
    if(carts.length > 0) {
        carts.forEach(cart =>{
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id; //for minus< and plus > on shopping cart
            let positiOnProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positiOnProduct];
            newCart.innerHTML = `
            <div class="image">
                <img src="${info.image}" alt="item1">
            </div>
            <div class="name">
                    ${info.name}
            </div>
            <div class="totalPrice">
                    ${info.price * cart.quantity} $
            </div>
            <div class="quantity">
                    <span class="minus"> - </span>
                    <span>${cart.quantity}</span>
                    <span class="plus"> + </span>    
            </div>
            `
        listCardHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCardHTML.addEventListener('click', (event) =>{
    let positionOnClick = event.target; //event.target the location where user just clicker
    if(positionOnClick.classList.contains('minus') || positionOnClick.classList.contains('plus')){
        let product_id = positionOnClick.parentElement.parentElement.dataset.id; // <> is in class btn, class btn is in class item, 2 layers, so to query info we have to do parentElemnt twice
        let type = 'minus';
        if(positionOnClick.classList.contains('plus')){
            type = 'plus'
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) =>{
    let positionOnItemIncart = carts.findIndex((value) => value.product_id == product_id)
                            let totalPriceCalculator
    if(positionOnItemIncart >= 0){
        switch (type) {
            case 'plus':
                carts[positionOnItemIncart].quantity = carts[positionOnItemIncart].quantity +1
                break;
        
            default:
                let valueChange = carts[positionOnItemIncart].quantity -1 //check what the result is after subtrating
                if(valueChange>0){ //if is greater than 0 , subtract normaly
                    carts[positionOnItemIncart].quantity  = valueChange;
                }else{ // if is 0, we delete the product
                    carts.splice(positionOnItemIncart, 1);
                }
                break;
        }
    }
    addCartToMemory(); //updating the latest data into memory
    addCartToHTML(); //refresh the data on the screen
}


const initApp =() =>{
    //get data from json
    fetch('product.json') //IMPORTANT fetch needs a htpp setver to work, meaning you kinda need to use liveserver extension
    .then(response => response.json())
    .then(data =>{
        listProducts = data;
        addDataToHTML();

        // get data from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }

    })

}
initApp()

//totalPriceCalculador function

//pick the price from carinho de compras(already calculated with price and all)
// and added them all togheter, if item is removed or dimished it will also change
