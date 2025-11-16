document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btnComenzar");
  const musica = document.getElementById("musicaFondo");
  const instruccion = document.getElementById("instruccion");
  const colores = document.querySelectorAll(".color");

  if (musica) { musica.volume = 0.05; musica.loop = true; }

  const setVolume = (audio, v) => { if(audio) audio.volume = v; };

  const audioPresentacion = {
    naranja: document.getElementById("audioNaranja"),
    verde: document.getElementById("audioVerde"),
    violeta: document.getElementById("audioVioleta")
  };

  const audioInstruccion = {
    naranja: document.getElementById("audioInstruccionNaranja"),
    verde: document.getElementById("audioInstruccionVerde"),
    violeta: document.getElementById("audioInstruccionVioleta")
  };

  const audioTocado = {
    naranja: document.getElementById("audioTocadoNaranja"),
    verde: document.getElementById("audioTocadoVerde"),
    violeta: document.getElementById("audioTocadoVioleta")
  };

  const audioFelicitaciones = document.getElementById("audioMuyBien");

  Object.values(audioPresentacion).forEach(a => setVolume(a,0.2));
  Object.values(audioInstruccion).forEach(a => setVolume(a,0.25));
  Object.values(audioTocado).forEach(a => setVolume(a,0.28));
  setVolume(audioFelicitaciones,0.32);

  const orden = ["naranja", "verde", "violeta"];
  let paso = 0;
  let seleccionable = false;

  const playAwait = (audio) => new Promise(resolve => {
    if (!audio) return resolve();
    audio.currentTime = 0;
    const p = audio.play();
    if (p && p.then){
      p.then(() => audio.onended = () => resolve())
       .catch(() => resolve());
    } else {
      audio.onended = () => resolve();
    }
  });

  const mostrarInstruccion = (txt) => {
    if (!instruccion) return;
    instruccion.classList.remove("show");
    setTimeout(() => {
      instruccion.textContent = txt;
      instruccion.classList.add("show");
    }, 200);
  };

  if (btnComenzar) {
    btnComenzar.addEventListener("click", async () => {
      btnComenzar.style.display = "none";
      if (musica && musica.paused) musica.play().catch(()=>{});
      await iniciarJuego();
    });
  }

  const iniciarJuego = async () => {
    // Presentación de colores más lenta
    for (let colorEl of colores) {
      const color = colorEl.dataset.color;
      colorEl.classList.add("pulse");
      await playAwait(audioPresentacion[color]);
      await new Promise(r => setTimeout(r, 1000)); // PAUSA EXTRA PARA PRESENTACIÓN
      colorEl.classList.remove("pulse");
    }

    paso = 0;
    mostrarInstruccion(`Toca el color ${orden[paso]}`);
    await playAwait(audioInstruccion[orden[paso]]);
    seleccionable = true;
  };

  colores.forEach(colorEl => {
    colorEl.addEventListener("click", async () => {
      if (!seleccionable) return;

      const color = colorEl.dataset.color;

      if (color === orden[paso]) {
        seleccionable = false;
        colorEl.style.border = "4px solid white";
        await playAwait(audioTocado[color]);
        paso++;

        if (paso < orden.length) {
          mostrarInstruccion(`Toca el color ${orden[paso]}`);
          await playAwait(audioInstruccion[orden[paso]]);
          seleccionable = true;
        } else {
          mostrarInstruccion("¡Muy bien!");
          await playAwait(audioFelicitaciones);
          if (musica) musica.pause();
          setTimeout(() => window.location.href = "../niveles/nivel4.html", 1000);
        }

      } else {
        seleccionable = false;
        mostrarInstruccion("❌ Incorrecto, intenta de nuevo");
        colores.forEach(c => c.style.border = "none");

        setTimeout(async () => {
          mostrarInstruccion(`Toca el color ${orden[paso]}`);
          await playAwait(audioInstruccion[orden[paso]]);
          seleccionable = true;
        }, 700);
      }
    });
  });

});