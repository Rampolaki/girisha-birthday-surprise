const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const ext=".jpeg";
const photo=n=>`images/photo${String(n).padStart(2,"0")}${ext}`;
let current=0;
function show(n){current=n;$$(".screen").forEach(x=>x.classList.remove("active"));document.querySelector(`[data-screen="${n}"]`).classList.add("active");window.scrollTo(0,0);burst(n===9?25:9)}
$$("[data-next]").forEach(b=>b.addEventListener("click",()=>show(+b.dataset.next)));

function burst(count=12){
 for(let i=0;i<count;i++){
  const h=document.createElement("div");h.className="heart";
  h.textContent=["❤️","💗","💕","✨","🌸"][Math.floor(Math.random()*5)];
  h.style.left=(5+Math.random()*90)+"vw";h.style.top=(65+Math.random()*25)+"vh";
  h.style.animationDelay=(Math.random()*.25)+"s";document.body.appendChild(h);
  setTimeout(()=>h.remove(),2200);
 }
}

const smileNums=[2,3,4,5,8,11];
$("#smileBtn").onclick=()=>{
 const grid=$("#smileGrid");grid.innerHTML="";
 smileNums.forEach((n,i)=>{const d=document.createElement("div");d.className="mini";d.style.animationDelay=(i*.09)+"s";d.innerHTML=`<img src="${photo(n)}" alt="Girisha">`;grid.appendChild(d)});
 $("#smileBtn").classList.add("hidden");$("#smileNext").classList.remove("hidden");burst(32);
};

$$(".nameBtn").forEach(b=>b.onclick=()=>{
 $("#nameReveal").innerHTML=`<img src="${photo(+b.dataset.photo.match(/\d+/)[0])}" alt="${b.dataset.name}"><p>${b.dataset.name} ❤️ — one of those names that feels special because it's you.</p>`;
 $("#nameReveal").classList.remove("hidden");$("#nameNext").classList.remove("hidden");burst(18);
});

const gallery=$("#gallery");
for(let n=1;n<=21;n++){
 if([3,16,21].includes(n)) continue; // keep final cake, eyes close-up, and previous final frame as surprises
 const b=document.createElement("button");
 b.innerHTML=`<img src="${photo(n)}" alt="Girisha photo ${n}">`;
 b.onclick=()=>openLight(n);
 gallery.appendChild(b);
}
function openLight(n){$("#lightImg").src=photo(n);$("#lightCaption").textContent="A little frame worth remembering. ✨";$("#lightbox").classList.remove("hidden")}
$("#close").onclick=()=>$("#lightbox").classList.add("hidden");
$("#lightbox").onclick=e=>{if(e.target.id==="lightbox")$("#lightbox").classList.add("hidden")};

$("#envelope").onclick=()=>{$("#envelope").classList.add("hidden");$("#letter").classList.remove("hidden");$("#letterNext").classList.remove("hidden");burst(38)};


$("#replay").onclick=()=>show(0);

// Soft birthday music using the browser's Web Audio API.
// It starts from the user's tap, so Chrome/Safari mobile autoplay rules are respected.
let audioCtx = null;
let masterGain = null;
let musicTimer = null;
let musicOn = false;

const birthdayMelody = [
  [261.63, 0.42], [261.63, 0.42], [293.66, 0.85],
  [261.63, 0.85], [349.23, 0.85], [329.63, 1.25],
  [261.63, 0.42], [261.63, 0.42], [293.66, 0.85],
  [261.63, 0.85], [392.00, 0.85], [349.23, 1.25],
  [261.63, 0.42], [261.63, 0.42], [523.25, 0.85],
  [440.00, 0.85], [349.23, 0.85], [329.63, 0.85], [293.66, 1.25],
  [466.16, 0.42], [466.16, 0.42], [440.00, 0.85],
  [349.23, 0.85], [392.00, 0.85], [349.23, 1.25]
];

function setupAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.30;
    masterGain.connect(audioCtx.destination);
  }
}

function playNote(freq, duration) {
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.34, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.04);

  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + duration);
}

function startMusic() {
  clearInterval(musicTimer);
  let i = 0;
  const play = () => {
    const [freq, duration] = birthdayMelody[i % birthdayMelody.length];
    playNote(freq, duration);
    i++;
  };
  play();
  musicTimer = setInterval(play, 520);
}

function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

async function toggleMusic() {
  setupAudio();
  if (audioCtx.state === "suspended") await audioCtx.resume();

  musicOn = !musicOn;
  if (musicOn) {
    startMusic();
    $("#musicBtn").textContent = "🔊 Music On";
  } else {
    stopMusic();
    $("#musicBtn").textContent = "♪ Music";
  }
}

$("#musicBtn").onclick = toggleMusic;

// The first surprise button is also a real user gesture, so start the music there.
$(".hero .cta").addEventListener("click", async () => {
  if (!musicOn) {
    setupAudio();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    musicOn = true;
    startMusic();
    $("#musicBtn").textContent = "🔊 Music On";
  }
});
