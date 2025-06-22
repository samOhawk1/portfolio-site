// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior

        // Get the target section's ID from the href attribute
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Scroll to the target section smoothly
        gsap.to(window, {
            duration: 0.4, // Duration in seconds
            scrollTo: {
                y: targetSection, // Scroll to the section
                offsetY: 70, // Offset for the fixed header height
            },
            ease: "power2.inOut", // Easing for smoothness
        });
    });
});


// Carousel functionality
const carousel = document.querySelector(".carousel");
const carouselItems = document.querySelectorAll(".carousel-item");
const itemWidth = carouselItems[0].offsetWidth; // Get the width of a single item

// Clone first and last items for truly infinite looping
// Append a clone of the first item to the end
const firstItemClone = carouselItems[0].cloneNode(true);
carousel.appendChild(firstItemClone);

// Prepend a clone of the last item to the beginning
const lastItemClone = carouselItems[carouselItems.length - 1].cloneNode(true);
carousel.insertBefore(lastItemClone, carousel.firstChild);

let currentIndex = 1; // Start at the first actual item (after the cloned last one)
carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`; // Initial position

function slideCarousel() {
    currentIndex++;
    carousel.style.transition = "transform 1s ease-in-out";
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

// Listen for transition end to reset position for infinite loop
carousel.addEventListener("transitionend", () => {
    if (currentIndex === carousel.children.length - 1) { // If it's the cloned first item
        carousel.style.transition = "none"; // Remove transition for instant jump
        currentIndex = 1; // Reset to the actual first item
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    } else if (currentIndex === 0) { // If it's the cloned last item (shouldn't happen with auto-slide but good for manual controls)
        carousel.style.transition = "none";
        currentIndex = carousel.children.length - 2; // Reset to the actual last item
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
});

// Auto-slide every 5 seconds
setInterval(slideCarousel, 3000);

// In script.js
const contactForm = document.querySelector('.contact-form');
const submitButton = document.getElementById('submit-mail');

contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const response = await fetch(event.target.action, {
        method: 'POST',
        body: new FormData(event.target), // Formspree uses FormData
        headers: {
            'Accept': 'application/json' // Tell Formspree you want JSON response
        }
    });

    if (response.ok) {
        alert('Message sent successfully!');
        contactForm.reset();
    } else {
        const data = await response.json();
        if (data.errors) {
            alert('Error: ' + data.errors.map(err => err.message).join(', '));
        } else {
            alert('Failed to send message. Please try again.');
        }
    }

    submitButton.textContent = 'Submit';
    submitButton.disabled = false;
});