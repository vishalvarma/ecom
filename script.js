const PRODUCTS_PER_PAGE = 25;
let products = [];
let currentPage = 1;

// Encoded WhatsApp number (basic obfuscation)
const encodedNumber = "OTkwODIwNjAzNA=="; // Base64-encoded

// Function to decode and generate WhatsApp URL
function openWhatsApp(productId, productName) {
    const phoneNumber = atob(encodedNumber); // Decode the number
    const message = encodeURIComponent(`Hello, I want to enquire about ${productName} (${productId})`);
    const whatsappURL = `https://wa.me/${phoneNumber}/?text=${message}`;
    
    window.open(whatsappURL, "_blank");
}

// Fetch Products from Google Sheets
async function fetchProducts() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwI6KEE1VrD14jqBHW4GQ9z0YYSLtDrfHfN8eqq-O0bimKNVT4PmrVnBtvZ_Ca3aqBJkw/exec");
        if (!response.ok) throw new Error("Failed to fetch products");
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again.");
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
                <button class="enquire-btn" onclick="openWhatsApp('${product.id}', '${product.name}')">Enquire</button>
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
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => goToPage(i);
        if (i === currentPage) button.classList.add("active"); // Highlight current page
        paginationContainer.appendChild(button);
    }
}

// Change Page
function goToPage(page) {
    currentPage = page;
    renderProducts();
}

// Load Products
fetchProducts();
