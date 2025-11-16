document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btnComenzar");
  const musica = document.getElementById("musicaFondo");

  // Música suave para personas con autismo
  musica.volume = 0.05;
  musica.loop = true;

  // Intento reproducir automáticamente
  musica.play().catch(() => console.log("Autoplay bloqueado"));

  btnComenzar.addEventListener("click", () => {
    if (musica.paused) musica.play();
    // Redirigir al nivel 1
    window.location.href = "./niveles/nivel1.html";
  });
});