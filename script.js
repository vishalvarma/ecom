const PRODUCTS_PER_PAGE = 25;
let products = [];
let currentPage = 1;

// Fetch Products from Google Sheets
async function fetchProducts() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwI6KEE1VrD14jqBHW4GQ9z0YYSLtDrfHfN8eqq-O0bimKNVT4PmrVnBtvZ_Ca3aqBJkw/exec");
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Render Products on Current Page
function renderProducts() {
    const container = document.getElementById("product-container");
    container.innerHTML = "";
    
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const productHTML = `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <button class="enquire-btn" onclick="openForm('${product.id}')">Enquire</button>
            </div>
        `;
        container.innerHTML += productHTML;
    });

    renderPagination();
}

// Render Pagination Controls
function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `<button onclick="goToPage(${i})">${i}</button>`;
    }
}

// Change Page
function goToPage(page) {
    currentPage = page;
    renderProducts();
}

// Open Inquiry Form
function openForm(productId) {
    document.getElementById("product-id").value = productId;
    document.getElementById("inquiry-form-container").style.display = "block";
}

// Close Inquiry Form
function closeForm() {
    document.getElementById("inquiry-form-container").style.display = "none";
}

// Submit Form Data to Google Sheet
function submitForm() {
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const city = document.getElementById("city").value;
    const productId = document.getElementById("product-id").value;

    if (!name || !mobile || !city) {
        alert("Please fill all fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("city", city);
    formData.append("productId", productId);

    fetch("https://script.google.com/macros/s/AKfycbwbMAiPVggUQgSyxGotpdyVpTQ1JiKk8sl8qWaeGYVoKBgrg0ICvaBK9YsVIN_kKjww/exec", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(() => {
        alert("Inquiry submitted successfully!");
        closeForm();
    })
    .catch(() => alert("Error submitting form."));
}

// Load Products
fetchProducts();
