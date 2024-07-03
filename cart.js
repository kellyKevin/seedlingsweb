// Initialize cart array
let cart = [];

// Load cart items on page load
window.onload = function () {
    // Retrieve cart data from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Display cart items
    displayCart();
};

// Function to display cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    // Clear previous cart items
    cartContainer.innerHTML = '';

    // Display each item in the cart
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // HTML for displaying cart item
        const cartItemHTML = `
             <div class="cart-item">
                 <img src="${item.image}" alt="${item.name}">
                 <div class="cart-item-info">
                     <h4>${item.name}</h4>
                     <p>Price: ksh${item.price.toFixed(2)}</p>
                 </div>
                 <div class="cart-item-quantity">
                 <input type="number" min="1" value="${item.quantity}" readonly>
                 </div>

             </div>
         `;
        cartContainer.innerHTML += cartItemHTML;
    });

    // Display total in cart
    cartTotal.textContent = `Total: ksh${total.toFixed(2)}`;

    // Update localStorage with updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update quantity of items in cart
function updateQuantity(itemId, newQuantity) {
    // Find item index in cart array
    const index = cart.findIndex(i => i.id === itemId);
    if (index !== -1) {
        // Update quantity
        cart[index].quantity = parseInt(newQuantity);
        // Update cart display
        displayCart();
    }
}

// Function to handle payment method selection
document.querySelectorAll('input[name="payment-method"]').forEach(input => {
    input.addEventListener('change', function () {
        document.querySelectorAll('.payment-details').forEach(detail => {
            detail.classList.remove('active');
        });

        if (this.value === 'card') {
            document.getElementById('card-details').classList.add('active');
        } else if (this.value === 'mobile') {
            document.getElementById('mobile-details').classList.add('active');
        } else if (this.value === 'paypal') {
            document.getElementById('paypal-details').classList.add('active');
        }
    });
});

// Function to proceed to payment
function proceedToPayment() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

    if (!selectedMethod) {
        alert('Please select a payment method.');
        return;
    }

    processPayment(selectedMethod.value);
}

// Function to process payment based on the selected method
function processPayment(method) {
    let totalAmount = parseFloat(document.getElementById('cart-total').textContent.replace('Total: ksh', ''));

    if (method === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        if (!cardNumber || !cardExpiry || !cardCvv) {
            alert('Please enter all card details.');
            return;
        }

        alert(`Processing card payment for ksh${totalAmount.toFixed(2)}...`);

        // Integrate real card payment processing logic here, e.g., using Stripe
    } else if (method === 'mobile') {
        const mobileNumber = document.getElementById('mobile-number').value;

        if (!mobileNumber) {
            alert('Please enter your mobile number.');
            return;
        }

        alert(`Processing mobile payment for ksh${totalAmount.toFixed(2)}...`);

        // Integrate real mobile payment processing logic here, e.g., using M-Pesa
    } else if (method === 'paypal') {
        const paypalEmail = document.getElementById('paypal-email').value;

        if (!paypalEmail) {
            alert('Please enter your PayPal email.');
            return;
        }

        alert(`Processing PayPal payment for ksh${totalAmount.toFixed(2)}...`);

        // Integrate real PayPal payment processing logic here
    }
}