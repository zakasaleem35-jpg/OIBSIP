// =========================================================
// Temperature Converter — Oasis Infobyte · Level 1 · Task 3
// =========================================================

// ---------- 1. HTML elements pakrein ----------
const form     = document.getElementById("converterForm");
const input    = document.getElementById("tempInput");
const errorMsg = document.getElementById("errorMsg");
const clearBtn = document.getElementById("clearBtn");

const resultC = document.getElementById("resultC");
const resultF = document.getElementById("resultF");
const resultK = document.getElementById("resultK");

const boxes = {
  C: document.getElementById("boxC"),
  F: document.getElementById("boxF"),
  K: document.getElementById("boxK"),
};

// ---------- 2. Conversion functions ----------
// Kisi bhi unit ko pehle Celsius mein badlo
function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value; // already Celsius
}

// Celsius se Fahrenheit aur Kelvin nikalo
function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32;
}

function celsiusToKelvin(c) {
  return c + 273.15;
}

// Number ko 2 decimal tak saaf karo: 98.60000001 → 98.6
function format(num) {
  const rounded = Math.round(num * 100) / 100;
  return rounded === 0 ? 0 : rounded;   // "-0" na dikhe
}

// ---------- 3. Helper functions ----------
function showError(message) {
  errorMsg.textContent = message;
  input.classList.add("invalid");
  resetResults();
}

function clearError() {
  errorMsg.textContent = "";
  input.classList.remove("invalid");
}

function resetResults() {
  resultC.textContent = "—";
  resultF.textContent = "—";
  resultK.textContent = "—";
  Object.values(boxes).forEach(function (box) {
    box.classList.remove("source");
  });
}

// ---------- 4. Convert button (form submit) ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();   // page reload hone se roko

  const raw = input.value.trim();
  const unit = document.querySelector('input[name="unit"]:checked').value;

  // Validation 1: khali input
  if (raw === "") {
    showError("Please enter a temperature value.");
    return;
  }

  // Validation 2: number nahi hai (jaise "abc" ya "12x")
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    showError("Please enter a valid number, for example 25 or -10.5.");
    return;
  }

  // Conversion
  const celsius = toCelsius(value, unit);
  const kelvin = celsiusToKelvin(celsius);

  // Validation 3: absolute zero se neeche (0 K se kam mumkin nahi)
  if (kelvin < -0.000001) {
    showError("That's below absolute zero (−273.15 °C / −459.67 °F / 0 K), which is physically impossible.");
    return;
  }

  // Sab theek: results dikhao
  clearError();
  resultC.textContent = format(celsius) + " °C";
  resultF.textContent = format(celsiusToFahrenheit(celsius)) + " °F";
  resultK.textContent = format(kelvin) + " K";

  // Jo unit user ne diya tha, us box ko highlight karo
  Object.values(boxes).forEach(function (box) {
    box.classList.remove("source");
  });
  boxes[unit].classList.add("source");
});

// ---------- 5. Typing shuru karte hi error hatao ----------
input.addEventListener("input", clearError);

// ---------- 6. Clear button ----------
clearBtn.addEventListener("click", function () {
  input.value = "";
  clearError();
  resetResults();
  input.focus();
});