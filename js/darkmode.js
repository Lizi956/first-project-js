import { darkMode } from "./main.js";
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

window.onload = () => {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  const darkModeButton = document.getElementById("darkModeButton");
  darkModeButton.addEventListener("click", toggleDarkMode);
};
