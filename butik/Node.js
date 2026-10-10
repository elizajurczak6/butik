// Frontend butiku: pobieranie produktów z produkty.php i działające filtry.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productsGrid");
  const status = document.getElementById("productsStatus");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("find");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  const filterSummary = document.getElementById("filter-summary");

  let products = [];
  const filters = {
    category: "",
    rozmiar: "",
    kolor: "",
    "rodzaj-obcasa": "",
    "wysokosc-obcasa": "",
    material: "",
    sort: "",
    search: ""
  };

  const filterLabels = {
    category: "Kategoria",
    rozmiar: "Rozmiar",
    kolor: "Kolor",
    "rodzaj-obcasa": "Rodzaj obcasa",
    "wysokosc-obcasa": "Wysokość obcasa",
    material: "Materiał"
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  async function loadProducts() {
    try {
      const response = await fetch("produkty.php", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Błąd pobierania danych.");
      products = data.products || [];
      renderProducts();
    } catch (error) {
      status.textContent = (error.message || "Nie udało się pobrać produktów.") +
        " Upewnij się, że uruchamiasz stronę przez serwer PHP (np. XAMPP), a nie otwierasz pliku bezpośrednio.";
      grid.innerHTML = "";
    }
  }

  function getFilteredProducts() {
    const needle = filters.search.trim().toLocaleLowerCase("pl");
    let result = products.filter(product => {
      const searchable = [
        product.nazwa, product.krotki_opis, product.kategoria,
        product.kolor, product.material, product.rodzaj_obcasa
      ].join(" ").toLocaleLowerCase("pl");

      return (!filters.category || product.kategoria === filters.category) &&
        (!filters.rozmiar || (product.rozmiary || []).includes(Number(filters.rozmiar))) &&
        (!filters.kolor || product.kolor === filters.kolor) &&
        (!filters["rodzaj-obcasa"] || product.rodzaj_obcasa === filters["rodzaj-obcasa"]) &&
        (!filters["wysokosc-obcasa"] || product.wysokosc_obcasa === filters["wysokosc-obcasa"]) &&
        (!filters.material || product.material === filters.material) &&
        (!needle || searchable.includes(needle));
    });

    if (filters.sort === "asc") result.sort((a, b) => a.cena - b.cena);
    if (filters.sort === "desc") result.sort((a, b) => b.cena - a.cena);
    return result;
  }

  function renderProducts() {
    const visible = getFilteredProducts();
    status.textContent = visible.length
      ? `Znaleziono produktów: ${visible.length}`
      : "Nie znaleziono butów spełniających wybrane kryteria.";

    grid.innerHTML = visible.map(product => {
      const sizes = (product.rozmiary || []).join(", ");
      const image = product.zdjecie_url || "";
      return `
        <article class="fotoBox">
          <div class="pict">
            <img class="pictBut" src="${escapeHtml(image)}" alt="${escapeHtml(product.nazwa)}"
                 loading="lazy" onerror="this.onerror=null;this.src='';this.alt='Brak zdjęcia';this.style.minHeight='180px';" />
          </div>
          <span class="description">${escapeHtml(product.nazwa)}</span>
          <p class="product-short-description">${escapeHtml(product.krotki_opis)}</p>
          <p class="price">${Number(product.cena).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł</p>
          <p class="product-details">
            ${escapeHtml(product.kategoria)} · ${escapeHtml(product.kolor)} · ${escapeHtml(product.material)}
          </p>
          <p class="product-sizes">Rozmiary: ${escapeHtml(sizes || "brak danych")}</p>
        </article>`;
    }).join("");

    updateFilterSummary();
    document.querySelectorAll("#categoryList [data-category]").forEach(item => {
      item.classList.toggle("active", item.dataset.category === filters.category);
    });
    document.querySelectorAll(".dropdown [data-filter]").forEach(item => {
      const key = item.dataset.filter;
      item.classList.toggle("selected", filters[key] === item.dataset.value);
    });
  }

  function updateFilterSummary() {
    const active = [];
    if (filters.category) active.push(`${filterLabels.category}: ${filters.category}`);
    for (const key of ["rozmiar", "kolor", "rodzaj-obcasa", "wysokosc-obcasa", "material"]) {
      if (filters[key]) active.push(`${filterLabels[key]}: ${filters[key]}`);
    }
    if (filters.search) active.push(`Szukaj: ${filters.search}`);
    if (filters.sort === "asc") active.push("Cena: od najtańszej");
    if (filters.sort === "desc") active.push("Cena: od najdroższej");
    filterSummary.textContent = active.length ? active.join(" | ") : "Brak";
  }

  document.querySelectorAll(".dropdown [data-filter]").forEach(item => {
    item.addEventListener("click", () => {
      const key = item.dataset.filter;
      filters[key] = filters[key] === item.dataset.value ? "" : item.dataset.value;
      renderProducts();
    });
  });

  document.querySelectorAll("#categoryList [data-category]").forEach(item => {
    item.addEventListener("click", () => {
      filters.category = item.dataset.category || "";
      renderProducts();
    });
  });

  document.querySelectorAll("#categoryList [data-sort]").forEach(item => {
    item.addEventListener("click", () => {
      filters.sort = item.dataset.sort;
      renderProducts();
    });
  });

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    filters.search = searchInput.value.trim();
    renderProducts();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    filters.search = "";
    renderProducts();
  });

  clearFiltersBtn.addEventListener("click", () => {
    Object.keys(filters).forEach(key => filters[key] = "");
    searchInput.value = "";
    renderProducts();
  });

  loadProducts();
});
