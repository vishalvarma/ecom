const PRODUCTS_PER_PAGE = 25;
let products = [];
let currentPage = 1;

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
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const city = document.getElementById("city").value.trim();
    const productId = document.getElementById("product-id").value.trim();

    if (!name || !mobile || !city || !productId) {
        alert("Please fill in all fields.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("city", city);
    formData.append("productId", productId);

    fetch("https://script.google.com/macros/s/AKfycbywYIjiqjSV86gkcjznqTG2ivTQuk-X2cT1QLLM5kq3TiySKmM2mHmTLXKS1aZedos_6w/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Inquiry submitted successfully!");
            closeForm();
        } else {
            alert("Submission failed: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error submitting inquiry. Please try again.");
    });
}

// Load Products
fetchProducts();
