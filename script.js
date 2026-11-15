/* Twin Cities Animal Rescue - interactivity, validation, storage */

// ---- Data (objects + arrays) ----
const pets = [
  {
    id: "luna",
    name: "Luna",
    type: "Cat",
    description: "Friendly tabby looking for a calm home."
  },
  {
    id: "pip",
    name: "Pip",
    type: "Guinea Pig",
    description: "Curious and gentle small companion."
  },
  {
    id: "scout",
    name: "Scout",
    type: "Dog",
    description: "Loyal companion who enjoys walks and people."
  }
];

const interestOptions = [
  { value: "volunteer", label: "Volunteering" },
  { value: "foster", label: "Fostering" },
  { value: "adoption", label: "Adoption information" }
];

// ---- Favorites (localStorage) ----
function getFavorites() {
  const raw = localStorage.getItem("tcarFavorites");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("tcarFavorites", JSON.stringify(list));
}

function toggleFavorite(petId) {
  let favs = getFavorites();
  if (favs.includes(petId)) {
    favs = favs.filter(function (id) { return id !== petId; });
  } else {
    favs.push(petId);
  }
  saveFavorites(favs);
  updateFavoritesDisplay();
  updateFavoriteButtons();
}

function updateFavoritesDisplay() {
  const box = document.getElementById("favorites-list");
  if (!box) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    box.innerHTML = "<p>You have not saved any favorites yet. Click “Save as favorite” on a pet below.</p>";
    return;
  }

  let html = "<ul>";
  favs.forEach(function (id) {
    const pet = pets.find(function (p) { return p.id === id; });
    if (pet) {
      html += "<li><strong>" + pet.name + "</strong> (" + pet.type + ") – " + pet.description + "</li>";
    }
  });
  html += "</ul>";
  box.innerHTML = html;
}

function updateFavoriteButtons() {
  const favs = getFavorites();
  document.querySelectorAll("[data-pet-id]").forEach(function (btn) {
    const id = btn.getAttribute("data-pet-id");
    if (favs.includes(id)) {
      btn.textContent = "Remove favorite";
    } else {
      btn.textContent = "Save as favorite";
    }
  });
}

function setupFavoriteButtons() {
  document.querySelectorAll("[data-pet-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-pet-id");
      toggleFavorite(id);
    });
  });
}

// ---- Interest preference (localStorage) ----
function saveInterestPreference(value) {
  localStorage.setItem("tcarInterest", value);
}

function loadInterestPreference() {
  return localStorage.getItem("tcarInterest") || "";
}

function setupInterestRemember() {
  const select = document.getElementById("interest");
  if (!select) return;

  const saved = loadInterestPreference();
  if (saved) {
    select.value = saved;
  }

  select.addEventListener("change", function () {
    if (select.value) {
      saveInterestPreference(select.value);
    }
  });
}

// ---- Form validation ----
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + "-error");
  if (field) field.classList.add("invalid");
  if (err) {
    err.textContent = message;
    err.classList.add("visible");
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(fieldId + "-error");
  if (field) field.classList.remove("invalid");
  if (err) {
    err.textContent = "";
    err.classList.remove("visible");
  }
}

function isValidEmail(email) {
  // simple pattern check
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validateContactForm(event) {
  event.preventDefault();

  let isValid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const interest = document.getElementById("interest");

  clearError("name");
  clearError("email");
  clearError("interest");

  if (!name.value.trim()) {
    showError("name", "Please enter your full name.");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError("name", "Name must be at least 2 characters.");
    isValid = false;
  }

  if (!email.value.trim()) {
    showError("email", "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showError("email", "Please enter a valid email (example: name@email.com).");
    isValid = false;
  }

  if (!interest.value) {
    showError("interest", "Please select how you would like to help.");
    isValid = false;
  }

  if (isValid) {
    // remember interest
    saveInterestPreference(interest.value);
    // simple success feedback
    const msg = document.getElementById("form-success");
    if (msg) {
      msg.textContent = "Thank you! Your interest was submitted. We will follow up soon.";
      msg.classList.add("saved-msg");
    }
    // optionally clear non-required fields but keep name/email for UX
  }

  return isValid;
}

function setupFormValidation() {
  const form = document.getElementById("interest-form");
  if (!form) return;
  form.addEventListener("submit", validateContactForm);

  // clear error as user types
  ["name", "email", "interest"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () { clearError(id); });
      el.addEventListener("change", function () { clearError(id); });
    }
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  setupFavoriteButtons();
  updateFavoritesDisplay();
  updateFavoriteButtons();
  setupInterestRemember();
  setupFormValidation();
});
