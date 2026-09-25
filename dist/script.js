(() => {
const root = document.documentElement;


root.classList.add("js", "anim");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });



const loader = document.querySelector(".loader");
if (loader) {
const bar = loader.querySelector("i");
const startedAt = performance.now();
const MIN_VISIBLE = 900;
let finished = false;
const finish = () => {
if (finished) return;
finished = true;
setTimeout(() => {
if (bar) {
bar.style.animation = "none";
bar.style.transition = "transform 260ms ease-out";
bar.style.transform = "scaleX(1)";
}
setTimeout(() => {
loader.classList.add("is-done");
setTimeout(() => root.classList.remove("loading"), 850);
}, 240);
}, Math.max(0, MIN_VISIBLE - (performance.now() - startedAt)));
};
if (document.readyState === "complete") finish();
else window.addEventListener("load", finish, { once: true });
setTimeout(finish, 4000);
}



const art = document.querySelector(".art");
const startDrawing = () => art && art.classList.add("is-drawn");
requestAnimationFrame(() => requestAnimationFrame(startDrawing));
setTimeout(startDrawing, 600);
document.addEventListener("visibilitychange", startDrawing, { once: true });


setTimeout(() => {
if (!art) return;
art.querySelectorAll(".shape, text, .guides").forEach((el) => {
if (Number(getComputedStyle(el).opacity) < 0.9) el.style.opacity = "1";
});
art.querySelectorAll(".line, .dim line").forEach((el) => {
if (parseFloat(getComputedStyle(el).strokeDashoffset) > 0.01) {
el.style.strokeDasharray = "none";
el.style.strokeDashoffset = "0";
}
});
}, 3000);

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
const layers = [...art.querySelectorAll("[data-depth]")];
let targetX = 0, targetY = 0, targetBoost = 1;
let curX = 0, curY = 0, boost = 1;
let frame = 0;
let rect = null;
const refreshRect = () => { rect = figure.getBoundingClientRect(); };
window.addEventListener("resize", refreshRect);
window.addEventListener("scroll", refreshRect, { passive: true });
const step = () => {
frame = 0;
const ease = 0.12;
curX += (targetX - curX) * ease;
curY += (targetY - curY) * ease;
boost += (targetBoost - boost) * ease;
layers.forEach((layer) => {
const d = Number(layer.dataset.depth) * 3 * boost;
layer.style.transform = `translate(${(-curX * d).toFixed(2)}px, ${(-curY * d).toFixed(2)}px)`;
});


art.style.transform =
`translate(${(-curX * 14 * boost).toFixed(2)}px, ${(-curY * 10 * boost).toFixed(2)}px)`;
const settled = Math.abs(targetX - curX) < 0.002 &&
Math.abs(targetY - curY) < 0.002 &&
Math.abs(targetBoost - boost) < 0.01;
if (!settled) frame = requestAnimationFrame(step);
};
const run = () => { if (!frame) frame = requestAnimationFrame(step); };
window.addEventListener("pointermove", (e) => {
if (!rect) refreshRect();

const cx = rect.left + rect.width / 2;
const cy = rect.top + rect.height / 2;
targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
run();
}, { passive: true });
figure.addEventListener("pointerenter", () => { targetBoost = 1.8; figure.classList.add("is-live"); run(); });
figure.addEventListener("pointerleave", () => { targetBoost = 1; figure.classList.remove("is-live"); run(); });

const reset = () => { targetX = 0; targetY = 0; targetBoost = 1; figure.classList.remove("is-live"); run(); };
document.addEventListener("pointerleave", reset);
window.addEventListener("blur", reset);
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