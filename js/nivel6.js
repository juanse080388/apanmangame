document.addEventListener("DOMContentLoaded", () => {
  const btnComenzar = document.getElementById("btnComenzar");
  const musica = document.getElementById("musicaFondo");
  const instruccion = document.getElementById("instruccion");
  const numeros = document.querySelectorAll(".numero");

  if (musica) { musica.volume = 0.05; musica.loop = true; }

  const setVolume = (audio, v) => { if(audio) audio.volume = v; };

  const audioPresentacion = {};
  const audioInstruccion = {};
  const audioTocado = {};
  for(let i=1; i<=6; i++){
    audioPresentacion[i] = document.getElementById(`audio${i}Presentacion`);
    audioInstruccion[i] = document.getElementById(`audioInstruccion${i}`);
    audioTocado[i] = document.getElementById(`audioTocado${i}`);
    setVolume(audioPresentacion[i], 0.2);
    setVolume(audioInstruccion[i], 0.25);
    setVolume(audioTocado[i], 0.28);
  }
  const audioFelicitaciones = document.getElementById("audioMuyBien");
  setVolume(audioFelicitaciones,0.32);

  const orden = [1,2,3,4,5,6];
  let paso = 0;
  let seleccionable = false;

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

  const presentarNumeros = async () => {
    if(musica && musica.paused) musica.play().catch(()=>{});
    for(let numEl of numeros){
      const num = parseInt(numEl.dataset.num,10);
      numEl.classList.add("pulse");
      await playAwait(audioPresentacion[num]);
      await new Promise(r => setTimeout(r, 1000)); // presentación más lenta
      numEl.classList.remove("pulse");
      await new Promise(r => setTimeout(r, 500));
    }
  };

  const seleccionarNumero = async () => {
    mostrarInstruccion(`Toca el número ${orden[paso]}`);
    await playAwait(audioInstruccion[orden[paso]]);
    seleccionable = true;
  };

  btnComenzar && btnComenzar.addEventListener("click", async () => {
    btnComenzar.style.display = "none";
    paso = 0;
    seleccionable = false;
    numeros.forEach(n => n.style.border="none");
    await presentarNumeros();
    await seleccionarNumero();
  });

  numeros.forEach(numEl=>{
    numEl.addEventListener("click", async ()=>{
      if(!seleccionable) return;
      const num = parseInt(numEl.dataset.num,10);
      if(num === orden[paso]){
        seleccionable = false;
        numEl.style.border = "4px solid white";
        await playAwait(audioTocado[num]);
        paso++;

        if(paso < orden.length){
          await seleccionarNumero();
        } else {
          // CARTEL DE FELICITACIONES APARECE INMEDIATO
          const cartel = document.createElement("div");
          cartel.style.position = "fixed";
          cartel.style.top = "50%";
          cartel.style.left = "50%";
          cartel.style.transform = "translate(-50%, -50%)";
          cartel.style.background = "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)";
          cartel.style.color = "white";
          cartel.style.fontSize = "2rem";
          cartel.style.padding = "2rem 3rem";
          cartel.style.borderRadius = "15px";
          cartel.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
          cartel.style.textAlign = "center";
          cartel.style.zIndex = 1000;
          cartel.innerHTML = "🎉 Completaste todos los niveles 🎉<br>¡Felicitaciones!";
          document.body.appendChild(cartel);

          mostrarInstruccion("¡Muy bien!");
          if(audioFelicitaciones) await playAwait(audioFelicitaciones);
          if(musica) musica.pause();

          setTimeout(()=>{
            window.location.href = "../index.html";
          }, 3000);
        }
      } else {
        seleccionable = false;
        mostrarInstruccion(`❌ Incorrecto, intenta de nuevo`);
        numeros.forEach(n=> n.style.border="none");
        setTimeout(async ()=>{
          await seleccionarNumero();
        },700);
      }
    });
  });
});