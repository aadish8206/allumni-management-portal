<?php
// Script 1: Welcome message with current date & time
date_default_timezone_set('Asia/Kolkata');
$current_datetime = date('l, d F Y - h:i:s A');
$greeting = "Welcome to Alumni Management Portal";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP – Welcome & DateTime</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-radius: 1.25rem; padding: 3rem 2.5rem; box-shadow: 0 20px 60px rgba(79,70,229,0.12); max-width: 480px; width: 100%; text-align: center; }
    .icon { font-size: 3.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
    .subtitle { color: #64748b; margin-bottom: 2rem; font-size: 0.95rem; }
    .datetime-box { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; }
    .datetime-box p { font-size: 0.8rem; opacity: 0.8; margin-bottom: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; }
    .datetime-box h2 { font-size: 1.1rem; font-weight: 600; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 0.4rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-top: 1rem; }
    .back-link { display: inline-block; margin-top: 1.5rem; color: #4F46E5; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🎓</div>
    <h1><?php echo $greeting; ?></h1>
    <p class="subtitle">SIH Problem Statement 25017 — PHP Demo #1</p>

    <div class="datetime-box">
      <p>📅 Current Date & Time (IST)</p>
      <h2><?php echo $current_datetime; ?></h2>
    </div>

    <div class="badge">✓ PHP date() function used</div>
    <br/>
    <a class="back-link" href="index.php">← Back to PHP Demos</a>
  </div>
</body>
</html>
