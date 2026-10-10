-- Baza danych butiku obuwniczego
-- Przeznaczenie: MySQL 8.0+ (np. XAMPP / phpMyAdmin)
-- Uruchom cały plik w phpMyAdmin w zakładce SQL.
-- Zdjęcia są zapisane jako adresy URL; do projektu można później pobrać je lokalnie.

CREATE DATABASE IF NOT EXISTS butik_obuwie
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_polish_ci;

USE butik_obuwie;

-- Usunięcie tabel w odpowiedniej kolejności pozwala uruchamiać skrypt ponownie.
DROP TABLE IF EXISTS produkt_rozmiary;
DROP TABLE IF EXISTS produkty;
DROP TABLE IF EXISTS kategorie;
DROP TABLE IF EXISTS kolory;
DROP TABLE IF EXISTS materialy;
DROP TABLE IF EXISTS rodzaje_obcasa;
DROP TABLE IF EXISTS wysokosci_obcasa;

CREATE TABLE kategorie (
    id_kategorii INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE kolory (
    id_koloru INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE materialy (
    id_materialu INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE rodzaje_obcasa (
    id_rodzaju_obcasa INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE wysokosci_obcasa (
    id_wysokosci INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE produkty (
    id_produktu INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(120) NOT NULL,
    kategoria_id INT UNSIGNED NOT NULL,
    krotki_opis VARCHAR(500) NOT NULL,
    cena DECIMAL(10,2) UNSIGNED NOT NULL,
    zdjecie_url VARCHAR(500) NOT NULL,
    kolor_id INT UNSIGNED NOT NULL,
    material_id INT UNSIGNED NOT NULL,
    rodzaj_obcasa_id INT UNSIGNED NOT NULL,
    wysokosc_obcasa_id INT UNSIGNED NOT NULL,
    aktywny TINYINT(1) NOT NULL DEFAULT 1,
    data_dodania TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produkt_kategoria FOREIGN KEY (kategoria_id) REFERENCES kategorie(id_kategorii),
    CONSTRAINT fk_produkt_kolor FOREIGN KEY (kolor_id) REFERENCES kolory(id_koloru),
    CONSTRAINT fk_produkt_material FOREIGN KEY (material_id) REFERENCES materialy(id_materialu),
    CONSTRAINT fk_produkt_rodzaj_obcasa FOREIGN KEY (rodzaj_obcasa_id) REFERENCES rodzaje_obcasa(id_rodzaju_obcasa),
    CONSTRAINT fk_produkt_wysokosc_obcasa FOREIGN KEY (wysokosc_obcasa_id) REFERENCES wysokosci_obcasa(id_wysokosci),
    CONSTRAINT chk_cena_dodatnia CHECK (cena >= 0),
    INDEX idx_produkty_kategoria (kategoria_id),
    INDEX idx_produkty_cena (cena),
    INDEX idx_produkty_kolor (kolor_id),
    INDEX idx_produkty_material (material_id)
);

CREATE TABLE produkt_rozmiary (
    produkt_id INT UNSIGNED NOT NULL,
    rozmiar TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (produkt_id, rozmiar),
    CONSTRAINT fk_rozmiar_produkt FOREIGN KEY (produkt_id)
        REFERENCES produkty(id_produktu) ON DELETE CASCADE,
    CONSTRAINT chk_rozmiar CHECK (rozmiar BETWEEN 20 AND 50)
);

INSERT INTO kategorie (nazwa) VALUES
('Botki'), ('Półbuty'), ('Sandały'), ('Trampki'),
('Obuwie sportowe'), ('Szpilki'), ('Baleriny'), ('Mokasyny');

INSERT INTO kolory (nazwa) VALUES
('Czarny'), ('Biały'), ('Beżowy'), ('Czerwony'), ('Brązowy');

INSERT INTO materialy (nazwa) VALUES
('Skóra naturalna'), ('Zamsz'), ('Eko-skóra'), ('Tkanina'), ('Lakierowana');

INSERT INTO rodzaje_obcasa (nazwa) VALUES
('Szpilka'), ('Słupek'), ('Kloc'), ('Koturn'), ('Płaski');

INSERT INTO wysokosci_obcasa (nazwa) VALUES
('0-3 cm'), ('4-6 cm'), ('7-9 cm'), ('10+ cm');

-- Przykładowy katalog. Zdjęcia to zewnętrzne adresy URL.
INSERT INTO produkty
(nazwa, kategoria_id, krotki_opis, cena, zdjecie_url, kolor_id, material_id, rodzaj_obcasa_id, wysokosc_obcasa_id)
VALUES
('Botki Classic Black', 1, 'Czarne botki na co dzień, z wygodnym zamkiem i stabilną podeszwą.', 249.99, 'images/shoes/botki-classic-black.svg', 1, 1, 2, 2),
('Botki Zamszowe Beżowe', 1, 'Miękkie zamszowe botki w beżowym kolorze, pasujące do jesiennych stylizacji.', 279.00, 'images/shoes/botki-zamsz-bezowe.svg', 3, 2, 2, 2),
('Półbuty City Brown', 2, 'Klasyczne brązowe półbuty o eleganckim fasonie.', 229.99, 'images/shoes/polbuty-city-brown.svg', 5, 1, 5, 1),
('Półbuty Black Office', 2, 'Uniwersalne czarne półbuty do pracy i na formalne spotkania.', 219.00, 'images/shoes/polbuty-black-office.svg', 1, 3, 5, 1),
('Sandały Summer Beige', 3, 'Lekkie sandały z regulowanym paskiem, idealne na ciepłe dni.', 149.99, 'images/shoes/sandaly-summer-beige.svg', 3, 3, 5, 1),
('Sandały Red Elegance', 3, 'Czerwone sandały na niewysokim obcasie na letnie wyjścia.', 179.00, 'images/shoes/sandaly-red-elegance.svg', 4, 3, 2, 2),
('Trampki White Basic', 4, 'Białe, lekkie trampki pasujące do jeansów i codziennych zestawów.', 119.99, 'images/shoes/trampki-white-basic.svg', 2, 4, 5, 1),
('Trampki Black Street', 4, 'Czarne trampki z tekstylną cholewką i gumową podeszwą.', 129.99, 'images/shoes/trampki-black-street.svg', 1, 4, 5, 1),
('Sneakers Active White', 5, 'Białe buty sportowe do spacerów, treningu i codziennego noszenia.', 199.99, 'images/shoes/sneakers-active-white.svg', 2, 4, 5, 1),
('Sneakers Red Run', 5, 'Sportowe buty z czerwonymi akcentami i amortyzującą podeszwą.', 239.00, 'images/shoes/sneakers-red-run.svg', 4, 4, 5, 1),
('Szpilki Black Night', 6, 'Czarne szpilki o smukłym fasonie na eleganckie okazje.', 289.99, 'images/shoes/szpilki-black-night.svg', 1, 5, 1, 3),
('Szpilki Red Glamour', 6, 'Czerwone lakierowane szpilki, które podkreślą wieczorową stylizację.', 319.00, 'images/shoes/szpilki-red-glamour.svg', 4, 5, 1, 4),
('Baleriny Soft Beige', 7, 'Wygodne beżowe baleriny z zaokrąglonym noskiem.', 139.00, 'images/shoes/baleriny-soft-beige.svg', 3, 3, 5, 1),
('Baleriny Black Classic', 7, 'Ponadczasowe czarne baleriny do pracy i na co dzień.', 129.99, 'images/shoes/baleriny-black-classic.svg', 1, 1, 5, 1),
('Mokasyny Brown Soft', 8, 'Brązowe mokasyny o klasycznym kroju, dobre do stylizacji casualowych.', 189.99, 'images/shoes/mokasyny-brown-soft.svg', 5, 1, 5, 1),
('Mokasyny Black Suede', 8, 'Czarne zamszowe mokasyny z miękkim wykończeniem.', 209.00, 'images/shoes/mokasyny-black-suede.svg', 1, 2, 5, 1);

-- Rozmiary dostępne dla poszczególnych produktów (do filtrowania w sklepie).
INSERT INTO produkt_rozmiary (produkt_id, rozmiar) VALUES
(1,36),(1,37),(1,38),(1,39),(1,40),
(2,37),(2,38),(2,39),(2,40),(2,41),
(3,39),(3,40),(3,41),(3,42),
(4,38),(4,39),(4,40),(4,41),
(5,36),(5,37),(5,38),(5,39),
(6,36),(6,37),(6,38),(6,39),
(7,36),(7,37),(7,38),(7,39),(7,40),(7,41),
(8,37),(8,38),(8,39),(8,40),(8,41),
(9,38),(9,39),(9,40),(9,41),(9,42),
(10,39),(10,40),(10,41),(10,42),
(11,36),(11,37),(11,38),(11,39),
(12,36),(12,37),(12,38),(12,39),
(13,36),(13,37),(13,38),(13,39),(13,40),
(14,36),(14,37),(14,38),(14,39),
(15,40),(15,41),(15,42),(15,43),
(16,38),(16,39),(16,40),(16,41),(16,42);

-- Przykładowe zapytanie: lista produktów z kategorią, kolorem i materiałem.
SELECT p.id_produktu, p.nazwa, k.nazwa AS kategoria, p.krotki_opis,
       p.cena, p.zdjecie_url, ko.nazwa AS kolor, m.nazwa AS material
FROM produkty p
JOIN kategorie k ON p.kategoria_id = k.id_kategorii
JOIN kolory ko ON p.kolor_id = ko.id_koloru
JOIN materialy m ON p.material_id = m.id_materialu
WHERE p.aktywny = 1
ORDER BY p.nazwa;

-- Przykładowe filtrowanie: buty od najtańszych.
-- SELECT nazwa, cena FROM produkty WHERE aktywny = 1 ORDER BY cena ASC;
-- Przykładowe filtrowanie po kategorii:
-- SELECT p.nazwa, p.cena FROM produkty p JOIN kategorie k ON p.kategoria_id=k.id_kategorii WHERE k.nazwa='Botki';
