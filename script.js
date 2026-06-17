const imageList = [
	"love.jfif",
	"WhatsApp-Image-2026-06-16-at-11.34.45-PM_1.jfif",
	"WhatsApp-Image-2026-06-16-at-11.35.52-PM_1.jfif",
	"WhatsApp-Image-2026-06-16-at-11.37.06-PM_1.jfif",
	"WhatsApp-Image-2026-06-16-at-11.37.06-PM_1.jfif"
];

const wheel = document.getElementById("wheel");
const dateModal = document.getElementById("dateModal");
const loveModal = document.getElementById("loveModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsZone = document.getElementById("buttonsZone");
const heartBurst = document.getElementById("heartBurst");
const bgSong = document.getElementById("bgSong");
const musicBtn = document.getElementById("musicBtn");
const SONG_FILE = "Sadi Sun - HARSH NUSSI (mp3cut.net).mp3";

let activeIndex = 0;
let slideTimer;
let popupShown = false;

function setSongSource() {
	if (!bgSong) {
		return;
	}

	const resolvedSong = new URL(encodeURI(SONG_FILE), window.location.href).href;
	if (bgSong.getAttribute("src") !== resolvedSong) {
		bgSong.setAttribute("src", resolvedSong);
		bgSong.load();
	}
}

function showMusicButton(show) {
	if (!musicBtn) {
		return;
	}

	musicBtn.classList.toggle("hidden", !show);
	musicBtn.textContent = show ? "Play Music" : "Music On";
}

function removeUnlockListeners() {
	window.removeEventListener("click", unlockSongOnInteraction);
	window.removeEventListener("touchstart", unlockSongOnInteraction);
}

function buildSlides() {
	const fragment = document.createDocumentFragment();

	imageList.forEach((src, index) => {
		const slide = document.createElement("div");
		slide.className = "slide" + (index === 0 ? " active" : "");

		const img = document.createElement("img");
		img.src = src;
		img.alt = `Romantic photo ${index + 1}`;

		slide.appendChild(img);
		fragment.appendChild(slide);
	});

	wheel.appendChild(fragment);
}

function startSlideShow() {
	const slides = Array.from(document.querySelectorAll(".slide"));
	if (!slides.length) {
		return;
	}

	slideTimer = setInterval(() => {
		slides[activeIndex].classList.remove("active");
		activeIndex = (activeIndex + 1) % slides.length;
		slides[activeIndex].classList.add("active");

		if (!popupShown && activeIndex === 3) {
			popupShown = true;
			// Wait for the transition + a brief hold so 4th image is fully visible.
			setTimeout(openDatePopup, 1400);
		}
	}, 2800);
}

function tryAutoplaySong() {
	if (!bgSong) {
		return;
	}

	setSongSource();
	bgSong.muted = true;

	bgSong.play().then(() => {
		// Try to switch from muted autoplay to audible playback.
		setTimeout(() => {
			bgSong.muted = false;
			bgSong.play().then(() => {
				showMusicButton(false);
				removeUnlockListeners();
			}).catch(() => {
				showMusicButton(true);
			});
		}, 180);
	}).catch(() => {
		showMusicButton(true);
	});
}

function unlockSongOnInteraction() {
	if (!bgSong) {
		return;
	}

	setSongSource();

	bgSong.muted = false;
	bgSong.play().then(() => {
		showMusicButton(false);
		removeUnlockListeners();
	}).catch(() => {
		showMusicButton(true);
	});
}

if (musicBtn) {
	musicBtn.addEventListener("click", unlockSongOnInteraction);
}

function openDatePopup() {
	dateModal.classList.add("show");
}

function randomNoBtnPosition() {
	const zoneRect = buttonsZone.getBoundingClientRect();
	const btnRect = noBtn.getBoundingClientRect();

	const maxX = Math.max(0, zoneRect.width - btnRect.width - 8);
	const maxY = Math.max(0, zoneRect.height - btnRect.height - 8);

	const nextX = Math.random() * maxX;
	const nextY = Math.random() * maxY;

	noBtn.style.left = `${nextX}px`;
	noBtn.style.top = `${nextY}px`;
	noBtn.style.right = "auto";
	noBtn.style.transform = "none";
}

function runAwayIfNear(pointerX, pointerY) {
	const noRect = noBtn.getBoundingClientRect();
	const centerX = noRect.left + noRect.width / 2;
	const centerY = noRect.top + noRect.height / 2;

	const dx = pointerX - centerX;
	const dy = pointerY - centerY;
	const distance = Math.sqrt(dx * dx + dy * dy);

	// 4rem ~ 64px proximity trigger
	if (distance <= 64) {
		randomNoBtnPosition();
	}
}

function launchHeartBurst() {
	const hearts = ["💖", "💘", "❤️", "💕", "💞", "💓"];

	for (let i = 0; i < 28; i += 1) {
		const heart = document.createElement("span");
		heart.className = "heart";
		heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
		heart.style.left = `${Math.random() * 95}%`;
		heart.style.animationDelay = `${Math.random() * 0.35}s`;
		heart.style.fontSize = `${1 + Math.random() * 1.2}rem`;
		heartBurst.appendChild(heart);

		setTimeout(() => {
			heart.remove();
		}, 3000);
	}
}

yesBtn.addEventListener("click", () => {
	dateModal.classList.remove("show");
	loveModal.classList.add("show");
	launchHeartBurst();
});

noBtn.addEventListener("mouseenter", randomNoBtnPosition);
noBtn.addEventListener("touchstart", randomNoBtnPosition, { passive: true });

dateModal.addEventListener("mousemove", (event) => {
	runAwayIfNear(event.clientX, event.clientY);
});

dateModal.addEventListener(
	"touchmove",
	(event) => {
		if (!event.touches || !event.touches[0]) {
			return;
		}
		runAwayIfNear(event.touches[0].clientX, event.touches[0].clientY);
	},
	{ passive: true }
);

buildSlides();
startSlideShow();
tryAutoplaySong();

window.addEventListener("click", unlockSongOnInteraction);
window.addEventListener("touchstart", unlockSongOnInteraction, { passive: true });
