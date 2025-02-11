// Encoded WhatsApp number (basic obfuscation)
const encodedNumber = "OTkwODIwNjAzNA=="; // Base64-encoded "9908206034"

// Function to decode and generate WhatsApp URL
function openWhatsApp(productId, productName) {
    const phoneNumber = atob(encodedNumber); // Decode the number
    const message = encodeURIComponent(`Hello, I want to enquire about ${productName} (${productId})`);
    const whatsappURL = `https://wa.me/${phoneNumber}/?text=${message}`;
    
    window.open(whatsappURL, "_blank");
}

// Modify button behavior to use WhatsApp redirection
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
