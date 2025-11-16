document.addEventListener("DOMContentLoaded", () => {
  const numeros = Array.from(document.querySelectorAll(".numero"));
  const instruccion = document.getElementById("instruccion");
  const btnComenzar = document.getElementById("btnComenzar");
  const musicaFondo = document.getElementById("musicaFondo");

  if(musicaFondo) musicaFondo.volume = 0.05;

  const presentaciones = [
    document.getElementById("audio1Presentacion"),
    document.getElementById("audio2Presentacion"),
    document.getElementById("audio3Presentacion")
  ];

  const solicitudes = [
    document.getElementById("audioInstruccion1"),
    document.getElementById("audioInstruccion2"),
    document.getElementById("audioInstruccion3")
  ];

  const tocados = [
    document.getElementById("audioTocado1"),
    document.getElementById("audioTocado2"),
    document.getElementById("audioTocado3")
  ];

  const audioMuyBien = document.getElementById("audioMuyBien");

  [...presentaciones, ...solicitudes, ...tocados, audioMuyBien].forEach(a => { if(a) a.volume = 0.2; });

  let paso = 0;
  let seleccionable = false;

  const playAwait = (audioEl) => new Promise(resolve => {
    if(!audioEl) return resolve();
    audioEl.currentTime = 0;
    const p = audioEl.play();
    if(p && p.then){
      p.then(()=> audioEl.onended = () => resolve())
       .catch(()=> resolve());
    } else {
      audioEl.onended = () => resolve();
    }
  });

  const mostrarInstruccion = txt => { instruccion.textContent = txt; };

  const seleccionarNumero = async () => {
    const numero = paso + 1; // 1,2,3
    mostrarInstruccion(`Toca el número ${numero}`);
    await playAwait(solicitudes[paso]);
    seleccionable = true;
  };

  btnComenzar.addEventListener("click", async () => {
    btnComenzar.style.display = "none";
    if(musicaFondo && musicaFondo.paused) musicaFondo.play().catch(()=>{});

    // Presentación de números con efecto pulse más lenta
    for (let i = 0; i < numeros.length; i++) {
      numeros[i].classList.add("pulse");
      await playAwait(presentaciones[i]);
      await new Promise(r => setTimeout(r, 1000)); // pausa más larga para que se note la presentación
      numeros[i].classList.remove("pulse");
    }

    paso = 0;
    seleccionarNumero();
  });

  numeros.forEach((n, index) => {
    n.addEventListener("click", async () => {
      if(!seleccionable) return;

      const valorReal = index + 4; // 0->4, 1->5, 2->6

      if(valorReal === paso + 4){
        seleccionable = false;
        n.style.border = "4px solid white";
        await playAwait(tocados[paso]);
        paso++;
        if(paso < numeros.length){
          seleccionarNumero();
        } else {
          mostrarInstruccion("¡Muy bien!");
          await playAwait(audioMuyBien);
          setTimeout(() => window.location.href = "../niveles/nivel3.html", 800);
        }
      } else {
        mostrarInstruccion(`❌ Incorrecto, intenta de nuevo`);
        setTimeout(() => seleccionarNumero(), 700);
      }
    });
  });
});