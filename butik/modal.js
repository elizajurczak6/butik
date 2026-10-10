/* ===== MODAL ZAKUPU =====
   Działa na kartach .fotoBox (zdjęcie .pictBut, nazwa .description, cena .price).
   Wystarczy dołączyć ten plik PO skrypcie Node.js. */
(function () {
  const SIZES = [36, 37, 38, 39, 40, 41, 42, 43];

  // --- budowa modala ---
  const overlay = document.createElement("div");
  overlay.className = "buy-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="buy-modal" role="dialog" aria-modal="true" aria-labelledby="buyName">
      <button type="button" class="buy-close" aria-label="Zamknij">&times;</button>
      <div class="buy-image"><img id="buyImg" src="" alt="" /></div>
      <div class="buy-body">

        <!-- KROK 1: wybór -->
        <div class="buy-step" id="stepChoose">
          <h2 id="buyName"></h2>
          <div class="buy-price" id="buyPrice"></div>

          <span class="buy-label">Rozmiar</span>
          <div class="buy-sizes" id="buySizes"></div>

          <span class="buy-label">Ilość</span>
          <div class="buy-qty">
            <button type="button" id="qtyMinus" aria-label="Mniej">−</button>
            <span id="qtyVal">1</span>
            <button type="button" id="qtyPlus" aria-label="Więcej">+</button>
          </div>

          <div class="buy-total"><span>Razem</span><strong id="buyTotal"></strong></div>
          <div class="buy-error" id="chooseError"></div>
          <div class="buy-actions">
            <button type="button" class="buy-secondary" data-close>Anuluj</button>
            <button type="button" class="buy-primary" id="toCheckout">Kup teraz</button>
          </div>
        </div>

        <!-- KROK 2: dane do zamówienia -->
        <div class="buy-step" id="stepCheckout" hidden>
          <h2>Dane do zamówienia</h2>
          <div class="buy-price" id="summaryLine"></div>
          <form class="buy-form" id="checkoutForm" novalidate>
            <input type="text" name="imie" placeholder="Imię i nazwisko" required />
            <input type="email" name="email" placeholder="E-mail" required />
            <input type="text" name="adres" placeholder="Adres (ulica, nr domu)" required />
            <input type="text" name="miasto" placeholder="Kod pocztowy i miasto" required />
            <select name="platnosc">
              <option value="blik">BLIK</option>
              <option value="karta">Karta płatnicza</option>
              <option value="przelew">Szybki przelew</option>
              <option value="pobranie">Płatność przy odbiorze</option>
            </select>
            <div class="buy-error" id="checkoutError"></div>
            <div class="buy-actions">
              <button type="button" class="buy-secondary" id="backToChoose">Wstecz</button>
              <button type="submit" class="buy-primary">Zamawiam i płacę</button>
            </div>
          </form>
        </div>

        <!-- KROK 3: potwierdzenie -->
        <div class="buy-step" id="stepDone" hidden>
          <div class="buy-success">
            <div class="check">✓</div>
            <h3>Dziękujemy za zamówienie!</h3>
            <p id="doneText"></p>
            <button type="button" class="buy-primary" data-close style="width:100%">Wróć do sklepu</button>
          </div>
        </div>

      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = (id) => overlay.querySelector("#" + id);
  const steps = { choose: $("stepChoose"), checkout: $("stepCheckout"), done: $("stepDone") };

  const state = { name: "", img: "", price: 0, size: null, qty: 1 };

  const fmt = (n) =>
    n.toLocaleString("pl-PL", { style: "currency", currency: "PLN" });

  function parsePrice(text) {
    const n = parseFloat(
      (text || "").replace(/\s/g, "").replace(/[^\d,.]/g, "").replace(",", ".")
    );
    return isNaN(n) ? 0 : n;
  }

  function showStep(name) {
    Object.entries(steps).forEach(([k, el]) => (el.hidden = k !== name));
  }

  function renderSizes() {
    const box = $("buySizes");
    box.innerHTML = "";
    SIZES.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "size-btn" + (state.size === s ? " selected" : "");
      b.textContent = s;
      b.addEventListener("click", () => {
        state.size = s;
        $("chooseError").textContent = "";
        renderSizes();
      });
      box.appendChild(b);
    });
  }

  function updateTotal() {
    $("qtyVal").textContent = state.qty;
    $("buyTotal").textContent = fmt(state.price * state.qty);
  }

  // --- otwieranie / zamykanie ---
  function openModal(card) {
    const img = card.querySelector(".pictBut");
    const name = card.querySelector(".description");
    const price = card.querySelector(".price");

    state.name = name ? name.textContent.trim() : "Produkt";
    state.img = img ? img.src : "";
    state.price = parsePrice(price ? price.textContent : "");
    state.size = null;
    state.qty = 1;

    $("buyImg").src = state.img;
    $("buyImg").alt = state.name;
    $("buyName").textContent = state.name;
    $("buyPrice").textContent = price ? price.textContent.trim() : fmt(state.price);
    $("chooseError").textContent = "";
    $("checkoutError").textContent = "";
    $("checkoutForm").reset();

    renderSizes();
    updateTotal();
    showStep("choose");

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // --- zdarzenia ---
  // faza przechwytywania: blokuje ewentualne przejście linku .fotoBox-link
  document.addEventListener(
    "click",
    (e) => {
      const card = e.target.closest(".fotoBox");
      if (!card || overlay.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      openModal(card);
    },
    true
  );

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".buy-close, [data-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  $("qtyMinus").addEventListener("click", () => {
    if (state.qty > 1) { state.qty--; updateTotal(); }
  });
  $("qtyPlus").addEventListener("click", () => {
    if (state.qty < 10) { state.qty++; updateTotal(); }
  });

  $("toCheckout").addEventListener("click", () => {
    if (!state.size) {
      $("chooseError").textContent = "Wybierz rozmiar, aby kontynuować.";
      return;
    }
    $("summaryLine").textContent =
      `${state.name}, rozm. ${state.size} × ${state.qty} = ${fmt(state.price * state.qty)}`;
    showStep("checkout");
  });

  $("backToChoose").addEventListener("click", () => showStep("choose"));

  $("checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    if (!data.imie.trim() || !data.adres.trim() || !data.miasto.trim()) {
      $("checkoutError").textContent = "Uzupełnij wszystkie dane.";
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      $("checkoutError").textContent = "Podaj poprawny adres e-mail.";
      return;
    }

    const order = {
      produkt: state.name,
      rozmiar: state.size,
      ilosc: state.qty,
      suma: state.price * state.qty,
      ...data,
    };

    // TODO: tutaj wyślij zamówienie do swojego backendu, np.:
    // await fetch("zamow.php", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(order),
    // });
    console.log("Zamówienie:", order);

    $("doneText").textContent =
      `${state.name} (rozm. ${state.size}, ${state.qty} szt.) – łącznie ${fmt(order.suma)}. ` +
      `Potwierdzenie wyślemy na ${data.email}.`;
    showStep("done");
  });
})();
