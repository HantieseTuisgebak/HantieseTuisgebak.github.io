// Mobile hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// Close menu when a link is clicked (on mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Simple greeting in console
console.log('🍪 Hantiese Home Baker — fresh treats, made with love.');

// ========================================
// CONTACT FORM - SEND VIA WHATSAPP
// ========================================
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent any default form submission

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate required fields
        if (!name || !email || !message) {
            formFeedback.style.color = '#b02a37';
            formFeedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields (Name, Email, Message).';
            return;
        }

        // Build the WhatsApp message
        let whatsappMessage = 'Hi Hantie,\n\n';
        whatsappMessage += 'I have a question or inquiry:\n\n';
        whatsappMessage += `Name: ${name}\n`;
        whatsappMessage += `Email: ${email}\n`;
        if (subject) {
            whatsappMessage += `Subject: ${subject}\n`;
        }
        whatsappMessage += `\nMessage:\n${message}\n\n`;
        whatsappMessage += 'I look forward to hearing from you!';

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const phoneNumber = '27611707181'; // WhatsApp number without the +
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        // Show success feedback
        formFeedback.style.color = '#2b7d4b';
        formFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Opening WhatsApp... Please send the message from there.';

        // Optionally clear the form
        // document.getElementById('name').value = '';
        // document.getElementById('email').value = '';
        // document.getElementById('subject').value = '';
        // document.getElementById('message').value = '';
    });
}

// ========================================
// QUOTING SYSTEM (REAL-TIME)
// ========================================

// State: store all items added to the quote
let quoteItems = [];

// DOM references
const quoteSummary = document.getElementById('quoteSummary');
const quoteItemsList = document.getElementById('quoteItems');
const quoteCount = document.getElementById('quoteCount');
const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');
const clearQuoteBtn = document.getElementById('clearQuoteBtn');

// Modal DOM references
const modalOverlay = document.getElementById('confirmModal');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

// Helper: update the quote summary display
function updateQuoteDisplay() {
    const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
    quoteCount.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');

    if (quoteItems.length === 0) {
        quoteItemsList.innerHTML = '<li class="empty-quote-msg">No items added yet. Add some treats!</li>';
        const personalDetails = document.getElementById('personalDetails');
        if (personalDetails) personalDetails.style.display = 'none';
        if (quoteSummary) quoteSummary.classList.add('hidden');
        return;
    }

    // Show the quote summary and personal details
    if (quoteSummary) quoteSummary.classList.remove('hidden');
    const personalDetails = document.getElementById('personalDetails');
    if (personalDetails) personalDetails.style.display = 'block';

    // Build the list
    let html = '';
    quoteItems.forEach((item) => {
        html += `
            <li>
                <span class="item-details">
                    <span class="item-qty">${item.quantity}×</span>
                    ${item.name}
                    <span class="item-unit">(${item.unit})</span>
                </span>
            </li>
        `;
    });
    quoteItemsList.innerHTML = html;
}

// Helper: update or add an item to the quote (real-time)
function updateQuoteItem(productName, price, unit, newQuantity) {
    if (newQuantity <= 0) {
        // Remove the item if quantity is 0 or less
        const index = quoteItems.findIndex(item => item.name === productName);
        if (index !== -1) {
            quoteItems.splice(index, 1);
        }
    } else {
        // Add or update
        const existingIndex = quoteItems.findIndex(item => item.name === productName);
        if (existingIndex !== -1) {
            // Update existing
            quoteItems[existingIndex].quantity = newQuantity;
        } else {
            // Add new
            quoteItems.push({
                name: productName,
                price: price,
                unit: unit,
                quantity: newQuantity
            });
        }
    }
    updateQuoteDisplay();
}

// Helper: clear all items
function clearQuote() {
    if (quoteItems.length === 0) return;
    quoteItems = [];
    updateQuoteDisplay();
    
    // Reset all quantity displays to 0
    document.querySelectorAll('.qty-display').forEach(display => {
        display.textContent = '0';
    });
    
    // Clear personal details fields
    const personalFields = ['quoteName', 'quoteSurname', 'quotePhone', 'quoteEmail', 'quoteArea', 'quoteNotes'];
    personalFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = '';
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    });
}

// Helper: get a formatted quote message for WhatsApp
function getWhatsAppMessage() {
    if (quoteItems.length === 0) {
        return 'Hi Hantie, I would like to request a quote.';
    }

    const name = document.getElementById('quoteName')?.value.trim() || '';
    const surname = document.getElementById('quoteSurname')?.value.trim() || '';
    const phone = document.getElementById('quotePhone')?.value.trim() || '';
    const email = document.getElementById('quoteEmail')?.value.trim() || '';
    const area = document.getElementById('quoteArea')?.value.trim() || '';
    const notes = document.getElementById('quoteNotes')?.value.trim() || '';

    let message = 'Hi Hantie,\n\n';
    message += 'I would like to request a quote for the following items:\n\n';
    
    quoteItems.forEach(item => {
        message += `• ${item.quantity} × ${item.name}\n`;
    });
    
    message += '\n--- My Details ---\n';
    if (name) message += `Name: ${name}\n`;
    if (surname) message += `Surname: ${surname}\n`;
    if (phone) message += `Phone: ${phone}\n`;
    if (email) message += `Email: ${email}\n`;
    if (area) message += `Area: ${area}\n`;
    
    if (notes) {
        message += `\n--- Additional Notes ---\n${notes}\n`;
    }
    
    message += '\nPlease let me know the pricing and availability.\n';
    message += 'I look forward to hearing from you!';
    
    return message;
}

// ========================================
// CUSTOM CONFIRM MODAL CONTROLS
// ========================================

function showConfirmModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideConfirmModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', function() {
        hideConfirmModal();
    });
}

if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', function() {
        clearQuote();
        hideConfirmModal();
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            hideConfirmModal();
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        hideConfirmModal();
    }
});

// ========================================
// EVENT LISTENERS
// ========================================

// 1. Quantity controls - Real-time update! (clean version)
document.querySelectorAll('.product-card').forEach(card => {
    const minusBtn = card.querySelector('.qty-minus');
    const plusBtn = card.querySelector('.qty-plus');
    const display = card.querySelector('.qty-display');
    const productName = card.dataset.product;
    const price = parseFloat(card.dataset.price) || 0;
    const unit = card.dataset.unit;

    // Helper: handle quantity change
    function handleQuantityChange(increment) {
        let current = parseInt(display.textContent) || 0;
        current += increment;
        if (current < 0) current = 0;
        display.textContent = current;
        updateQuoteItem(productName, price, unit, current);
    }

    // Use a flag to prevent duplicate listeners
    if (card.dataset.quoteListenersAttached) return;
    card.dataset.quoteListenersAttached = 'true';

    if (minusBtn) {
        minusBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleQuantityChange(-1);
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleQuantityChange(1);
        });
    }
});

// 2. WhatsApp Quote button
if (whatsappQuoteBtn) {
    whatsappQuoteBtn.addEventListener('click', function() {
        if (quoteItems.length === 0) {
            this.textContent = '⚠️ Add items first!';
            this.style.background = '#b02a37';
            setTimeout(() => {
                this.textContent = 'Request Quote via WhatsApp';
                this.style.background = '#25D366';
            }, 2000);
            return;
        }

        const name = document.getElementById('quoteName')?.value.trim();
        const surname = document.getElementById('quoteSurname')?.value.trim();
        const phone = document.getElementById('quotePhone')?.value.trim();
        const area = document.getElementById('quoteArea')?.value.trim();

        if (!name || !surname || !phone || !area) {
            alert('Please fill in all required personal details (Name, Surname, Phone, Area) before requesting a quote.');
            document.querySelectorAll('#quoteName, #quoteSurname, #quotePhone, #quoteArea').forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#b02a37';
                    field.style.boxShadow = '0 0 0 3px rgba(176, 42, 55, 0.15)';
                    setTimeout(() => {
                        field.style.borderColor = '';
                        field.style.boxShadow = '';
                    }, 3000);
                }
            });
            return;
        }

        const message = getWhatsAppMessage();
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = '27611707181';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}

// 3. Clear Quote button - using custom modal
if (clearQuoteBtn) {
    clearQuoteBtn.addEventListener('click', function() {
        if (quoteItems.length === 0) return;
        showConfirmModal();
    });
}

// 4. Keyboard shortcut: ESC to clear quote (if modal not open)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && quoteItems.length > 0 && modalOverlay && !modalOverlay.classList.contains('active')) {
        showConfirmModal();
    }
});

// ========================================
// GALLERY LIGHTBOX (with close button & frame)
// ========================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (!img) return;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create frame container (like a polaroid frame)
        const frame = document.createElement('div');
        frame.style.cssText = `
            background: #fffcf7;
            border-radius: 30px;
            padding: 1.2rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            position: relative;
            max-width: 90%;
            max-height: 90%;
            border: 1px solid #f3ede6;
        `;
        
        // Create the large image
        const largeImg = document.createElement('img');
        largeImg.src = img.src;
        largeImg.alt = img.alt;
        largeImg.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            border-radius: 18px;
            display: block;
            object-fit: contain;
        `;
        
        // Create Close button (X)
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: -14px;
            right: -14px;
            width: 44px;
            height: 44px;
            background: #c77d4a;
            color: #fff;
            border: none;
            border-radius: 50%;
            font-size: 1.6rem;
            font-weight: 300;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(199, 125, 74, 0.4);
            transition: background 0.2s, transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#a86434';
            closeBtn.style.transform = 'scale(1.1)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = '#c77d4a';
            closeBtn.style.transform = 'scale(1)';
        };
        
        // Assemble
        frame.appendChild(largeImg);
        frame.appendChild(closeBtn);
        overlay.appendChild(frame);
        document.body.appendChild(overlay);
        
        // Close functions
        function closeLightbox() {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
        
        // Close on X button click
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeLightbox();
        });
        
        // Close on overlay click (background)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeLightbox();
            }
        });
        
        // Close with ESC key
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };
        document.addEventListener('keydown', escHandler);
    });
});

// Initialize: hide the quote summary if empty
updateQuoteDisplay();
