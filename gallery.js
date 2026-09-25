(() => {
  const data = window.OLLINE_MEDIA;
  const gallery = document.getElementById("gallery");
  if (!data || !gallery) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection || {};
  const savesData = conn.saveData === true || /2g/.test(conn.effectiveType || "");
  const coarse = window.matchMedia("(hover: none), (max-width: 760px)").matches;
  const weak = (navigator.hardwareConcurrency || 4) <= 4;
  // how many grid videos may play at once; phones, slow links and weak machines: tap to play
  const MAX_PLAYING = savesData || coarse ? 0 : weak ? 1 : 2;
  const PAGE = coarse ? 8 : 12;
  const TYPES = ["viz", "video", "plan", "draw"];
  const labels = { viz: "Визуализация", video: "Видео", plan: "Планировка", draw: "Рабочий чертёж" };

  // Which works open each direction (by file name); everything else follows in folder order
  const FEATURED = {
    commercial: ["bel-001", "chatgpt-image-11-iyul-2025-g-15-37-24", "chatgpt-image-12-iyul-2025-g-09-16-49",
      "chatgpt-image-16-iyul-2025-g-16-01-49", "bel-002"],
    residential: ["alisa-02", "letnyany-8", "omega-4", "issa-05", "lisa-02", "letnyany-13",
      "praha-apart-0101", "omega-6", "issa-06"],
    architecture: ["lisa-55", "lisa-54", "lisa-57", "lisa-59"],
  };

  const slugOf = (it) => it.src.split("/").pop().replace(/\.(webp|mp4)$/, "");
  const isSheet = (it) => it.fh / it.fw > 2 || slugOf(it) === "1";

  const sections = {};
  data.sections.forEach((s) => {
    const featured = FEATURED[s.key] || [];
    const rank = (it) => {
      const f = featured.indexOf(slugOf(it));
      return f >= 0 ? f : isSheet(it) ? 1000 : 100;
    };
    const items = {};
    TYPES.forEach((t) => {
      items[t] = (s.items[t] || [])
        .map((it, i) => ({ it: { ...it, kind: t }, i }))
        .sort((a, b) => rank(a.it) - rank(b.it) || a.i - b.i)
        .map((x) => x.it);
    });
    // "All": three stills, then a video; plans and drawings after
    const all = [];
    const viz = [...items.viz], vid = [...items.video];
    while (viz.length || vid.length) {
      all.push(...viz.splice(0, 3));
      if (vid.length) all.push(vid.shift());
    }
    all.push(...items.plan, ...items.draw);
    items.all = all;
    sections[s.key] = { title: s.title, items };
  });

  // какое направление открыто по умолчанию, решает порядок кнопок в разметке
  const firstTab = document.querySelector(".p-section.is-active") || document.querySelector(".p-section");
  let section = (firstTab && sections[firstTab.dataset.dir]) ? firstTab.dataset.dir
              : (data.sections[0]?.key || "residential");
  let type = "all";
  let shown = 0;

  const sectionBtns = document.querySelectorAll(".p-section");
  const filterBtns = document.querySelectorAll(".filter");
  const moreWrap = document.querySelector(".gallery__more");
  const moreBtn = document.getElementById("gallery-more");
  const empty = document.getElementById("gallery-empty");

  const plural = (n) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return "работа";
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "работы";
    return "работ";
  };

  sectionBtns.forEach((b) => {
    const s = sections[b.dataset.dir];
    const n = s ? s.items.all.length : 0;
    b.querySelector(".p-section__count").textContent = n ? `${n} ${plural(n)}` : "скоро";
  });

  const list = () => (sections[section] ? sections[section].items[type] : []);

  /* ---------- воспроизведение: только пара роликов и только в покое ----------
     Раньше ролики стартовали прямо в момент появления на экране: браузер
     одновременно тянул файл, поднимал декодер и рисовал кадры прокрутки —
     отсюда заметный рывок. Теперь старт откладывается до остановки
     прокрутки, а координаты считаются один раз, а не на каждом кадре. */
  const visible = new Set();
  let scrolling = false;
  let idleTimer = 0;

  const syncPlayback = () => {
    if (!MAX_PLAYING || reduceMotion) return;
    const mid = window.innerHeight / 2;
    // один замер координат на всю группу, не в цикле прокрутки
    const ranked = [...visible]
      .map((v) => {
        const r = v.getBoundingClientRect();
        return { v, dist: Math.abs(r.top + r.height / 2 - mid) };
      })
      .sort((a, b) => a.dist - b.dist);
    ranked.forEach(({ v }, i) => {
      if (i < MAX_PLAYING) {
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  };

  const onScroll = () => {
    scrolling = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { scrolling = false; syncPlayback(); }, 180);
  };

  const videoIO = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            visible.add(target);
          } else {
            visible.delete(target);
            target.pause();          // уход с экрана останавливаем сразу, это дёшево
          }
        });
        if (!scrolling) syncPlayback();   // запуск только когда прокрутка стоит
      }, { threshold: 0.35 })
    : null;
  if (MAX_PLAYING && !reduceMotion) window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- masonry: row span from aspect ratio ---------- */
  const layout = () => {
    const cs = getComputedStyle(gallery);
    const cols = parseInt(cs.getPropertyValue("--cols"), 10) || 1;
    const gap = parseFloat(cs.columnGap) || 0;
    const row = parseFloat(cs.gridAutoRows) || 4;
    const colW = (gallery.clientWidth - gap * (cols - 1)) / cols;
    gallery.querySelectorAll(".g-item").forEach((el) => {
      const ratio = Number(el.dataset.h) / Number(el.dataset.w);
      el.style.gridRowEnd = `span ${Math.ceil((colW * ratio + gap) / row)}`;
    });
  };
  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  });

  const playIcon = '<span class="g-badge" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z"/></svg></span>';

  const makeItem = (it, index, delay) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "g-item";
    btn.dataset.index = index;
    btn.dataset.w = it.w;
    btn.dataset.h = it.h;
    btn.style.setProperty("--d", `${delay}ms`);
    const label = `${labels[it.kind]}, ${sections[section].title}, ${index + 1}`;
    btn.setAttribute("aria-label", `${label}. Открыть`);
    const sheet = `<span class="g-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>`;
    if (it.kind === "video") {
      // в плитке играет облегчённая копия: полный ролик декодировать
      // ради ячейки шириной ~380 px слишком дорого
      const gridSrc = it.small || it.src;
      btn.innerHTML = `${playIcon}${sheet}<span class="g-frame"><video muted loop playsinline preload="none" poster="${it.poster}"><source src="${gridSrc}" type="video/mp4"></video></span>`;
      if (videoIO) videoIO.observe(btn.querySelector("video"));
    } else {
      const srcset = it.small
        ? ` srcset="${it.small} 420w, ${it.thumb} ${it.w}w" sizes="(max-width: 520px) 92vw, (max-width: 960px) 46vw, 31vw"`
        : "";
      btn.innerHTML = `${sheet}<span class="g-frame"><img src="${it.thumb}"${srcset} alt="${label}" width="${it.w}" height="${it.h}" loading="lazy" decoding="async"></span>`;
    }
    return btn;
  };

  const renderMore = () => {
    const items = list();
    const frag = document.createDocumentFragment();
    const end = Math.min(shown + PAGE, items.length);
    for (let i = shown; i < end; i++) frag.appendChild(makeItem(items[i], i, Math.min((i - shown) * 50, 400)));
    gallery.appendChild(frag);
    shown = end;
    moreWrap.hidden = shown >= items.length;
    empty.hidden = items.length > 0;
    layout();
  };

  const syncControls = () => {
    sectionBtns.forEach((b) => {
      const on = b.dataset.dir === section;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    const items = sections[section] ? sections[section].items : null;
    filterBtns.forEach((b) => {
      const on = b.dataset.filter === type;
      const n = items ? items[b.dataset.filter].length : 0;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
      b.querySelector("sup").textContent = n;
    });
  };

  const render = (animate = true) => {
    syncControls();
    const swap = () => {
      gallery.querySelectorAll("video").forEach((v) => { if (videoIO) videoIO.unobserve(v); v.pause(); });
      gallery.innerHTML = "";
      shown = 0;
      renderMore();
      gallery.classList.remove("is-switching");
    };
    if (animate && !reduceMotion) {
      gallery.classList.add("is-switching");
      setTimeout(swap, 180);
    } else swap();
  };

  sectionBtns.forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.dir === section) return;
    section = b.dataset.dir;
    type = "all";
    render();
  }));

  filterBtns.forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.filter === type) return;
    type = b.dataset.filter;
    render();
  }));

  moreBtn.addEventListener("click", renderMore);

  // "What I do" tiles: open that type in the direction that has the most of it
  document.querySelectorAll("a[data-filter]").forEach((a) =>
    a.addEventListener("click", () => {
      const t = a.dataset.filter;
      if (!sections[section] || !sections[section].items[t].length) {
        const best = Object.entries(sections).sort((x, y) => y[1].items[t].length - x[1].items[t].length)[0];
        if (best) section = best[0];
      }
      type = t;
      render(false);
    }));

  render(false);

  /* ---------- lightbox ---------- */
  const dialog = document.getElementById("lightbox");
  const stage = document.getElementById("lightbox-stage");
  const count = document.getElementById("lightbox-count");
  let lbIndex = 0;
  let lastFocus = null;

  const show = (i) => {
    document.querySelectorAll("video").forEach((v) => {
      if (!stage.contains(v) && !v.paused) v.pause();
    });
    const items = list();
    lbIndex = (i + items.length) % items.length;
    const it = items[lbIndex];
    stage.querySelectorAll("video").forEach((v) => v.pause());
    stage.classList.toggle("is-tall", it.kind !== "video" && it.fh / it.fw > 1.7);
    stage.scrollTop = 0;
    if (it.kind === "video") {
      stage.innerHTML = `<video class="lightbox__media" src="${it.src}" poster="${it.poster}" controls autoplay muted loop playsinline></video>`;
    } else {
      const placeholder = coarse && it.small ? it.small : it.src;
      stage.innerHTML = `<img class="lightbox__media" src="${placeholder}" alt="${labels[it.kind]}, ${sections[section].title}" width="${it.fw}" height="${it.fh}">`;
      if (placeholder !== it.src) {
        const full = new Image();
        full.onload = () => { const el = stage.querySelector("img"); if (el) el.src = it.src; };
        full.src = it.src;
      }
      [items[lbIndex + 1], items[lbIndex - 1]].forEach((n) => {
        if (n && n.kind !== "video") new Image().src = n.src;
      });
    }
    count.textContent = `${sections[section].title} · ${lbIndex + 1} / ${items.length}`;
  };

  // Пока открыт просмотр, всё остальное на странице замирает: иначе рядом
  // с открытым роликом продолжают декодироваться фон первого экрана и
  // видео в сетке, и на слабых машинах это заметно тормозит.
  const pauseBackground = () => {
    document.documentElement.classList.add("lb-open");
    document.querySelectorAll("video").forEach((v) => {
      if (!stage.contains(v)) v.pause();
    });
  };
  const resumeBackground = () => {
    document.documentElement.classList.remove("lb-open");
    const heroVideo = document.querySelector(".hero__video");
    if (heroVideo && heroVideo.currentSrc) {
      const r = heroVideo.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) heroVideo.play().catch(() => {});
    }
    syncPlayback();
  };

  const open = (i) => {
    lastFocus = document.activeElement;
    pauseBackground();
    show(i);
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
  };

  dialog.addEventListener("close", () => {
    stage.querySelectorAll("video").forEach((v) => v.pause());
    stage.innerHTML = "";
    document.documentElement.style.overflow = "";
    resumeBackground();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });

  gallery.addEventListener("click", (e) => {
    const item = e.target.closest(".g-item");
    if (item) open(Number(item.dataset.index));
  });

  dialog.addEventListener("click", (e) => {
    const action = e.target.closest("[data-lb]")?.dataset.lb;
    if (action === "close" || e.target === stage) dialog.close();
    else if (action === "prev") show(lbIndex - 1);
    else if (action === "next") show(lbIndex + 1);
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); show(lbIndex + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(lbIndex - 1); }
  });

  // swipe left/right on touch screens
  let startX = 0, startY = 0;
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; });
  stage.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse") return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(lbIndex + (dx < 0 ? 1 : -1));
  });

  /* ---------- live portrait ---------- */
  const live = document.querySelector(".about__live");
  if (live && videoIO && !reduceMotion) {
    live.addEventListener("playing", () => live.classList.add("is-playing"), { once: true });
    videoIO.observe(live);
  }
})();
