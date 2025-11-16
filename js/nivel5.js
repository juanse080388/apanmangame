document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btnComenzar");
  const musica = document.getElementById("musicaFondo");
  const instruccion = document.getElementById("instruccion");
  const colores = document.querySelectorAll(".color");

  // Volumen y loop de música
  if (musica) { musica.volume = 0.05; musica.loop = true; }

  const setVolume = (audio, v) => { if(audio) audio.volume = v; };

  // Audios por color
  const audioPresentacion = {
    amarillo: document.getElementById("audioAmarillo"),
    azul: document.getElementById("audioAzul"),
    rojo: document.getElementById("audioRojo"),
    naranja: document.getElementById("audioNaranja"),
    verde: document.getElementById("audioVerde"),
    violeta: document.getElementById("audioVioleta"),
  };

  const audioInstruccion = {
    amarillo: document.getElementById("audioInstruccionAmarillo"),
    azul: document.getElementById("audioInstruccionAzul"),
    rojo: document.getElementById("audioInstruccionRojo"),
    naranja: document.getElementById("audioInstruccionNaranja"),
    verde: document.getElementById("audioInstruccionVerde"),
    violeta: document.getElementById("audioInstruccionVioleta"),
  };

  const audioTocado = {
    amarillo: document.getElementById("audioTocadoAmarillo"),
    azul: document.getElementById("audioTocadoAzul"),
    rojo: document.getElementById("audioTocadoRojo"),
    naranja: document.getElementById("audioTocadoNaranja"),
    verde: document.getElementById("audioTocadoVerde"),
    violeta: document.getElementById("audioTocadoVioleta"),
  };

  const audioFelicitaciones = document.getElementById("audioMuyBien");

  Object.values(audioPresentacion).forEach(a => setVolume(a, 0.2));
  Object.values(audioInstruccion).forEach(a => setVolume(a, 0.25));
  Object.values(audioTocado).forEach(a => setVolume(a, 0.28));
  setVolume(audioFelicitaciones, 0.32);

  const orden = ["amarillo","azul","rojo","naranja","verde","violeta"];
  let paso = 0;
  let seleccionable = false;

  // Función para reproducir audio y esperar a que termine
  const playAwait = (audio) => {
    return new Promise(resolve => {
      if(!audio) return resolve();
      audio.currentTime = 0;
      const p = audio.play();
      if(p && p.then){
        p.then(()=> audio.onended = () => resolve())
         .catch(()=> resolve());
      } else {
        audio.onended = () => resolve();
      }
    });
  };

  const mostrarInstruccion = (txt) => {
    if(!instruccion) return;
    instruccion.classList.remove("show");
    setTimeout(() => {
      instruccion.textContent = txt;
      instruccion.classList.add("show");
    }, 200);
  };

  // Botón comenzar
  if(btnComenzar){
    btnComenzar.addEventListener("click", async () => {
      btnComenzar.style.display = "none";
      if(musica && musica.paused) musica.play().catch(()=>{});
      await iniciarJuego();
    });
  }

  // Presentación inicial de colores
  const iniciarJuego = async () => {
    for(let colorEl of colores){
      const color = colorEl.dataset.color;
      colorEl.classList.add("pulse");
      await playAwait(audioPresentacion[color]);
      await new Promise(r => setTimeout(r, 400)); // presentación un poco más lenta
      colorEl.classList.remove("pulse");
    }

    paso = 0;
    mostrarInstruccion(`Toca el color ${orden[paso]}`);
    await playAwait(audioInstruccion[orden[paso]]);
    seleccionable = true;
  };

  // Click en colores
  colores.forEach(colorEl => {
    colorEl.addEventListener("click", async () => {
      if(!seleccionable) return;

      const color = colorEl.dataset.color;

      if(color === orden[paso]){
        seleccionable = false;
        colorEl.style.border = "4px solid white";
        await playAwait(audioTocado[color]);
        paso++;

        if(paso < orden.length){
          mostrarInstruccion(`Toca el color ${orden[paso]}`);
          await playAwait(audioInstruccion[orden[paso]]);
          seleccionable = true;
        } else {
          mostrarInstruccion("¡Muy bien!");
          if(audioFelicitaciones) await playAwait(audioFelicitaciones);
          if(musica) musica.pause();
          setTimeout(()=> window.location.href = "../niveles/nivel6.html", 1000);
        }
      } else {
        seleccionable = false;
        mostrarInstruccion(`❌ Incorrecto, intenta de nuevo`);
        colores.forEach(c => c.style.border = "none");
        setTimeout(async ()=>{
          mostrarInstruccion(`Toca el color ${orden[paso]}`);
          await playAwait(audioInstruccion[orden[paso]]);
          seleccionable = true;
        }, 700);
      }
    });
  });
});