// =====================================================
// ARIF PHARMACY - MAIN JAVASCRIPT
// =====================================================

const CART_KEY = "medicare_cart";


// =====================================================
// CART
// =====================================================

function getCart() {

    try {
        return JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );
    } catch (error) {
        return [];
    }

}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        function (total, item) {
            return total + (Number(item.quantity) || 1);
        },
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach(function (element) {
            element.textContent = count;
        });

}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.className = "premium-toast";

        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-circle-check"></i>
        </div>

        <div class="toast-content">
            <strong>Added to Cart</strong>
            <span>${message}</span>
        </div>

        <i class="fa-solid fa-xmark toast-close"
           onclick="closeToast()"></i>
    `;

    toast.classList.remove("show");

    void toast.offsetWidth;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        closeToast();

    }, 3000);
}


function closeToast() {

    const toast = document.getElementById("toast");

    if (toast) {

        toast.classList.remove("show");

    }
}
// =====================================================
// ADD TO CART
// =====================================================

function addToCart(name, price, image) {

    const cart = getCart();

    const existing =
        cart.find(function (item) {
            return item.name === name;
        });


    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });

    }


    saveCart(cart);

    showToast(
        name + " added to cart ✓"
    );

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(index, delta) {

    const cart = getCart();

    if (!cart[index]) return;


    cart[index].quantity =
        (Number(cart[index].quantity) || 1)
        + delta;


    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }


    saveCart(cart);

    displayCart();

}


// =====================================================
// REMOVE ITEM
// =====================================================

function removeItem(index) {

    const cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

}


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const box =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("total");


    if (!box) return;


    const cart = getCart();

    box.innerHTML = "";


    if (cart.length === 0) {

        box.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty 🛒</h2>
                <p>
                    Add medicines from the
                    Medicines page to get started.
                </p>
            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "₹0";
        }

        return;
    }


    let total = 0;


    cart.forEach(function (item, index) {

        const quantity =
            Number(item.quantity) || 1;


        total +=
            Number(item.price) * quantity;


        box.insertAdjacentHTML(
            "beforeend",

            `
            <div class="cart-product">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>

                    <h3>${item.name}</h3>

                    <div class="item-price">
                        ₹${item.price}
                    </div>

                    <div class="qty-controls">

                        <button
                            class="qty-btn"
                            onclick="changeQuantity(${index}, -1)"
                        >
                            −
                        </button>

                        <span class="qty-value">
                            ${quantity}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="changeQuantity(${index}, 1)"
                        >
                            +
                        </button>

                        <button
                            class="remove"
                            onclick="removeItem(${index})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>
            `
        );

    });


    if (totalElement) {
        totalElement.textContent =
            "₹" + total;
    }

}


// =====================================================
// CHECKOUT
// =====================================================

function checkout() {

    const cart = getCart();


    if (!cart.length) {

        showToast(
            "Your cart is empty"
        );

        return;
    }


    localStorage.removeItem(
        CART_KEY
    );

    updateCartCount();


    const modal =
        document.createElement("div");

    modal.className =
        "success-modal";


    modal.innerHTML = `
        <div class="success-box">

            <i class="fa-solid fa-circle-check"></i>

            <h2>
                Order Placed Successfully!
            </h2>

            <p>
                Thank you for shopping with
                Arif Pharmacy & Medical Store.
                Your order has been confirmed.
            </p>

            <button
                onclick="this.closest('.success-modal').remove()"
            >
                Continue Shopping
            </button>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    displayCart();

}


// =====================================================
// HOME SEARCH
// =====================================================

function homeSearchMedicine() {

    const input =
        document.getElementById(
            "homeSearch"
        );


    if (!input) return;


    const searchTerm =
        input.value.trim();


    if (searchTerm === "") {

        window.location.href =
            "medicines.html";

        return;
    }


    window.location.href =
        "medicines.html?search=" +
        encodeURIComponent(
            searchTerm
        );

}


// =====================================================
// MEDICINE SEARCH
// =====================================================

function filterMedicines(searchTerm) {

    const search =
        String(searchTerm || "")
            .trim()
            .toLowerCase();


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    let firstMatch = null;


    products.forEach(function (product) {

        const heading =
            product.querySelector("h3");


        if (!heading) return;


        const medicineName =
            heading.textContent
                .trim()
                .toLowerCase();


        const matches =
            search === "" ||
            medicineName.includes(search);


        if (matches) {

            product.style.display = "";

            if (!firstMatch) {
                firstMatch = product;
            }

        } else {

            product.style.display =
                "none";

        }

    });


    return firstMatch;

}


function searchMedicine() {

    const input =
        document.getElementById(
            "medicineSearch"
        );


    if (!input) return;


    filterMedicines(
        input.value
    );

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // CART
        updateCartCount();

        displayCart();


        // =================================================
        // HOME SEARCH BUTTON
        // =================================================

        const homeButton =
            document.getElementById(
                "homeSearchButton"
            );


        if (homeButton) {

            homeButton.addEventListener(
                "click",
                homeSearchMedicine
            );

        }


        // =================================================
        // HOME SEARCH ENTER KEY
        // =================================================

        const homeInput =
            document.getElementById(
                "homeSearch"
            );


        if (homeInput) {

            homeInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        homeSearchMedicine();

                    }

                }
            );

        }


        // =================================================
        // MEDICINES PAGE
        // =================================================

        const medicineInput =
            document.getElementById(
                "medicineSearch"
            );


        if (medicineInput) {


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const searchTerm =
                params.get("search");


            if (searchTerm) {

                medicineInput.value =
                    searchTerm;


                const firstMatch =
                    filterMedicines(
                        searchTerm
                    );


                if (firstMatch) {

                    setTimeout(
                        function () {

                            firstMatch.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        },
                        300
                    );

                }

            }


            // Medicines page typing search

            medicineInput.addEventListener(
                "input",
                function () {

                    filterMedicines(
                        medicineInput.value
                    );

                }
            );


            // Medicines page Enter

            medicineInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        filterMedicines(
                            medicineInput.value
                        );

                    }

                }
            );

        }


        // =================================================
        // YEAR
        // =================================================

        const year =
            document.getElementById(
                "year"
            );


        if (year) {

            year.textContent =
                new Date().getFullYear();

        }

    }
);