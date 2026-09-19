(() => {
const root = document.documentElement;
root.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const art = document.querySelector(".art");
requestAnimationFrame(() => requestAnimationFrame(() => art && art.classList.add("is-drawn")));

const items = document.querySelectorAll(".reveal");
const groups = new Map();
items.forEach((el) => {
const parent = el.parentElement;
const i = groups.get(parent) || 0;
el.style.setProperty("--d", `${Math.min(i * 70, 350)}ms`);
groups.set(parent, i + 1);
});
if ("IntersectionObserver" in window) {
const io = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-in");
io.unobserve(entry.target);
}
});
},
{ rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
);
items.forEach((el) => io.observe(el));
} else {
items.forEach((el) => el.classList.add("is-in"));
}

const ticks = document.querySelector(".rail__ticks");
const progress = document.querySelector(".rail__progress span");
const mark = document.querySelector(".rail__mark");
let railFrame = 0;
const updateRails = () => {
railFrame = 0;
const y = window.scrollY;
const max = document.documentElement.scrollHeight - window.innerHeight;
const p = max > 0 ? Math.min(y / max, 1) : 0;
if (progress) progress.style.transform = `scaleY(${p.toFixed(4)})`;
if (reduceMotion) return;
if (ticks) ticks.style.transform = `translateY(${-((y * 0.4) % 80)}px)`;
updateFloaters();
if (mark) mark.style.transform = `rotate(${(y * 0.12).toFixed(1)}deg)`;
};
window.addEventListener("scroll", () => {
if (!railFrame) railFrame = requestAnimationFrame(updateRails);
}, { passive: true });

const floaters = [...document.querySelectorAll(".floater")].map((el) => ({
el,
factor: Number(el.dataset.float) || 0.08,
base: el.closest("section").offsetTop,
}));
const updateFloaters = () => {
if (reduceMotion) return;
const y = window.scrollY + window.innerHeight / 2;
floaters.forEach(({ el, factor, base }) => {
el.style.transform = `translate3d(0, ${((y - base) * -factor).toFixed(1)}px, 0)`;
});
};
updateRails();
window.addEventListener("resize", () => {
floaters.forEach((f) => { f.base = f.el.closest("section").offsetTop; });
});

const num = document.querySelector(".rail__num");
const rails = document.querySelectorAll(".rail");
const sections = document.querySelectorAll("[data-section]");
if (num && "IntersectionObserver" in window) {
let current = num.textContent;
let swapTimer = 0;
const so = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;

const onDark = entry.target.dataset.rail === "dark";
rails.forEach((r) => r.classList.toggle("rail--on-dark", onDark));
const next = entry.target.dataset.section;
if (next === current) return;
current = next;
clearTimeout(swapTimer);
num.classList.add("is-changing");
swapTimer = setTimeout(() => {
num.textContent = next;
num.classList.remove("is-changing");
}, 200);
});
},
{ rootMargin: "-50% 0px -50% 0px" }
);
sections.forEach((s) => so.observe(s));
}


const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (art && canHover && !reduceMotion) {
const figure = art.closest(".hero__art") || art;
const layers = art.querySelectorAll("[data-depth]");
let frame = 0;
let boost = 1;
figure.addEventListener("pointerenter", () => { boost = 2; figure.classList.add("is-live"); });
figure.addEventListener("pointerleave", () => { boost = 1; figure.classList.remove("is-live"); });
window.addEventListener("pointermove", (e) => {
cancelAnimationFrame(frame);
frame = requestAnimationFrame(() => {
const x = e.clientX / window.innerWidth - 0.5;
const y = e.clientY / window.innerHeight - 0.5;
layers.forEach((layer) => {
const d = Number(layer.dataset.depth) * 3 * boost;
layer.style.transform = `translate(${(-x * d).toFixed(2)}px, ${(-y * d).toFixed(2)}px)`;
});
art.style.transform =
`rotateY(${(x * 5 * boost).toFixed(2)}deg) rotateX(${(-y * 4 * boost).toFixed(2)}deg)`;
});
});
}
})();
(() => {
const video = document.querySelector(".hero__video");
const poster = document.querySelector(".hero__poster");
const hero = window.OLLINE_MEDIA && window.OLLINE_MEDIA.hero;
if (!video || !hero || !hero.variants || !hero.variants.length) return;
const conn = navigator.connection || {};
const slowNetwork = conn.saveData === true || /2g/.test(conn.effectiveType || "");
const weakDevice = (navigator.hardwareConcurrency || 4) <= 2 ||
(navigator.deviceMemory || navigator.deviceMemory === 0 ? navigator.deviceMemory <= 2 : false);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (slowNetwork || weakDevice || reduceMotion) return;

const need = Math.min(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2), 1600);
const sorted = [...hero.variants].sort((a, b) => a.w - b.w);
const pick = sorted.find((v) => v.w >= need * 0.9) || sorted[sorted.length - 1];
let started = false;
const start = () => {
if (started) return;
started = true;
video.src = pick.src;
video.load();
video.addEventListener("playing", () => document.querySelector(".hero__bg").classList.add("is-playing"), { once: true });
video.play().catch(() => {});
};

if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2500 });
else setTimeout(start, 1200);
if ("IntersectionObserver" in window) {
new IntersectionObserver(([entry]) => {
if (!started) return;
if (entry.isIntersecting) video.play().catch(() => {});
else video.pause();
}).observe(video);
}
document.addEventListener("visibilitychange", () => {
if (document.hidden) video.pause();
else if (started) video.play().catch(() => {});
});
})();