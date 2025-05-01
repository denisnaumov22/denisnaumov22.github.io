// Helper function to format price
function formatPrice(price) {
    return '$' + parseInt(price).toLocaleString('en-US');
}

// Helper function to safely update element text content
function safelyUpdateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

// Function to update totals for a specific package
function updatePackageTotal(packageId) {
    let total = 0;
    
    // Get the active content
    const activeContent = document.getElementById(packageId);
    if (!activeContent) return;
    
    // Update guests total
    const guestsSlider = activeContent.querySelector('.slider');
    const guestsValue = activeContent.querySelector(`.slider-value[data-value="${guestsSlider.value}"]`);
    if (guestsValue) {
        const guestsPrice = parseInt(guestsValue.getAttribute('data-price'));
        const guestsCount = guestsValue.textContent;
        const guestsTotalElement = document.getElementById(`guests-total-${packageId}`);
        const guestsLabelElement = document.querySelector(`#${packageId} .total-item.guests .total-label`);
        
        if (guestsTotalElement) guestsTotalElement.textContent = formatPrice(guestsPrice);
        if (guestsLabelElement) guestsLabelElement.textContent = `Guests (${guestsCount}):`;
        total += guestsPrice;
    }
    
    // Update venue total
    const venueRadio = activeContent.querySelector(`input[name="venue-${packageId}"]:checked`);
    if (venueRadio) {
        const venuePrice = parseInt(venueRadio.getAttribute('data-price'));
        const venueName = venueRadio.nextElementSibling.querySelector('span:first-child').textContent;
        const venueTotalElement = document.getElementById(`venue-total-${packageId}`);
        const venueLabelElement = document.querySelector(`#${packageId} .total-item.venue .total-label`);
        
        if (venueTotalElement) venueTotalElement.textContent = formatPrice(venuePrice);
        if (venueLabelElement) venueLabelElement.textContent = `Venue (${venueName}):`;
        total += venuePrice;
    }
    
    // Update photo total
    const photoRadio = activeContent.querySelector(`input[name="photo-${packageId}"]:checked`);
    if (photoRadio) {
        const photoPrice = parseInt(photoRadio.getAttribute('data-price'));
        const photoName = photoRadio.nextElementSibling.querySelector('span:first-child').textContent;
        const photoTotalElement = document.getElementById(`photo-total-${packageId}`);
        const photoLabelElement = document.querySelector(`#${packageId} .total-item.photo .total-label`);
        
        if (photoTotalElement) photoTotalElement.textContent = formatPrice(photoPrice);
        if (photoLabelElement) photoLabelElement.textContent = `Photography (${photoName}):`;
        total += photoPrice;
    }
    
    // Update additional services total
    let servicesTotal = 0;
    const checkedServices = activeContent.querySelectorAll('.checkbox-option input:checked');
    const servicesCount = checkedServices.length;
    checkedServices.forEach(checkbox => {
        servicesTotal += parseInt(checkbox.getAttribute('data-price'));
    });
    
    const servicesTotalElement = document.getElementById(`services-total-${packageId}`);
    const servicesLabelElement = document.querySelector(`#${packageId} .total-item.dop-services .total-label`);
    
    if (servicesTotalElement) servicesTotalElement.textContent = formatPrice(servicesTotal);
    if (servicesLabelElement) servicesLabelElement.textContent = `Additional Services (${servicesCount}):`;
    total += servicesTotal;
    
    // Update grand total
    const grandTotalElement = document.getElementById(`${packageId}-total`);
    if (grandTotalElement) grandTotalElement.textContent = formatPrice(total);
}

// Function to update all package totals
function updateAllTotals() {
    const packages = ['elopment', 'micro', 'minimony', 'all-inclusive'];
    packages.forEach(packageId => {
        updatePackageTotal(packageId);
    });
}

// Initialize all totals when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize totals
    updateAllTotals();
    
    // Add event listeners for all inputs
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const packageId = this.id.split('-')[1];
            
            // Update active class for slider values
            const sliderValues = this.nextElementSibling.querySelectorAll('.slider-value');
            sliderValues.forEach(value => value.classList.remove('active'));
            const activeValue = this.nextElementSibling.querySelector(`.slider-value[data-value="${this.value}"]`);
            if (activeValue) activeValue.classList.add('active');
            
            updatePackageTotal(packageId);
        });
    });
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const packageId = this.name.split('-')[1];
            updatePackageTotal(packageId);
        });
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const packageId = this.id.split('-')[1];
            updatePackageTotal(packageId);
        });
    });
    
    // Add event listeners for tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add event listeners for place order buttons
    document.querySelectorAll('.place-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const activeTab = document.querySelector('.tab.active');
            const activePackage = activeTab.getAttribute('data-tab');
            const activeContent = document.getElementById(activePackage);
            const tabs = document.querySelector('.tabs');

            // Hide all tabs
            tabs.style.display = 'none';
            
            // Update summary
            document.getElementById('summary-package').textContent = activeTab.textContent;
            
            // Update guests
            const guestsValue = activeContent.querySelector(`.slider-value[data-value="${activeContent.querySelector('.slider').value}"]`);
            document.getElementById('summary-guests').textContent = guestsValue.textContent;
            
            // Update venue
            const venueRadio = activeContent.querySelector(`input[name="venue-${activePackage}"]:checked`);
            const venueName = venueRadio.nextElementSibling.querySelector('span:first-child').textContent;
            document.getElementById('summary-venue').textContent = venueName;
            
            // Update photo
            const photoRadio = activeContent.querySelector(`input[name="photo-${activePackage}"]:checked`);
            const photoName = photoRadio.nextElementSibling.querySelector('span:first-child').textContent;
            document.getElementById('summary-photo').textContent = photoName;
            
            // Update additional services
            const checkedServices = activeContent.querySelectorAll('.checkbox-option input:checked');
            const servicesText = checkedServices.length > 0 
                ? Array.from(checkedServices).map(checkbox => {
                    const label = checkbox.nextElementSibling.querySelector('span:first-child').textContent;
                    return label;
                }).join(', ')
                : 'None';
            document.getElementById('summary-services').textContent = servicesText;
            
            // Update total
            document.getElementById('summary-total').textContent = document.getElementById(`${activePackage}-total`).textContent;
            
            // Hide all tab contents and show contact form
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector('.contact-form').style.display = 'block';
            document.querySelector('.contact-form').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Add event listener for back button
    document.querySelector('.back-btn').addEventListener('click', function() {
        // Hide contact form
        document.querySelector('.contact-form').style.display = 'none';

        const tabs = document.querySelector('.tabs');

        // Show all tabs
        tabs.style.display = 'flex';
        
        // Show tabs and active content
        const activePackage = document.getElementById('summary-package').textContent.toLowerCase();
        document.querySelector(`.tab[data-tab="${activePackage}"]`).classList.add('active');
        document.getElementById(activePackage).classList.add('active');
        
        // Scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Add event listener for form submission
    document.querySelector('.submit-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        
        if (!name || !phone || !email || !date) {
            alert('Please fill in all required fields');
            return;
        }
        
        const packageName = document.getElementById('summary-package').textContent;
        const total = document.getElementById('summary-total').textContent;
        
        alert(`Thank you for your request! Our manager will contact you shortly.\nSelected package: ${packageName}\nTotal: ${total}`);
        window.location.reload();
    });
});