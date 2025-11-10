import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("jwt_token").value;

  // Skip check for public pages
  if (["/login", "/register"].includes(to.path)) return;

  // No token → redirect to login
  if (!token) return navigateTo("/login");

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000;

    // Expired token → clear cookie + redirect
    if (!exp || now > exp) {
      useCookie("jwt_token").value = null;
      return navigateTo("/login");
    }
  } catch {
    // Invalid token → clear cookie + redirect
    useCookie("jwt_token").value = null;
    return navigateTo("/login");
  }
});
