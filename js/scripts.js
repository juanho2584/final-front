

document.addEventListener("DOMContentLoaded", function () {
  const cart = [];
  const cartContainer = document.getElementById("cart-container");
  const cartButton = document.getElementById("cart-toggle");
  const closeButton = document.getElementById("close-cart");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const productButtons = document.querySelectorAll(".btn-add-to-cart");
  const buyNowButton = document.getElementById("buy-now"); // Botón Comprar

  // Mostrar/Ocultar carrito
  cartButton.addEventListener("click", function () {
    cartContainer.classList.toggle("active");
  });
  closeButton.addEventListener("click", () => {
    cartContainer.classList.remove("active");
  });

  // Añadir producto al carrito
  productButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = button.closest(".card");
      const title = productCard.querySelector(".card-title").innerText;
      const priceText = productCard.querySelector(".precio").innerText;
      const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
      const imgSrc = productCard.querySelector(".card-img-top").src; // Captura el src de la imagen
      const existingProduct = cart.find((item) => item.title === title);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({ title, price, quantity: 1, imgSrc });
      }

      updateCart();
    });
  });

  // Actualizar contenido del carrito
  function updateCart() {
    const cartContent = document.getElementById("cart-content");
    cartContent.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item", "d-flex", "align-items-center", "mb-2");
        cartItem.innerHTML = `
          <img src="${item.imgSrc}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <div style="flex-grow: 1;">
            <span style="font-weight: bold;">${item.title}</span><br>
            <span>$${item.price} x ${item.quantity}</span>
          </div>
          <div>
            <button class="btn btn-sm btn-success" onclick="increaseQuantity(${index})">+</button>
            <button class="btn btn-sm btn-warning" onclick="decreaseQuantity(${index})">-</button>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button>
          </div>
        `;
        cartContent.appendChild(cartItem);
      });
    }

    // Actualizar contador del carrito
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal.innerText = total.toFixed(2);
  }

  // Eliminar producto del carrito
  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateCart();
  };

  // Incrementar cantidad
  window.increaseQuantity = function (index) {
    cart[index].quantity++;
    updateCart();
  };

  // Decrementar cantidad
  window.decreaseQuantity = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      removeItem(index);
    }
    updateCart();
  };

  // Comprar productos
  buyNowButton.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de comprar.");
      return;
    }

    const confirmation = confirm("¿Estás seguro de que deseas confirmar la compra?");
    if (confirmation) {
      // Guardar datos en Local Storage
      const total = parseFloat(cartTotal.innerText);
      const cartData = {
        products: cart,
        total: total
      };
      localStorage.setItem("cart", JSON.stringify(cartData));
      console.log("Datos del carrito guardados en Local Storage:", cartData);

      // Mostrar mensaje de compra exitosa
      alert(`¡Gracias por tu compra! El total fue $${total.toFixed(2)}.`);

      // Resetear el carrito
      cart.length = 0; // Vaciar el carrito
      updateCart();
    }
  });
});

