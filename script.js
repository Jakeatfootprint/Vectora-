/* Vectora.work — site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * CONFIG
   *
   * GOOGLE_FORM_URL — paste your Google Form link here.
   *   Google Forms → Send → < > (embed) → copy the src URL, e.g.
   *   https://docs.google.com/forms/d/e/1FAIpQLSd.../viewform?embedded=true
   *   Must be a docs.google.com/forms/... /viewform link (not /edit, not a
   *   forms.gle short link). Leave empty to show the "opens shortly" notice.
   * ---------------------------------------------------------------- */
  var GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeM2jYyTttmxVGzeU533OvmUYPOI4dtza57rzyWyxT1ebAHEA/viewform";

  function isGoogleFormUrl(value) {
    try {
      var url = new URL(value);
      return (
        url.protocol === "https:" &&
        url.hostname === "docs.google.com" &&
        url.pathname.indexOf("/forms/") === 0 &&
        /\/viewform$/.test(url.pathname)
      );
    } catch (err) {
      return false;
    }
  }

  function mountIntakeForm() {
    var shell = document.getElementById("intake-form");
    var fallback = document.getElementById("intake-fallback");
    if (!shell || !fallback) return;

    if (!isGoogleFormUrl(GOOGLE_FORM_URL)) {
      if (GOOGLE_FORM_URL) {
        console.warn("GOOGLE_FORM_URL was rejected: it must be an https://docs.google.com/forms/.../viewform link.");
      }
      fallback.hidden = false;
      return;
    }

    var url = new URL(GOOGLE_FORM_URL);
    url.searchParams.set("embedded", "true");

    var frame = document.createElement("iframe");
    frame.src = url.toString();
    frame.title = "Vectora.work new client intake form";
    frame.loading = "lazy";
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    shell.appendChild(frame);
    fallback.hidden = true;

    var alt = document.getElementById("intake-alt");
    var open = document.getElementById("intake-open");
    if (alt && open) {
      open.href = GOOGLE_FORM_URL;
      alt.hidden = false;
    }
  }

  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function wireReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountIntakeForm();
    wireNav();
    wireReveal();
    setYear();
  });
})();
