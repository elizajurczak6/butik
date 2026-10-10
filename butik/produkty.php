<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// Zmień dane poniżej, jeśli Twoja konfiguracja MySQL jest inna.
$dbHost = 'localhost';
$dbName = 'butik_obuwie';
$dbUser = 'root';
$dbPass = ''; // W XAMPP domyślnie często jest puste.

try {
    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $sql = "
        SELECT
            p.id_produktu,
            p.nazwa,
            p.krotki_opis,
            p.cena,
            p.zdjecie_url,
            k.nazwa AS kategoria,
            ko.nazwa AS kolor,
            m.nazwa AS material,
            ro.nazwa AS rodzaj_obcasa,
            wo.nazwa AS wysokosc_obcasa,
            GROUP_CONCAT(DISTINCT pr.rozmiar ORDER BY pr.rozmiar SEPARATOR ',') AS rozmiary
        FROM produkty p
        JOIN kategorie k ON k.id_kategorii = p.kategoria_id
        JOIN kolory ko ON ko.id_koloru = p.kolor_id
        JOIN materialy m ON m.id_materialu = p.material_id
        JOIN rodzaje_obcasa ro ON ro.id_rodzaju_obcasa = p.rodzaj_obcasa_id
        JOIN wysokosci_obcasa wo ON wo.id_wysokosci = p.wysokosc_obcasa_id
        LEFT JOIN produkt_rozmiary pr ON pr.produkt_id = p.id_produktu
        WHERE p.aktywny = 1
        GROUP BY p.id_produktu, p.nazwa, p.krotki_opis, p.cena, p.zdjecie_url,
                 k.nazwa, ko.nazwa, m.nazwa, ro.nazwa, wo.nazwa
        ORDER BY p.id_produktu
    ";

    $rows = $pdo->query($sql)->fetchAll();
    foreach ($rows as &$row) {
        $row['cena'] = (float)$row['cena'];
        $row['rozmiary'] = $row['rozmiary'] === null || $row['rozmiary'] === ''
            ? []
            : array_map('intval', explode(',', $row['rozmiary']));
    }
    unset($row);

    echo json_encode(['success' => true, 'products' => $rows], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    // Szczegóły błędu zapisujemy do logów serwera, nie pokazujemy danych połączenia w przeglądarce.
    error_log('Butik API error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Nie udało się pobrać produktów. Sprawdź połączenie z bazą i strukturę tabel.'
    ], JSON_UNESCAPED_UNICODE);
}
