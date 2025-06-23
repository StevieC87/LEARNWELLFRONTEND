export function isitBot() {
  //if bot returns true
  if (!navigator.cookieEnabled) return true; // Bots often disable cookies
  if (!window.innerWidth || !window.innerHeight) return true; // Headless browsers often lack dimensions
  if (!window.requestAnimationFrame) return true; // Old bots don't support this
  // Use WebGL to detect headless browsers
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return true; // Some bots disable WebGL
  } catch (e) {
    return true;
  }
}
