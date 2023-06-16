//** URL Base */ 
const baseUrl = 'https://ecommercebackend.fundamentos-29.repl.co/';
//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const onePromotion = document.querySelector("#product-promotion");
// * Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car")
//* Array carrito
//? Necesitamos tener un array que reciba los elementos que debemos introducir en el carrito de compra.
let carProducts = [];
//* Ventana modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails =[];
navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
});
eventListenersLoader();
function eventListenersLoader(){
    //* Cuando se precione el boton "add to Car"
    productsList.addEventListener("click", addProduct)
    // //* Cuando se presione el botón "Delete"
    car.addEventListener("click", deleteProduct);
    // //* Cuando se de click al botón Empty Car
    emptyCarButton.addEventListener("click", emptyCar)
    //* Listeners modal
    //* Cuando se de click al botón de ver detalles
    productsList.addEventListener("click", modalProduct)
    //* Cuando se de click al botón de cerrar modal.
    modalContainer.addEventListener("click", closeModal)
    //*se ejecute cuando carga la página
    document.addEventListener("DOMContentLoaded", () =>{
        //* Si el localStorage tiene info, entonces, igualamos carProducts con la info  del localStorage. Pero si el localStorage esta vacio, entonces, carProducts es igual a un array vacio
        carProducts = JSON.parse(localStorage.getItem("car")) || []
        carElementsHTML()
    })
}
//* Hacer peticion a la API de productos
//* 1- Crear una funcion con la petición
function getProducts(){
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            printProducts(products)
        })
        .catch((error) => {
            console.log(error)
        })
}
getProducts()
//* 2- Renderizar los productos capturados de la API en mi HTML.
function printProducts(products){
    let html = "";
    let htmlP = "";
    let lastRND = products.length
    let firstRND = 1
    function promotionProduct(min, max) {
        return Math.random() * (max - min) + min;
    }
    let promoDay = promotionProduct(firstRND,lastRND)
    for(let product of products){
        if(product.id == Math.round(promoDay)){ 
            htmlP += 
            `
            <div class="promotion__element">
                <img src="${product.image}" alt="producto ${product.category}, ${product.name}" class="promotion__img">
                <div class="promotion__information">
                    <h2 class="promotion__h2">PROMOCIÓN SORPRESA - ANTES: $${product.price}</h2>
                    <h3 class="promotion__product">${product.name} ::: REF: ${product.id}</h3>
                    <p class="promotion__description">${product.description}</p>
                    <button data-id="${product.id}" class="promotion__button">
                        Buy only $ ${product.price - 1.4}
                    </button>
                </div>
            </div>
            `
        }
        html += 
        `
        <div class="products__elements">
            <img src="${product.image}" alt="${product.name}" class="products__img">
                <p class="products__name">${product.name}</p>
                <div class="products__div">
                    <p class="products__price">USD ${product.price.toFixed(2)}</p>
                </div>
                <div class="products__div">
                    <div class="div__products__button">
                        <button data-id="${product.id}" class="products__button add_car">
                            <i class="fa-sharp fa-solid fa-cart-plus"></i>
                            Add to car
                        </button>
                    </div>
                    <div class="div__products__view"> 
                        <button data-id="${product.id}" data-description="${product.description}" class="products__button__view products__details">
                            <i class="fa-solid fa-eye products__button__view products__details"></i>
                        </button>
                    </div>
                </div>
        </div>
        `            
    }
    productsList.innerHTML = html
    onePromotion.innerHTML = htmlP 
}
//* Agregar los productos al carrito
//* 1. Capturar la información del producto al que se dé click.
function addProduct(event){
    //* Método contains => valída si existe un elemento dentro de la clase.
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement.parentElement
        //* parentElement => nos ayuda a acceder al padre inmediatamente superior del elemento.
        carProductsElements(product)
    }
}
//* 2. Debemos transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product){
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        quantity: 1
    }
    //* Agregar el objeto de infoProduct al array de carProducts, pero hay que validar si el elemento existe o no.
    //? El primer if valída si por lo menos un elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProduct.
    if( carProducts.some( product => product.id === infoProduct.id ) ){ //True or False
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            } else {
                return product
            }
        })
        carProducts = [ ...productIncrement ]
    } else {
        carProducts = [ ...carProducts, infoProduct ]
    }
    carElementsHTML();
}
//? Aquí estan todos los productos del carrito
function carElementsHTML() {
    let carHTML = '';
    for (let product of carProducts){
        carHTML += 
        `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product.image}">
              <p class="car__product__name">${product.name}</p>
            </div>
        </div>
            <div class="car__product__description">
                <p class="car__price">Precio: ${product.price}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button class="delete__product" data-id="${product.id}">
                    Delete
                </button>
            </div>
        <hr>
        `
    }
    carList.innerHTML = carHTML;
    productsStorage()
}
//?Localstorage 
function productsStorage(){
    localStorage.setItem("car", JSON.stringify(carProducts))
}
//* Eliminar productos del carrito
function deleteProduct(event) {
    if( event.target.classList.contains('delete__product') ){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }
}
//* Vaciar el carrito
function emptyCar() {
    carProducts = [];
    carElementsHTML();
}
//* Ventana Modal
//* 1. Crear función que escuche el botón del producto.
function modalProduct(event) {    
    // if(event.target.classList.contains("products__button__view")){
    if(event.target.classList.contains("products__details")){

        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement.parentElement.parentElement
        modalDetailsElement(product)
    }
}
//* 2. Crear función que escuche el botón de cierre.
function closeModal(event) {
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}
//* 3. Crear función que convierta la info HTML en objeto.
function modalDetailsElement(product) {
    const infoDatails = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        description: product.querySelector('.products__details').getAttribute('data-description')
    }
    modalDetails = [ ...modalDetails, infoDatails ]
    modalHTML()
}
//* 4. Dibujar producto dentro del modal.
function modalHTML() {
    let detailsHTML = ""
    for( let element of modalDetails ) {
        detailsHTML =
         `
            <div class="modal__container">
                <img src="${element.image}" alt="producto: ${element.name}" class="modal__img">
                <div class="modal__container__details">
                    <div class="modal__title"> 
                        <h3 class="modal__product">${element.name}</h3> 
                    </div>
                    <p class="modal__description">${element.description}</p>
                    <div class="modal__container__price">
                        <p class="modal__price">${element.price}</p>
                    </div>
                    
                </div>

            </div>
        `
    }
    modalElement.innerHTML = detailsHTML
}
//* local storage: 
//* Es una base de datos del navegador que nos permite almacenar información para hacerla recurrente dentro de nuestra página.
//? Guardando un valor en el local storage => setItem("key","value").
// localStorage.setItem("name", "alejandro")
//? Obtener info desde LocalStorage => getItem
// localStorage.getItem("name")
// console.log(localStorage.getItem("name"));
// const user = {name: 'José', lastName: 'Barreto'}
//? Convertir el objeto user en un JSON
// localStorage.setItem("user", JSON.stringify(user))
//? Obtener la información y convertirla de JSON a Javascript
// const userLocal = JSON.parse(localStorage.getItem("user"))
// console.log(userLocal);