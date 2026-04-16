<?php
// Script 4: Arrays - store and display

// Indexed Array: Top alumni departments
$departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"];

// Associative Array: Sample alumni record
$alumni_record = [
    "Name"       => "Aadish Dighe",
    "Batch"      => "2024",
    "Department" => "Computer Science",
    "Company"    => "Google",
    "Role"       => "Software Engineer"
];

// Multidimensional Array: Multiple alumni
$alumni_list = [
    ["name" => "Priya Sharma",   "batch" => "2023", "company" => "Microsoft",  "role" => "Data Analyst"],
    ["name" => "Rahul Mehta",    "batch" => "2022", "company" => "Infosys",    "role" => "Backend Dev"],
    ["name" => "Sneha Iyer",     "batch" => "2021", "company" => "TCS",        "role" => "QA Engineer"],
    ["name" => "Arjun Nair",     "batch" => "2024", "company" => "Wipro",      "role" => "DevOps"],
    ["name" => "Meera Patel",    "batch" => "2023", "company" => "Amazon",     "role" => "Product Manager"],
];

// Some array functions
$sorted_depts = $departments;
sort($sorted_depts);
$dept_count = count($departments);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP – Arrays</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); min-height: 100vh; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    .card { background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-radius: 1.25rem; padding: 2rem; box-shadow: 0 20px 60px rgba(79,70,229,0.12); margin-bottom: 1.5rem; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; color: #0f172a; display: flex; align-items: center; gap: 0.5rem; }
    .fn-badge { font-size: 0.75rem; background: #e0e7ff; color: #4F46E5; padding: 0.2rem 0.75rem; border-radius: 9999px; font-weight: 600; }
    .dept-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .dept-chip { background: #4F46E5; color: white; padding: 0.5rem 1.25rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
    .assoc-grid { display: grid; gap: 0.5rem; }
    .assoc-row { display: flex; gap: 1rem; padding: 0.6rem 1rem; background: #f8fafc; border-radius: 0.5rem; }
    .assoc-key { font-weight: 700; color: #4F46E5; min-width: 110px; font-size: 0.875rem; }
    .assoc-val { color: #0f172a; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #4F46E5; color: white; padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; }
    th:first-child { border-radius: 0.5rem 0 0 0; }
    th:last-child { border-radius: 0 0.5rem 0 0; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; color: #0f172a; }
    tr:hover td { background: #f0f4ff; }
    .count-box { background: #d1fae5; border-radius: 0.75rem; padding: 1rem 1.5rem; display: inline-flex; align-items: center; gap: 1rem; }
    .count-box .num { font-size: 2rem; font-weight: 700; color: #065f46; }
    .count-box .label { font-size: 0.875rem; color: #047857; font-weight: 600; }
    .back-link { display: inline-block; margin-top: 1rem; color: #4F46E5; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 PHP Arrays</h1>
    <p class="subtitle">SIH Problem Statement 25017 — PHP Demo #4</p>

    <!-- Indexed Array -->
    <div class="card">
      <h2>1. Indexed Array <span class="fn-badge">$departments[]</span></h2>
      <div class="dept-list">
        <?php foreach ($departments as $i => $dept): ?>
          <span class="dept-chip"><?php echo ($i + 1) . ". $dept"; ?></span>
        <?php endforeach; ?>
      </div>
      <div style="margin-top:1rem;">
        <div class="count-box">
          <span class="num"><?php echo $dept_count; ?></span>
          <span class="label">Total Departments<br/><code style="font-size:0.75rem">count() function</code></span>
        </div>
      </div>
    </div>

    <!-- Associative Array -->
    <div class="card">
      <h2>2. Associative Array <span class="fn-badge">key => value pairs</span></h2>
      <div class="assoc-grid">
        <?php foreach ($alumni_record as $key => $value): ?>
          <div class="assoc-row">
            <span class="assoc-key"><?php echo $key; ?></span>
            <span class="assoc-val"><?php echo $value; ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Multidimensional Array -->
    <div class="card">
      <h2>3. Multidimensional Array <span class="fn-badge">Alumni Records Table</span></h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Company</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($alumni_list as $index => $alum): ?>
            <tr>
              <td><?php echo $index + 1; ?></td>
              <td><strong><?php echo $alum['name']; ?></strong></td>
              <td><?php echo $alum['batch']; ?></td>
              <td><?php echo $alum['company']; ?></td>
              <td><?php echo $alum['role']; ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <!-- Sorted Array -->
    <div class="card">
      <h2>4. Sorted Array <span class="fn-badge">sort() function</span></h2>
      <div class="dept-list">
        <?php foreach ($sorted_depts as $dept): ?>
          <span class="dept-chip" style="background:#10B981"><?php echo $dept; ?></span>
        <?php endforeach; ?>
      </div>
    </div>

    <a class="back-link" href="index.php">← Back to PHP Demos</a>
  </div>
</body>
</html>
