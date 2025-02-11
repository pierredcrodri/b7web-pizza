let cart = [];
let modalQt = 1;
let modalKey = 0;

const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element);

const pizzaArea = $(".pizza-area");

pizzaJson.forEach((pizza, index) => {
  const pizzaItem = $(".models .pizza-item").cloneNode(true);
  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.price.toFixed(2)}`;
  pizzaItem.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();

    let key = event.target.closest(".pizza-item").getAttribute("data-key");
    let item = pizzaJson[key];

    modalKey = key;

    $(".pizzaInfo h1").innerHTML = item.name;
    $(".pizzaInfo--desc").innerHTML = item.description;
    $(".pizzaBig img").src = item.img;
    $(".pizzaInfo--actualPrice").innerHTML = `R$ ${item.price.toFixed(2)}`;
    $(".pizzaInfo--size.selected").classList.remove("selected");

    $$(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = item.sizes[sizeIndex];
    });

    modalQt = 1;
    $(".pizzaInfo--qt").innerHTML = modalQt;

    $(".pizzaWindowArea").style.display = "flex";
    $(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      $(".pizzaWindowArea").style.opacity = 1;
    }, 100);
  });
  pizzaArea.append(pizzaItem);
});

/* Modal */

function closeModal() {
  $(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    $(".pizzaWindowArea").style.display = "none";
  }, 500);
}

$(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    $(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

$(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  $(".pizzaInfo--qt").innerHTML = modalQt;
});

$(".pizzaInfo--addButton").addEventListener("click", () => {
  let pizza = pizzaJson[modalKey];
  let size = $(".pizzaInfo--size.selected").getAttribute("data-key");
  let identifier = `${pizza.id}@${size}`;
  const key = cart.findIndex((cartItem) => cartItem.identifier === identifier);

  if (key === -1) {
    cart.push({
      identifier,
      size,
      id: pizza.id,
      qt: modalQt,
    });
  } else {
    cart[key].qt += modalQt;
  }

  updateCart();
  closeModal();
});

$$(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (button) => {
    button.addEventListener("click", closeModal);
  }
);

$$(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    $(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

/* Cart */

$(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0) {
        $("aside").style.left = "0";
    }
})

$(".menu-closer").addEventListener("click", () => {
    $("aside").style.left = "100vw";
})

function updateCart() {
    $(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {
    $("aside").classList.add("show");
    $(".cart").innerHTML = "";

    let subtotal = 0;
    let total = 0;
    let desconto = 0;

    for (let item in cart) {
      let pizzaItem = pizzaJson.find((pizza) => pizza.id == cart[item].id);

      subtotal += pizzaItem.price * cart[item].qt;

      let cartItem = $(".models .cart--item").cloneNode(true);
      let pizzaSizeName;
      console.log(cart[item]);
      switch (cart[item].size) {
        case "0":
          pizzaSizeName = "P";
          break;
        case "1":
          pizzaSizeName = "M";
          break;
        case "2":
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[item].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[item].qt > 1) {
            cart[item].qt--;
          } else {
            cart.splice(item, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[item].qt++;
          updateCart();
        });
      $(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    $(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    $(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    $(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    $("aside").classList.remove("show");
    $("aside").style.left = "100vw";
  }
}
