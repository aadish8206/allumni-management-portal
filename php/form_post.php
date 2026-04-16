<?php
// Script 2: Form Input via POST Method
$submitted = false;
$name = $email = $message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $submitted = true;
    $name    = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email   = htmlspecialchars(trim($_POST['email'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP – POST Form Input</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .card { background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-radius: 1.25rem; padding: 2.5rem; box-shadow: 0 20px 60px rgba(79,70,229,0.12); max-width: 520px; width: 100%; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; font-weight: 600; font-size: 0.875rem; color: #0f172a; margin-bottom: 0.5rem; }
    input, textarea { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; transition: border 0.2s; }
    input:focus, textarea:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    button { width: 100%; padding: 0.85rem; background: #4F46E5; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #4338CA; }
    .result-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem; }
    .result-box h3 { color: #065f46; margin-bottom: 1rem; font-size: 1rem; }
    .result-row { display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid #dcfce7; align-items: flex-start; }
    .result-row:last-child { border-bottom: none; }
    .result-label { font-weight: 700; color: #065f46; min-width: 80px; font-size: 0.875rem; }
    .result-value { color: #0f172a; word-break: break-all; }
    .method-badge { display: inline-block; background: #fee2e2; color: #b91c1c; padding: 0.2rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; margin-bottom: 1.5rem; }
    .back-link { display: inline-block; margin-top: 1.5rem; color: #4F46E5; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📋 POST Form Input</h1>
    <p class="subtitle">SIH Problem Statement 25017 — PHP Demo #2</p>
    <span class="method-badge">METHOD: POST</span>

    <?php if ($submitted): ?>
    <div class="result-box">
      <h3>✅ Form Submitted Successfully!</h3>
      <div class="result-row"><span class="result-label">Name</span><span class="result-value"><?php echo $name; ?></span></div>
      <div class="result-row"><span class="result-label">Email</span><span class="result-value"><?php echo $email; ?></span></div>
      <div class="result-row"><span class="result-label">Message</span><span class="result-value"><?php echo $message; ?></span></div>
    </div>
    <?php endif; ?>

    <form method="POST" action="form_post.php">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" value="<?php echo $name; ?>" required />
      </div>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" value="<?php echo $email; ?>" required />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="4" placeholder="Write something..."><?php echo $message; ?></textarea>
      </div>
      <button type="submit">Submit Form →</button>
    </form>

    <a class="back-link" href="index.php">← Back to PHP Demos</a>
  </div>
</body>
</html>
