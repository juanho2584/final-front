// Consumo de API
const URLSERVER = "https://dummyjson.com/products";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// Variables para la paginación
let currentPage = 1; // Página actual
const productsPerPage = 12; // Productos por página
let productos = []; // Lista de productos cargados

// Función para renderizar un producto
const renderProducto = (product) => {
  let html = `<div class="col-md-4">
                <div class="card mb-4 shadow-sm">              
                    <img src="${product.images[0]}" alt="${product.brand}" class="card-img-top product-image">                    
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text garantia">${product.warrantyInformation}</p>
                        <p class="card-text">Precio: $${product.price}</p>
                        <button onclick="agregarAlCarrito()" class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
              </div>`;
  return html;
};

// Función para renderizar la página actual
const renderPage = () => {
  let divProductos = document.getElementById("product-list");
  divProductos.innerHTML = ""; // Limpiar productos actuales

  // Calcular el índice de inicio y fin para los productos en la página actual
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, productos.length);

  // Renderizar productos de la página actual
  for (let i = startIndex; i < endIndex; i++) {
    let html = renderProducto(productos[i]);
    divProductos.insertAdjacentHTML("beforeend", html);
  }

  // Actualizar el estado de los botones de paginación
  document.getElementById("prev-page").disabled = currentPage === 1;
  document.getElementById("next-page").disabled = endIndex >= productos.length;
};

// Funciones para manejar botones de paginación
const nextPage = () => {
  if (currentPage * productsPerPage < productos.length) {
    currentPage++;
    renderPage();
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

// Consumir la API y cargar productos
fetch(URLSERVER, options)
  .then((response) => response.json())
  .then((response) => {
    console.log(response); // Verificar la estructura de la respuesta
    productos = response.products; // Guardar los productos en la variable global
    renderPage(); // Renderizar la primera página
  })
  .catch((err) => console.error("Error al consumir la API:", err));

// Listeners para los botones de paginación
document.getElementById("prev-page").addEventListener("click", prevPage);
document.getElementById("next-page").addEventListener("click", nextPage);
