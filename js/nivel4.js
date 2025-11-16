document.addEventListener("DOMContentLoaded", () => {
  const numeros = Array.from(document.querySelectorAll(".numero"));
  const instruccion = document.getElementById("instruccion");
  const btnComenzar = document.getElementById("btnComenzar");
  const musicaFondo = document.getElementById("musicaFondo");

  if(musicaFondo) {
    musicaFondo.volume = 0.05;
    musicaFondo.loop = true;
  }

  const presentaciones = [
    document.getElementById("audio4Presentacion"),
    document.getElementById("audio5Presentacion"),
    document.getElementById("audio6Presentacion")
  ];
  const solicitudes = [
    document.getElementById("audioInstruccion4"),
    document.getElementById("audioInstruccion5"),
    document.getElementById("audioInstruccion6")
  ];
  const tocados = [
    document.getElementById("audioTocado4"),
    document.getElementById("audioTocado5"),
    document.getElementById("audioTocado6")
  ];
  const audioMuyBien = document.getElementById("audioMuyBien");

  [...presentaciones, ...solicitudes, ...tocados, audioMuyBien].forEach(a => { if(a) a.volume = 0.1; });

  let paso = 0;
  let seleccionable = false;

  const playAwait = audio => new Promise(resolve => {
    if(!audio) return resolve();
    audio.currentTime = 0;
    const p = audio.play();
    if(p && p.then){
      p.then(() => { audio.onended = resolve }).catch(() => resolve());
    } else {
      audio.onended = resolve;
    }
  });

  const mostrarInstruccion = txt => { if(instruccion) instruccion.textContent = txt; };
  const limpiarBordes = () => numeros.forEach(n => n.style.border = "none");

  const presentarNumeros = async () => {
    if(musicaFondo && musicaFondo.paused) musicaFondo.play().catch(()=>{});
    for(let i=0;i<numeros.length;i++){
      numeros[i].classList.add("pulse");
      await playAwait(presentaciones[i]);
      numeros[i].classList.remove("pulse");
      await new Promise(r=>setTimeout(r,500)); // PRESENTACION MÁS LENTA
    }
  };

  const seleccionarNumero = async () => {
    mostrarInstruccion(`Toca el número ${paso+4}`);
    await playAwait(solicitudes[paso]);
    seleccionable = true;
  };

  btnComenzar?.addEventListener("click", async () => {
    btnComenzar.style.display = "none";
    limpiarBordes();
    paso = 0;
    seleccionable = false;
    await presentarNumeros();
    await seleccionarNumero();
  });

  numeros.forEach((n,index)=>{
    n.addEventListener("click", async ()=>{
      if(!seleccionable) return;
      const valorReal = index + 4;

      if(valorReal === paso+4){
        seleccionable = false;
        n.style.border = "4px solid white";
        await playAwait(tocados[paso]);
        paso++;

        if(paso<numeros.length){
          await seleccionarNumero();
        } else {
          mostrarInstruccion("¡Muy bien!");
          if(musicaFondo) musicaFondo.pause();

          // AUDIO DE FELICITACION + REDIRECCION SEGURA
          if(audioMuyBien){
            try {
              await playAwait(audioMuyBien); // esperamos que termine
            } catch(e){ /* fallback si autoplay bloqueado */ }
          }
          setTimeout(()=> window.location.href="../niveles/nivel5.html", 100);
        }

      } else {
        seleccionable = false;
        mostrarInstruccion("❌ Incorrecto, intenta de nuevo");
        limpiarBordes();
        setTimeout(()=> seleccionarNumero(),700);
      }
    });
  });
});