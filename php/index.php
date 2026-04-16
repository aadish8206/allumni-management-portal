<?php
date_default_timezone_set('Asia/Kolkata');
$current_time = date('h:i A');
$current_date = date('d M Y');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP Demos – Alumni Portal (SIH 25017)</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); min-height: 100vh; padding: 3rem 2rem; color: white; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto 3rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; }
    .logo-icon { font-size: 2rem; }
    .logo h2 { font-size: 1.1rem; font-weight: 700; }
    .logo p { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
    .time-badge { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 0.75rem; padding: 0.5rem 1.25rem; font-size: 0.875rem; backdrop-filter: blur(10px); }
    .hero { text-align: center; margin-bottom: 3rem; }
    .hero h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.75rem; background: linear-gradient(135deg, #a5b4fc, #e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { color: rgba(255,255,255,0.6); font-size: 1rem; max-width: 500px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
    .demo-card { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 1.25rem; padding: 2rem; text-decoration: none; color: white; transition: all 0.3s ease; position: relative; overflow: hidden; }
    .demo-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--from), var(--to)); opacity: 0; transition: opacity 0.3s; z-index: 0; }
    .demo-card:hover::before { opacity: 0.15; }
    .demo-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .demo-card > * { position: relative; z-index: 1; }
    .card-number { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .card-desc { font-size: 0.875rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 1.5rem; }
    .tag-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tag { background: rgba(255,255,255,0.1); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .card-cta { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.875rem; }
    .footer { text-align: center; margin-top: 3rem; color: rgba(255,255,255,0.35); font-size: 0.8rem; }
    .note-box { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 0.75rem; padding: 1rem 1.5rem; max-width: 1000px; margin: 0 auto 2rem; font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .note-box strong { color: #a5b4fc; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="logo">
      <span class="logo-icon">🎓</span>
      <div>
        <h2>Alumni Management Portal</h2>
        <p>SIH Problem Statement 25017 — PHP Section</p>
      </div>
    </div>
    <div class="time-badge">🕐 <?php echo $current_time; ?> · <?php echo $current_date; ?></div>
  </div>

  <div class="hero">
    <h1>PHP Demo Programs</h1>
    <p>Four foundational PHP programs integrated as part of the Alumni Management Platform.</p>
  </div>

  <div class="note-box">
    <strong>ℹ️ Note:</strong> These PHP demos run independently via <strong>XAMPP</strong> (port 80) and do <strong>not</strong> interfere with the Node.js backend (port 5000) or the React frontend (port 5173).
  </div>

  <div class="grid">
    <!-- Card 1 -->
    <a href="welcome.php" class="demo-card" style="--from: #6366f1; --to: #8b5cf6;">
      <p class="card-number">Demo #01</p>
      <div class="card-icon">🕐</div>
      <h3 class="card-title">Welcome & DateTime</h3>
      <p class="card-desc">Displays a Welcome message along with the current date and time in IST using PHP's built-in date functions.</p>
      <div class="tag-list">
        <span class="tag">date()</span>
        <span class="tag">date_default_timezone_set()</span>
      </div>
      <span class="card-cta">Open Demo →</span>
    </a>

    <!-- Card 2 -->
    <a href="form_post.php" class="demo-card" style="--from: #ec4899; --to: #f43f5e;">
      <p class="card-number">Demo #02</p>
      <div class="card-icon">📋</div>
      <h3 class="card-title">POST Form Input</h3>
      <p class="card-desc">Accepts user input from an HTML form using the POST method and displays the sanitized data back to the user.</p>
      <div class="tag-list">
        <span class="tag">$_POST</span>
        <span class="tag">$_SERVER["REQUEST_METHOD"]</span>
        <span class="tag">htmlspecialchars()</span>
      </div>
      <span class="card-cta">Open Demo →</span>
    </a>

    <!-- Card 3 -->
    <a href="strings.php" class="demo-card" style="--from: #f59e0b; --to: #ef4444;">
      <p class="card-number">Demo #03</p>
      <div class="card-icon">🔤</div>
      <h3 class="card-title">String Manipulation</h3>
      <p class="card-desc">Performs string operations — reverse, uppercase, lowercase, length, and custom substring extraction from any input string.</p>
      <div class="tag-list">
        <span class="tag">strrev()</span>
        <span class="tag">strlen()</span>
        <span class="tag">substr()</span>
        <span class="tag">strtoupper()</span>
      </div>
      <span class="card-cta">Open Demo →</span>
    </a>

    <!-- Card 4 -->
    <a href="arrays.php" class="demo-card" style="--from: #10b981; --to: #06b6d4;">
      <p class="card-number">Demo #04</p>
      <div class="card-icon">📦</div>
      <h3 class="card-title">Arrays</h3>
      <p class="card-desc">Demonstrates indexed, associative, and multidimensional arrays — storing and displaying alumni records in a structured table.</p>
      <div class="tag-list">
        <span class="tag">Indexed Array</span>
        <span class="tag">Associative Array</span>
        <span class="tag">Multi-dim Array</span>
        <span class="tag">sort()</span>
        <span class="tag">count()</span>
      </div>
      <span class="card-cta">Open Demo →</span>
    </a>
  </div>

  <div class="footer">
    <p>Built for SIH 25017 · Centralized Alumni Management Platform · PHP Section</p>
  </div>
</body>
</html>
