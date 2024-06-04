window.addEventListener('load', function() {
    let statusElement = document.getElementById('status');
    let preloaderElement = document.getElementById('preloader');
    let bodyElement = document.body;

    console.log('statusElement:', statusElement);
    console.log('preloaderElement:', preloaderElement);

    if (!statusElement || !preloaderElement) {
        console.error('Error: Elements not found.');
        return;
    }

    // Hide the preloader after a delay
    setTimeout(function() {
        if (preloaderElement) {
            preloaderElement.style.display = 'none';

            // Set the body content to be visible after another delay
            setTimeout(function() {
                bodyElement.style.visibility = 'visible';
            }, 1000); // Adjust the delay as needed
        }
    }, 1000); // Adjust the delay as needed

    // Optionally, you can fade out the status element separately
    // Fade out the status element after a certain delay
    setTimeout(function() {
        if (statusElement) {
            statusElement.style.display = 'none';
        }
    }, 2000); // Adjust the delay as needed
});


// function scrollToSection(sectionId) {
//     var element = document.getElementById(sectionId);
//     element.scrollIntoView({ behavior: "smooth" });
// }

// Scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);

    if (!element) {
        console.error(`Error: Element with ID '${sectionId}' not found.`);
        return;
    }

    const offsetTop = element.getBoundingClientRect().top + window.scrollY;
    const duration = 800; // Set the duration of the scroll animation (in milliseconds)

    const startTime = performance.now();

    function scrollStep(timestamp) {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        window.scrollTo(0, window.scrollY + progress * (offsetTop - window.scrollY));

        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}

// scroll to top botton
// Show/hide the "Scroll to Top" button based on scroll position
window.addEventListener('scroll', function() {
    var scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to the top when the button is clicked
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


    