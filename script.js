if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

const video = document.getElementById('intro-video');
const hero = document.getElementById('hero');
const overlay = document.getElementById('hero-overlay');
const btnRaconte = document.getElementById('btn-raconte');
const firstCase = document.querySelector('.case-bd');
const bgMusic = document.getElementById('bg-music');

const showOverlay = () => {
  if (overlay) {
    overlay.classList.add('visible');
  }
};

if (video) {
  video.addEventListener('ended', showOverlay);
}
setTimeout(showOverlay, 10000);

if (btnRaconte && hero) {
  btnRaconte.addEventListener('click', () => {
    window.scrollTo(0, 0);
    hero.classList.add('started');
    
    if (bgMusic) {
      bgMusic.volume = 0.4;
      bgMusic.play().catch(err => {
        console.log("Lecture audio bloquée :", err);
      });
    }
    
    setTimeout(() => {
      if (firstCase) {
        firstCase.classList.add('paint-reveal');
      }
      updateScrollDraw();
    }, 350);
  });
}

const revealCases = document.querySelectorAll('.reveal');

function updateScrollDraw() {
  const windowHeight = window.innerHeight;
  const startTrigger = windowHeight * 0.92;
  const endTrigger = windowHeight * 0.38;

  revealCases.forEach((el) => {
    const rect = el.getBoundingClientRect();
    let progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
    progress = Math.max(0, Math.min(1, progress));
    el.style.setProperty('--progress', progress.toFixed(3));
  });
}

window.addEventListener('scroll', updateScrollDraw, { passive: true });
window.addEventListener('resize', updateScrollDraw);
updateScrollDraw();

const btnPause = document.getElementById('btn-pause');
const finalScreen = document.getElementById('final-screen');
const btnBack = document.getElementById('btn-back');

if (btnPause && finalScreen) {
  btnPause.addEventListener('click', () => {
    finalScreen.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (btnBack && finalScreen) {
  btnBack.addEventListener('click', () => {
    finalScreen.classList.remove('active');
    document.body.style.overflow = '';
  });

  // --- GESTION DU SON SPÉCIFIQUE DE LA CASE 3 ---
const specialCase = document.querySelector('[data-case-audio]');
const dynamicAudio = document.getElementById('dynamic-case-audio');
let caseAudioPlayed = false; // Pour éviter que le son ne boucle en boucle à chaque micro-mouvement

function checkSpecialCaseAudio() {
  if (!specialCase || !dynamicAudio) return;

  const rect = specialCase.getBoundingClientRect();
  const windowCenter = window.innerHeight / 2;

  // Si le milieu de l'écran se trouve à l'intérieur de la case 3
  if (rect.top <= windowCenter && rect.bottom >= windowCenter) {
    if (!caseAudioPlayed) {
      const audioSrc = specialCase.getAttribute('data-case-audio');
      dynamicAudio.src = audioSrc;
      dynamicAudio.volume = 0.6;
      dynamicAudio.play().catch(err => {
        console.log("Lecture audio de la case 3 bloquée :", err);
      });
      caseAudioPlayed = true; // Marque le son comme lu
    }
  } else {
    // Réinitialise si l'utilisateur remonte ou redescend loin (optionnel)
    if (rect.top > window.innerHeight || rect.bottom < 0) {
      caseAudioPlayed = false; 
    }
  }
}

// Ajoute cette fonction dans l'écouteur de scroll existant
window.addEventListener('scroll', () => {
  updateScrollDraw();
  checkSpecialCaseAudio();
}, { passive: true });
}