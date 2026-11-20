// =========================================================
// Zaka Saleem Hamdani — Portfolio
// Mobile menu (hamburger) toggle
// =========================================================

// 1. HTML se elements pakrein (id ke zariye)
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// 2. Hamburger button click hone par menu kholo / band karo
menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open");

  // Screen reader ko batao menu khula hai ya band
  const isOpen = navLinks.classList.contains("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// 3. Kisi link par click ho to menu khud band ho jaye
const links = navLinks.querySelectorAll("a");

links.forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", false);
  });
});