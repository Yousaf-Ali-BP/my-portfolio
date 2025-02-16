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

    carouselElement.addEventListener("slid.bs.carousel", (event) => {
      navLinks.forEach((link) => link.classList.remove("active"));

      const activePageId = event.relatedTarget.id;
      const activeLink = document.querySelector(`.nav-link[href="#${activePageId}"]`);
      if (activeLink) activeLink.classList.add("active");

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
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

          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 50);
        }
      });
    });
  }
  
  
  function setupFormValidation() {
  const form = document.getElementById("submit-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    if (!validateForm(form)) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
    }
  });

  // Validate dynamically while typing
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => validateField(input));
  });
}

// ✅ Validate a single field
function validateField(input) {
  const value = input.value.trim();
  const isEmail = input.id.toLowerCase() === "email"; 
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let isValid = value.length > 0; // Not empty
  if (isEmail) isValid = emailPattern.test(value); // Email check

  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);

  return isValid;
}

// ✅ Validate the entire form before submission
function validateForm(form) {
  let isValid = true;
  form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
    if (!validateField(field)) isValid = false;
  });
  return isValid;
}

function setupFormSubmission() {
  const form = document.getElementById("submit-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm(this)) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    const formData = new FormData(this);
    const url = "https://script.google.com/macros/s/AKfycbwt9ETKgsBJhTcKq1-fTTbAtcXWYbC4OT7mUZrT-zi9Ezgcn_rGeLTRVZu23Y_-vOriew/exec"; 

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Form submitted successfully!");
          resetForm(form);
        } else {
          throw new Error("Form submission failed.");
        }
      })
      .catch(() => alert("Something went wrong. Please try again."));
  });
}

// ✅ Reset form fields and validation states
function resetForm(form) {
  form.reset();
  form.classList.remove("was-validated");

  form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
    el.classList.remove("is-valid", "is-invalid");
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