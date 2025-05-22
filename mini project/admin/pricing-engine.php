<?php
// Simulated competitor data and demand
$competitor_prices = [
    'electronics' => 400,
    'fashion' => 60,
    'home' => 90
];
$demand_factor = 1.0 + (rand(0, 100) / 200.0); // 1.0 to 1.5

$productsFile = __DIR__ . '/../products.json';
$products = [];
if (file_exists($productsFile)) {
    $products = json_decode(file_get_contents($productsFile), true);
    foreach ($products as &$product) {
        $comp = $competitor_prices[$product['category']] ?? $product['base_price'];
        // AI pricing: base price, adjusted by demand and competitor
        $product['current_price'] = round(
            max(
                $product['base_price'] * $demand_factor,
                $comp * 0.9
            ),
            2
        );
        $product['last_updated'] = date('Y-m-d H:i:s');
    }
    file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT));
}
echo "Prices updated!";
