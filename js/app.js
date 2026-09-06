(function () {
  const state = {
    shops: [],
    trade: "all",
    ownership: "all",
    tag: "all",
    query: "",
    selectedId: null
  };

  const els = {
    cards: document.getElementById("cards"),
    count: document.getElementById("result-count"),
    search: document.getElementById("search"),
    drawer: document.getElementById("drawer"),
    backdrop: document.getElementById("drawer-backdrop"),
    drawerBody: document.getElementById("drawer-body"),
    tipForm: document.getElementById("tip-form"),
    tipShop: document.getElementById("tip-shop"),
    tipOther: document.getElementById("tip-other"),
    tipOtherWrap: document.getElementById("tip-other-wrap"),
    tipName: document.getElementById("tip-name"),
    tipNote: document.getElementById("tip-note"),
    tipError: document.getElementById("tip-error"),
    tipList: document.getElementById("tip-list")
  };

  let tips = [];

  function shopsFromEmbedded() {
    return (window.CALL_LIST_828 && window.CALL_LIST_828.shops) || [];
  }

  function label(value) {
    return {
      hvac: "HVAC",
      electrical: "Electrical",
      plumbing: "Plumbing",
      auto: "Auto",
      family: "Family",
      esop: "Employee-owned (ESOP)",
      local: "Local",
      "heat-pump": "Heat pump",
      "old-house": "Old house",
      "knob-and-tube": "Knob-and-tube",
      "older-cars": "Older cars",
      mobile: "Mobile"
    }[value] || value;
  }

  function telHref(phone) {
    return phone ? "tel:+1" + phone.replace(/\D/g, "") : "";
  }

  function mapsHref(shop) {
    const q = encodeURIComponent(shop.address + ", " + shop.name);
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  function reviewsHref(shop) {
    const q = encodeURIComponent(shop.name + " " + shop.address + " reviews");
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  function matches(shop) {
    if (state.trade !== "all" && !shop.trades.includes(state.trade)) return false;
    if (state.ownership !== "all" && !shop.ownership.includes(state.ownership)) return false;
    if (state.tag !== "all" && !shop.tags.includes(state.tag)) return false;
    if (!state.query) return true;
    const hay = [
      shop.name,
      shop.notes,
      shop.address,
      shop.serviceArea,
      shop.phone,
      ...(shop.quotes || []).map(function (q) { return q.quote + " " + q.author; })
    ].join(" ").toLowerCase();
    return hay.indexOf(state.query) !== -1;
  }

  function pill(kind, value) {
    return '<span class="pill ' + kind + '">' + label(value) + "</span>";
  }

  function quoteBlock(quote) {
    if (!quote) return "";
    return (
      '<blockquote class="quote"><p>“' + escapeHtml(quote.quote) + '”</p>' +
      '<cite>' + escapeHtml(quote.author) + " · " + formatDate(quote.date) +
      ' · <a href="' + quote.permalink + '" target="_blank" rel="noopener">permalink</a></cite></blockquote>'
    );
  }

  function ownershipPills(shop) {
    return shop.ownership
      .filter(function (o) { return o !== "local"; })
      .map(function (o) { return pill(o, o); })
      .join("");
  }

  function formatDate(iso) {
    const parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[Number(parts[1]) - 1] + " " + Number(parts[2]) + ", " + parts[0];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCards() {
    const visible = state.shops.filter(matches);
    els.count.textContent = visible.length + " matching · " + state.shops.length + " total";
    if (!visible.length) {
      els.cards.innerHTML = '<p class="empty">Nothing matches those filters. Clear one and try again.</p>';
      return;
    }
    els.cards.innerHTML = visible.map(function (shop) {
      const leadQuote = shop.quotes && shop.quotes[0];
      return (
        '<button class="card" type="button" data-id="' + shop.id + '">' +
          '<div class="card-top">' +
            "<div><h2>" + escapeHtml(shop.name) + "</h2></div>" +
            '<div class="pills">' +
              shop.trades.map(function (t) { return pill("trade", t); }).join("") +
              ownershipPills(shop) +
            "</div>" +
          "</div>" +
          (shop.skipWindow
            ? '<div class="caution-banner"><strong>Skip this window.</strong> ' + escapeHtml(shop.skipWindowNote) + "</div>"
            : "") +
          quoteBlock(leadQuote) +
          '<div class="pills">' + shop.tags.map(function (t) { return pill("tag", t); }).join("") + "</div>" +
        "</button>"
      );
    }).join("");
  }

  function openDrawer(id) {
    const shop = state.shops.find(function (s) { return s.id === id; });
    if (!shop) return;
    state.selectedId = id;
    const licenseLinks = [
      shop.licenseLookup
        ? '<a class="secondary" href="' + shop.licenseLookup + '" target="_blank" rel="noopener">NC license lookup</a>'
        : "",
      shop.licenseLookupElectrical
        ? '<a class="secondary" href="' + shop.licenseLookupElectrical + '" target="_blank" rel="noopener">Electrical license lookup</a>'
        : ""
    ].join("");
    els.drawerBody.innerHTML =
      "<header>" +
        "<div>" +
          '<p class="eyebrow">' + shop.trades.map(label).join(" · ") + "</p>" +
          "<h2>" + escapeHtml(shop.name) + "</h2>" +
        "</div>" +
        '<button class="close" type="button" data-close aria-label="Close">×</button>' +
      "</header>" +
      (shop.skipWindow
        ? '<div class="caution-banner"><strong>Skip this window.</strong> ' + escapeHtml(shop.skipWindowNote) + "</div>"
        : "") +
      '<div class="pills drawer-pills">' +
        ownershipPills(shop) +
        shop.tags.map(function (t) { return pill("tag", t); }).join("") +
      "</div>" +
      '<div class="drawer-actions">' +
        (shop.phone ? '<a href="' + telHref(shop.phone) + '">Call ' + escapeHtml(shop.phone) + "</a>" : "") +
        (shop.website ? '<a class="secondary" href="' + shop.website + '" target="_blank" rel="noopener">Official site</a>' : "") +
        '<a class="secondary" href="' + mapsHref(shop) + '" target="_blank" rel="noopener">Map</a>' +
        '<a class="secondary" href="' + reviewsHref(shop) + '" target="_blank" rel="noopener">Google reviews</a>' +
        licenseLinks +
      "</div>" +
      "<p><strong>Address.</strong> " + escapeHtml(shop.address) +
        (shop.alsoAt ? "<br>Also " + escapeHtml(shop.alsoAt) : "") + "</p>" +
      "<p><strong>Service area.</strong> " + escapeHtml(shop.serviceArea) + "</p>" +
      (shop.licenses && shop.licenses.length
        ? "<p><strong>License nos. on the official site.</strong> " + shop.licenses.map(escapeHtml).join(", ") + "</p>"
        : "") +
      "<p><strong>" + escapeHtml(shop.licenseBoard) + ".</strong> Confirm the name and status before you hire.</p>" +
      '<p class="notes">' + escapeHtml(shop.notes) + "</p>" +
      (shop.quotes && shop.quotes.length
        ? '<div class="quotes">' + shop.quotes.map(quoteBlock).join("") + "</div>"
        : "");
    els.drawer.classList.add("open");
    els.backdrop.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    els.drawer.querySelector("[data-close]").focus();
  }

  function closeDrawer() {
    els.drawer.classList.remove("open");
    els.backdrop.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    state.selectedId = null;
  }

  function bindFilters() {
    document.querySelectorAll("[data-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const group = button.getAttribute("data-filter");
        const value = button.getAttribute("data-value");
        state[group] = value;
        document.querySelectorAll('[data-filter="' + group + '"]').forEach(function (peer) {
          peer.setAttribute("aria-pressed", String(peer === button));
        });
        renderCards();
      });
    });
    document.getElementById("reset-filters").addEventListener("click", function () {
      state.trade = "all";
      state.ownership = "all";
      state.tag = "all";
      state.query = "";
      els.search.value = "";
      document.querySelectorAll("[data-filter]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-value") === "all"));
      });
      renderCards();
    });
    els.search.addEventListener("input", function () {
      state.query = els.search.value.trim().toLowerCase();
      renderCards();
    });
  }

  function bindDrawer() {
    els.cards.addEventListener("click", function (event) {
      const card = event.target.closest("[data-id]");
      if (card) openDrawer(card.getAttribute("data-id"));
    });
    els.backdrop.addEventListener("click", closeDrawer);
    els.drawer.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) closeDrawer();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });
  }

  function renderTips() {
    if (!tips.length) {
      els.tipList.innerHTML = "<li>No tips yet.</li>";
      return;
    }
    els.tipList.innerHTML = tips.map(function (tip) {
      return "<li><strong>" + escapeHtml(tip.shop) + "</strong> · " +
        escapeHtml(tip.when) + "<br>" + escapeHtml(tip.note) +
        (tip.name ? "<br><em>" + escapeHtml(tip.name) + "</em>" : "") + "</li>";
    }).join("");
  }

  function showTipError(message) {
    if (!els.tipError) return;
    if (!message) {
      els.tipError.hidden = true;
      els.tipError.textContent = "";
      return;
    }
    els.tipError.hidden = false;
    els.tipError.textContent = message;
  }

  function syncOtherShopField() {
    const isOther = els.tipShop.value === "Other";
    els.tipOtherWrap.hidden = !isOther;
    els.tipOther.required = isOther;
    if (!isOther) els.tipOther.value = "";
  }

  function selectedShopName() {
    if (els.tipShop.value !== "Other") return els.tipShop.value.trim();
    return els.tipOther.value.trim();
  }

  function bindTips() {
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose a shop";
    els.tipShop.appendChild(blank);
    state.shops.forEach(function (shop) {
      const option = document.createElement("option");
      option.value = shop.name;
      option.textContent = shop.name;
      els.tipShop.appendChild(option);
    });
    const other = document.createElement("option");
    other.value = "Other";
    other.textContent = "Other";
    els.tipShop.appendChild(other);
    syncOtherShopField();
    els.tipShop.addEventListener("change", syncOtherShopField);
    els.tipForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const shop = selectedShopName().slice(0, 80);
      const name = els.tipName.value.trim().slice(0, 80);
      const note = els.tipNote.value.trim().slice(0, 500);
      if (!shop) {
        showTipError(els.tipShop.value === "Other"
          ? "Name the shop."
          : "Pick a shop.");
        return;
      }
      if (!note) {
        showTipError("Write a tip first.");
        return;
      }
      showTipError("");
      tips.unshift({
        shop: shop,
        name: name,
        note: note,
        when: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      });
      tips = tips.slice(0, 40);
      els.tipForm.reset();
      syncOtherShopField();
      renderTips();
    });
  }

  function init(shops) {
    state.shops = shops;
    bindFilters();
    bindDrawer();
    bindTips();
    renderCards();
    renderTips();
  }

  const embedded = shopsFromEmbedded();
  if (embedded.length) {
    init(embedded);
    return;
  }

  // Fallback when opened over http(s) without the embedded file.
  fetch("data/shops.json")
    .then(function (res) { return res.json(); })
    .then(function (data) { init(data.shops || []); })
    .catch(function () {
      els.cards.innerHTML = '<p class="empty">Could not load shops. Check that the shop data file is next to this page.</p>';
    });
})();
