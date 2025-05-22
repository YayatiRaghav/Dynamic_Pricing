<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Pricing Rules</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                <!-- Same sidebar as dashboard -->
            </nav>

            <main class="col-md-9 ml-sm-auto col-lg-10 px-4">
                <h2>Pricing Rules Configuration</h2>
                
                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">AI Pricing Settings</h5>
                        <div id="pricing-status" class="mb-3"></div>
                        <button onclick="runPriceUpdate()" class="btn btn-primary">
                            Update Prices Now
                        </button>
                    </div>
                </div>

                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Market Conditions</h5>
                        <div id="market-conditions">
                            <p>Loading market data...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="js/pricing-engine.js"></script>
    <script>
    function runPriceUpdate() {
        const status = document.getElementById('pricing-status');
        status.innerHTML = '<div class="spinner-border text-primary"></div> Updating prices...';
        
        fetch('/admin/update-prices.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                status.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
            })
            .catch(error => {
                status.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            });
    }
    </script>
</body>
</html>
