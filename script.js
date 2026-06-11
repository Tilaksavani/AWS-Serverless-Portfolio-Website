/* =============================================
   SURYA PORTFOLIO — script.js
   AWS API Gateway Contact Form Integration
   ============================================= */

// ─────────────────────────────────────────────
// ⚠️  REPLACE THIS WITH YOUR API GATEWAY URL
//     After deploying Lambda + API Gateway,
//     paste your endpoint URL here.
//     Example:
//     https://abc123xyz.execute-api.ap-south-1.amazonaws.com/prod/contact
// ─────────────────────────────────────────────
const API_ENDPOINT = "";

// ── NAV SCROLL EFFECT ──────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ── ACTIVE NAV LINK ON SCROLL ──────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observerOptions = {
  rootMargin: "-40% 0px -55% 0px",
};
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.style.color = "";
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.style.color = "var(--text)";
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

// ── SCROLL REVEAL ──────────────────────────────
const revealElements = document.querySelectorAll(
  ".skill-card, .project-item, .about-card, .stat",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.05}s`;
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  revealObserver.observe(el);
});

// Trigger animation when revealed
const style = document.createElement("style");
style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ── CONTACT FORM SUBMISSION ────────────────────
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

const DEMO_MODE = true;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) return;

  // UI: loading state
  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-text").textContent = "Sending...";
  formStatus.className = "form-status";
  formStatus.style.display = "none";

  // Check if API endpoint is configured
  if (API_ENDPOINT === "YOUR_API_GATEWAY_URL_HERE") {
    // Demo mode — show success without real API call
    await simulateDelay(1200);
    showSuccess();
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      showSuccess();
    } else {
      const errorData = await response.json().catch(() => ({}));
      showError(errorData.message || "Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error("Form submission error:", err);
    showError("Network error. Please check your connection and try again.");
  }
});

function showSuccess() {
  formStatus.textContent =
    "✓ Message sent! Stored in DynamoDB. I'll get back to you soon.";
  formStatus.className = "form-status success";
  form.reset();
  resetButton();
}

function showError(msg) {
  formStatus.textContent = `✗ ${msg}`;
  formStatus.className = "form-status error";
  resetButton();
}

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.querySelector(".btn-text").textContent = "Send Message";
}

function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── SMOOTH SCROLL FOR NAV LINKS ────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ── CURSOR SUBTLE EFFECT ───────────────────────
document
  .querySelectorAll(".skill-card, .project-item, .btn-primary, .btn-submit")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.style.cursor = "crosshair";
    });
    el.addEventListener("mouseleave", () => {
      document.body.style.cursor = "";
    });
  });

console.log(
  "%c☁ SURYA PORTFOLIO\n%cBuilt on AWS — S3 · CloudFront · API Gateway · Lambda · DynamoDB",
  "color: #e8ff47; font-size: 18px; font-weight: bold;",
  "color: #888880; font-size: 12px;",
);
