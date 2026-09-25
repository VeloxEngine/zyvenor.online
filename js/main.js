/* ==========================================================================
   TechAI Insights - Client-Side JavaScript Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initActiveNavLink();
  initToast();
  initNewsletterForms();
  initContactForm();
  initBlogFilter();
  initShareButton();
  initScrollAnimations();
});

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    
    // Toggle icon between Hamburger & X
    const icon = toggleBtn.querySelector("svg");
    if (icon) {
      if (isOpen) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
      } else {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
      }
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      const icon = toggleBtn.querySelector("svg");
      if (icon) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
      }
    });
  });
}

/* Highlight Active Navigation Link */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function initToast() {
  // Ensure container element exists
  if (!document.getElementById("toastNotification")) {
    const toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
}

/* Newsletter Subscription */
function initNewsletterForms() {
  const newsletterForms = document.querySelectorAll(".newsletter-form");

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast("Thanks for subscribing! Check your inbox soon.");
        form.reset();
      }
    });
  });
}

/* Contact Form Handling */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const msgInput = document.getElementById("contactMessage");

    if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
      showToast("Please fill out all required fields.");
      return;
    }

    showToast("Message sent! Our research team will get back to you.");
    contactForm.reset();
  });
}

/* Blog Filtering & Search */
function initBlogFilter() {
  const filterTabs = document.querySelectorAll(".filter-tab");
  const searchInput = document.getElementById("blogSearchInput");
  const postCards = document.querySelectorAll(".posts-grid .post-card");

  if (!postCards.length) return;

  let activeCategory = "all";
  let searchQuery = "";

  function applyFilter() {
    postCards.forEach((card) => {
      const cardCategory = (card.dataset.category || "").toLowerCase();
      const cardTitle = (card.querySelector(".post-card-title")?.textContent || "").toLowerCase();
      const cardDesc = (card.querySelector(".post-card-desc")?.textContent || "").toLowerCase();

      const matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = (tab.dataset.filter || "all").toLowerCase();
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilter();
    });
  }
}

/* Article Share Button */
function initShareButton() {
  const shareBtn = document.getElementById("shareArticleBtn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: pageTitle,
          url: pageUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(pageUrl);
        showToast("Link copied to clipboard!");
      } catch (err) {
        showToast("Could not copy link.");
      }
    }
  });
}

/* Subtle Scroll Reveal Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".feature-card, .post-card, .newsletter-banner");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      observer.observe(el);
    });
  }
}
