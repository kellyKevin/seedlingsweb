import { db } from "./firebase-config.js";
import { doc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
async function processPayment(method) {
    let totalAmount = parseFloat(document.getElementById('cart-total').textContent.replace('Total: ksh', ''));

    if (method === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        if (!cardNumber || !cardExpiry || !cardCvv) {
            alert('Please enter all card details.');
            return;
        }
    } else if (method === 'mobile') {
        const mobileNumber = document.getElementById('mobile-number').value;
        if (!mobileNumber) {
            alert('Please enter your mobile number.');
            return;
        }
    } else if (method === 'paypal') {
        const paypalEmail = document.getElementById('paypal-email').value;
        if (!paypalEmail) {
            alert('Please enter your PayPal email.');
            return;
        }
    }

    alert(`Processing ${method} payment for ksh${totalAmount.toFixed(2)}...`);

    // Synchronize inventory with backend state changes
    try {
        await updateInventoryAfterPayment();
        alert('Payment successful and inventory updated!');

        // Clear cart after successful payment
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();

        // Optionally redirect to a success page
        // window.location.href = 'success.html';
    } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Payment failed during inventory synchronization: ' + error.message);
    }
}

async function updateInventoryAfterPayment() {
    if (cart.length === 0) return;

    try {
        await runTransaction(db, async (transaction) => {
            const updates = [];

            // First, read all necessary documents
            for (const item of cart) {
                if (!item.collection || !item.id) {
                    console.warn(`Item ${item.name} is missing collection or ID info.`);
                    continue;
                }
                const productRef = doc(db, item.collection.trim(), item.id);
                const productDoc = await transaction.get(productRef);

                if (!productDoc.exists()) {
                    throw new Error(`Product ${item.name} does not exist!`);
                }

                const currentStock = productDoc.data().stock || 0;
                if (currentStock < item.quantity) {
                    throw new Error(`Not enough stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`);
                }

                updates.push({
                    ref: productRef,
                    newStock: currentStock - item.quantity,
                    name: item.name
                });
            }

            // Then, perform all updates
            for (const update of updates) {
                transaction.update(update.ref, {
                    stock: update.newStock
                });
                console.log(`Inventory update prepared for ${update.name}`);
            }
        });
        console.log('All inventory updates committed successfully.');
    } catch (e) {
        console.error('Transaction failed: ', e);
        throw e;
    }
}