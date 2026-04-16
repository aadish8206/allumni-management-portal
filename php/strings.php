<?php
// Script 3: String Manipulation
$submitted = false;
$input_string = $reversed = $upper = $lower = $length = $substring = "";
$substr_start = 0;
$substr_len   = 5;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $submitted    = true;
    $input_string = htmlspecialchars(trim($_POST['input_string'] ?? ''));
    $substr_start = (int)($_POST['substr_start'] ?? 0);
    $substr_len   = (int)($_POST['substr_len'] ?? 5);

    if ($input_string !== '') {
        $reversed  = strrev($input_string);
        $upper     = strtoupper($input_string);
        $lower     = strtolower($input_string);
        $length    = strlen($input_string);
        $substring = substr($input_string, $substr_start, $substr_len);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP – String Manipulation</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .card { background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-radius: 1.25rem; padding: 2.5rem; box-shadow: 0 20px 60px rgba(79,70,229,0.12); max-width: 600px; width: 100%; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; font-weight: 600; font-size: 0.875rem; color: #0f172a; margin-bottom: 0.5rem; }
    input[type=text], input[type=number] { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-family: inherit; font-size: 0.95rem; }
    input:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    button { width: 100%; padding: 0.85rem; background: #4F46E5; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; }
    button:hover { background: #4338CA; }
    .results { margin-top: 1.5rem; display: grid; gap: 0.75rem; }
    .result-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; }
    .result-item .fn-name { font-size: 0.8rem; font-weight: 700; color: #4F46E5; background: #e0e7ff; padding: 0.25rem 0.75rem; border-radius: 9999px; }
    .result-item .fn-value { font-size: 0.9rem; font-weight: 600; color: #0f172a; word-break: break-all; max-width: 60%; text-align: right; }
    .back-link { display: inline-block; margin-top: 1.5rem; color: #4F46E5; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔤 String Manipulation</h1>
    <p class="subtitle">SIH Problem Statement 25017 — PHP Demo #3</p>

    <form method="POST" action="strings.php">
      <div class="form-group">
        <label>Input String</label>
        <input type="text" name="input_string" placeholder="Type any string..." value="<?php echo $input_string; ?>" required />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Substring Start (index)</label>
          <input type="number" name="substr_start" value="<?php echo $substr_start; ?>" min="0" />
        </div>
        <div class="form-group">
          <label>Substring Length</label>
          <input type="number" name="substr_len" value="<?php echo $substr_len; ?>" min="1" />
        </div>
      </div>
      <button type="submit">Manipulate String →</button>
    </form>

    <?php if ($submitted && $input_string !== ''): ?>
    <div class="results">
      <div class="result-item">
        <span class="fn-name">strlen()</span>
        <span class="fn-value">Length = <?php echo $length; ?> characters</span>
      </div>
      <div class="result-item">
        <span class="fn-name">strrev()</span>
        <span class="fn-value"><?php echo $reversed; ?></span>
      </div>
      <div class="result-item">
        <span class="fn-name">strtoupper()</span>
        <span class="fn-value"><?php echo $upper; ?></span>
      </div>
      <div class="result-item">
        <span class="fn-name">strtolower()</span>
        <span class="fn-value"><?php echo $lower; ?></span>
      </div>
      <div class="result-item">
        <span class="fn-name">substr(str, <?php echo $substr_start; ?>, <?php echo $substr_len; ?>)</span>
        <span class="fn-value"><?php echo $substring !== '' ? '"' . $substring . '"' : '(out of range)'; ?></span>
      </div>
    </div>
    <?php endif; ?>

    <a class="back-link" href="index.php">← Back to PHP Demos</a>
  </div>
</body>
</html>
