<!doctype html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Italianno&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="kolory.css" />
  <link rel="stylesheet" href="modal.css" /> 
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
  <title>Butik</title>
</head>
<body>
  <div class="content">
    <header>
      <div class="butik"><a href="index.php"><h1>Butik</h1></a></div>
      <div class="wyszukaj">
        <form action="" method="get" id="searchForm">
          <input type="search" name="find" id="find" placeholder="Wyszukaj buty..." />
          <div class="search-buttons">
            <button type="submit" class="search-btn">Szukaj</button>
            <button type="button" class="clear-btn" id="clearSearchBtn">Wyczyść</button>
          </div>
        </form>
      </div>
      <div class="zaloguj">
        <button class="zal"><a href="Zaloguj.html">Zaloguj się</a></button>
      </div>
    </header>
  </div>

  <div class="main-container">
    <aside class="lewy">
      <ul id="categoryList">
        <li class="category-option active" data-category="">Wszystkie</li>
        <li class="category-option" data-category="Botki">Botki</li>
        <li class="category-option" data-category="Półbuty">Półbuty</li>
        <li class="category-option" data-category="Sandały">Sandały</li>
        <li class="category-option" data-category="Trampki">Trampki</li>
        <li class="category-option" data-category="Obuwie sportowe">Obuwie sportowe</li>
        <li class="category-option" data-category="Szpilki">Szpilki</li>
        <li class="category-option" data-category="Baleriny">Baleriny</li>
        <li class="category-option" data-category="Mokasyny">Mokasyny</li>
        <li class="category-option" data-sort="asc">Od najtańszej</li>
        <li class="category-option" data-sort="desc">Od najdroższej</li>
      </ul>
    </aside>

    <main class="prawy">
      <nav>
        <div class="gorny">
          <ul>
            <li class="filter-group">
              <span class="label">Wybierz rozmiar</span>
              <ul class="dropdown">
                <li data-filter="rozmiar" data-value="36">36</li>
                <li data-filter="rozmiar" data-value="37">37</li>
                <li data-filter="rozmiar" data-value="38">38</li>
                <li data-filter="rozmiar" data-value="39">39</li>
                <li data-filter="rozmiar" data-value="40">40</li>
                <li data-filter="rozmiar" data-value="41">41</li>
                <li data-filter="rozmiar" data-value="42">42</li>
                <li data-filter="rozmiar" data-value="43">43</li>
              </ul>
            </li>
            <li class="filter-group">
              <span class="label">Wybierz kolor</span>
              <ul class="dropdown">
                <li data-filter="kolor" data-value="Czarny">Czarny</li>
                <li data-filter="kolor" data-value="Biały">Biały</li>
                <li data-filter="kolor" data-value="Beżowy">Beżowy</li>
                <li data-filter="kolor" data-value="Czerwony">Czerwony</li>
                <li data-filter="kolor" data-value="Brązowy">Brązowy</li>
              </ul>
            </li>
            <li class="filter-group">
              <span class="label">Wybierz rodzaj obcasa</span>
              <ul class="dropdown">
                <li data-filter="rodzaj-obcasa" data-value="Szpilka">Szpilka</li>
                <li data-filter="rodzaj-obcasa" data-value="Słupek">Słupek</li>
                <li data-filter="rodzaj-obcasa" data-value="Kloc">Kloc</li>
                <li data-filter="rodzaj-obcasa" data-value="Koturn">Koturn</li>
                <li data-filter="rodzaj-obcasa" data-value="Płaski">Płaski</li>
              </ul>
            </li>
            <li class="filter-group">
              <span class="label">Wybierz wysokość obcasa</span>
              <ul class="dropdown">
                <li data-filter="wysokosc-obcasa" data-value="0-3 cm">0–3 cm</li>
                <li data-filter="wysokosc-obcasa" data-value="4-6 cm">4–6 cm</li>
                <li data-filter="wysokosc-obcasa" data-value="7-9 cm">7–9 cm</li>
                <li data-filter="wysokosc-obcasa" data-value="10+ cm">10+ cm</li>
              </ul>
            </li>
            <li class="filter-group">
              <span class="label">Wybierz materiał</span>
              <ul class="dropdown">
                <li data-filter="material" data-value="Skóra naturalna">Skóra naturalna</li>
                <li data-filter="material" data-value="Zamsz">Zamsz</li>
                <li data-filter="material" data-value="Eko-skóra">Eko-skóra</li>
                <li data-filter="material" data-value="Tkanina">Tkanina</li>
                <li data-filter="material" data-value="Lakierowana">Lakierowana</li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div id="active-filters" class="active-filters">
        <span>Aktywne filtry: <strong id="filter-summary">Brak</strong></span>
        <button type="button" id="clearFiltersBtn">Wyczyść filtry</button>
      </div>

      <p id="productsStatus" role="status" aria-live="polite">Ładowanie produktów...</p>
      <div class="foto" id="productsGrid"></div>
    </main>
  </div>
  <script src="Node.js"></script>
  <script src="modal.js"></script>
</body>
</html>
