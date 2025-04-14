import { navigateTo } from "../assets/javascript/auth/login.js";
import { clearUser, getCurrentUser } from "../store/authStore.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});

export function initRouter() {
  const user = getCurrentUser();

  if (!user) {
    return navigateTo("/frontend/index.html");
  }
  setupLogout();
}

function setupLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    clearUser();
    navigateTo("/frontend/index.html");
  });
}
