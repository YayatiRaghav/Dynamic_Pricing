<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

$productsFile = __DIR__ . '/../products.json';
$products = [];
if (file_exists($productsFile)) {
    $products = json_decode(file_get_contents($productsFile), true);
}

if (isset($_GET['delete'])) {
    $deleteId = $_GET['delete'];
    $products = array_filter($products, fn($p) => $p['id'] !== $deleteId);
    file_put_contents($productsFile, json_encode(array_values($products)));
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_product'])) {
    $newProduct = [
        'id' => uniqid(),
        'name' => $_POST['name'],
        'base_price' => (float)$_POST['price'],
        'category' => $_POST['category'],
        'stock' => (int)$_POST['stock'],
        'image' => $_POST['image'],
        'demand' => (int)$_POST['demand'],
        'rating' => (float)$_POST['rating'],
        'last_updated' => date('Y-m-d H:i:s')
    ];
    $products[] = $newProduct;
    file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT));
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/admin.css" rel="stylesheet">
</head>
<body>
    <div class="container my-5">
        <h2>Product Management</h2>
        <form method="POST" class="row g-2 mb-4">
            <input type="hidden" name="add_product" value="1">
            <div class="col-md-2">
                <input type="text" name="name" class="form-control" placeholder="Product Name" required>
            </div>
            <div class="col-md-2">
                <input type="number" step="0.01" name="price" class="form-control" placeholder="Base Price" required>
            </div>
            <div class="col-md-2">
                <select name="category" class="form-control" required>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                </select>
            </div>
            <div class="col-md-1">
                <input type="number" name="stock" class="form-control" placeholder="Stock" required>
            </div>
            <div class="col-md-2">
                <input type="number" name="demand" class="form-control" placeholder="Demand (0-10)" min="0" max="10" required>
            </div>
            <div class="col-md-2">
                <input type="number" step="0.1" name="rating" class="form-control" placeholder="Rating (1-5)" min="1" max="5" required>
            </div>
            <div class="col-md-2">
                <input type="text" name="image" class="form-control" placeholder="Image Filename" required>
            </div>
            <div class="col-md-1">
                <button type="submit" class="btn btn-success">Add</button>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Base Price</th>
                        <th>Category</th>
                        <th>Demand</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    <?php foreach($products as $product): ?>
    <tr>
        <td><img src="../img/products/<?= $product['image'] ?>" style="width:60px;"></td>
        <td><?= htmlspecialchars($product['name']) ?></td>
        <td>$<?= number_format($product['base_price'], 2) ?></td>
        <td><?= ucfirst($product['category']) ?></td>
        <!-- Check if 'demand' exists -->
        <td><?= isset($product['demand']) ? $product['demand'] : 'N/A' ?></td>
        <!-- Check if 'rating' exists -->
        <td><?= isset($product['rating']) ? $product['rating'] : 'N/A' ?></td>
        <td>
            <a href="?delete=<?= $product['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete?')">Delete</a>
        </td>
    </tr>
    <?php endforeach; ?>
</tbody>

            </table>
        </div>
    </div>
</body>

</html>
