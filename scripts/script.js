document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap Carousel
  function initializeCarousel() {
    const carouselElement = document.querySelector("#carouselWindow");
    if (!carouselElement) return;

    const carousel = new bootstrap.Carousel(carouselElement, {
      interval: false,
      ride: false,
      touch: true,
    });

    setInitialActiveNavItem(carouselElement);
    setupSwipeFunctionality(carouselElement, carousel);
    setupCarouselNavSync(carouselElement);
  }

  // Set initial active navigation link
  function setInitialActiveNavItem(carouselElement) {
    const activeItem = carouselElement.querySelector(".carousel-item.active");
    if (activeItem) {
      const activeLink = document.querySelector(`.nav-link[href="#${activeItem.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  }

  // Swipe support for the carousel
  function setupSwipeFunctionality(carouselElement, carousel) {
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0, touchEndY = 0;
    const swipeThreshold = 40; // Minimum swipe distance

    carouselElement.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });

    carouselElement.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].clientX;
      touchEndY = event.changedTouches[0].clientY;
      
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        deltaX > 0 ? carousel.next() : carousel.prev();
      }
    });
  }

  // Synchronize navigation links with carousel slides
  function setupCarouselNavSync(carouselElement) {
    const navLinks = document.querySelectorAll(".nav-link");

    carouselElement.addEventListener("slide.bs.carousel", (event) => {
      navLinks.forEach((link) => link.classList.remove("active"));

      const activePageId = event.relatedTarget.id;
      const activeLink = document.querySelector(`.nav-link[href="#${activePageId}"]`);
      if (activeLink) activeLink.classList.add("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        navLinks.forEach((link) => link.classList.remove("active"));
        this.classList.add("active");

        const targetId = this.getAttribute("href").substring(1);
        const targetItem = document.getElementById(targetId);
        if (targetItem) {
          const carousel = bootstrap.Carousel.getInstance(carouselElement);
          const index = [...carouselElement.querySelectorAll(".carousel-item")].indexOf(targetItem);
          carousel.to(index);
        }
      });
    });
  }

  // Form validation setup
  function setupFormValidation() {
    const forms = document.querySelectorAll(".needs-validation");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!validateForm(form)) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      });

      form.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", () => validateField(input));
      });
    });
  }

  // Validate form fields dynamically
  function validateField(input) {
    const isEmail = input.id === "Email";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = isEmail ? emailPattern.test(input.value.trim()) : input.value.trim() !== "";

    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
  }

  // Validate form before submission
  function validateForm(form) {
    let isValid = true;

    form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
      if (field.value.trim() === "") {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    const emailInput = form.querySelector("#Email");
    if (emailInput && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid && form.checkValidity();
  }

  // Handle form submission to Google Apps Script
  function setupFormSubmission() {
    const formSubmit = document.getElementById("submit-form");
    if (!formSubmit) return;

    formSubmit.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateForm(this)) return;

      const formData = new FormData(this);
      const url = "https://script.google.com/macros/s/AKfycbwt9ETKgsBJhTcKq1-fTTbAtcXWYbC4OT7mUZrT-zi9Ezgcn_rGeLTRVZu23Y_-vOriew/exec"; // Update URL if needed

      fetch(url, { method: "POST", body: formData })
        .then((response) => {
          if (response.ok) {
            alert("Form submitted successfully!");
            window.location.reload();
          } else {
            throw new Error("Form submission failed.");
          }
        })
        .catch(() => alert("Something went wrong. Please try again."));
    });
  }
  
// Synchronize navigation links with carousel slides and ensure smooth scrolling
function setupCarouselNavSync(carouselElement) {
  const navLinks = document.querySelectorAll(".nav-link");

  // Listen for slide changes in Bootstrap carousel
  carouselElement.addEventListener("slid.bs.carousel", (event) => {
    // Remove 'active' class from all nav links
    navLinks.forEach((link) => link.classList.remove("active"));

    // Get the new active slide's ID and set the corresponding nav link as active
    const activePageId = event.relatedTarget.id;
    const activeLink = document.querySelector(`.nav-link[href="#${activePageId}"]`);
    if (activeLink) activeLink.classList.add("active");

    // Ensure the next page always starts from the fully top position
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50); // Short delay to ensure page transition completes first
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links, add it to clicked one
      navLinks.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");

      // Get target slide ID from href attribute
      const targetId = this.getAttribute("href").substring(1);
      const targetItem = document.getElementById(targetId);
      if (targetItem) {
        const carousel = bootstrap.Carousel.getInstance(carouselElement);
        const index = [...carouselElement.querySelectorAll(".carousel-item")].indexOf(targetItem);
        carousel.to(index);

        // Ensure next page starts from the fully top position
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
      }
    });
  });
}

  // Initialize all functionalities
  function initializeApp() {
    initializeCarousel();
    setupCarouselNavSync();
    setupFormValidation();
    setupFormSubmission();
  }

  initializeApp();
});