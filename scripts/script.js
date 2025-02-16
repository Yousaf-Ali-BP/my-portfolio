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

  // Swipe support for carousel
  function setupSwipeFunctionality(carouselElement, carousel) {
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0, touchEndY = 0;
    const swipeThreshold = 40; 

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

  // ✅ Setup Form Validation with Live Feedback
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

      // Live validation on input fields
      form.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", () => validateField(input));
      });
    });
  }

  function validateField(input) {
    const isEmail = input.id === "Email";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = isEmail ? emailPattern.test(input.value.trim()) : input.value.trim() !== "";

    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
  }

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
    if (emailInput) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        emailInput.classList.remove("is-invalid");
      }
    }

    if (!isValid) {
      form.reportValidity();
    }

    return isValid;
  }

  // ✅ Handle Form Submission
  function setupFormSubmission() {
    const formSubmit = document.getElementById("submit-form");
    if (!formSubmit) return;

    formSubmit.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateForm(this)) return;

      const formData = new FormData(this);
      const url = "https://script.google.com/macros/s/AKfycbwt9ETKgsBJhTcKq1-fTTbAtcXWYbC4OT7mUZrT-zi9Ezgcn_rGeLTRVZu23Y_-vOriew/exec";

      fetch(url, { method: "POST", body: formData })
        .then((response) => {
          if (response.ok) {
            alert("Form submitted successfully!");
            resetForm(this);
          } else {
            throw new Error("Form submission failed.");
          }
        })
        .catch(() => alert("Something went wrong. Please try again."));
    });
  }

  function resetForm(form) {
    form.reset();
    form.classList.remove("was-validated");
    form.querySelectorAll(".is-valid, .is-invalid").forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  }

  function initializeApp() {
    initializeCarousel();
    setupFormValidation();
    setupFormSubmission();
  }

  initializeApp();
});