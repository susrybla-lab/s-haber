<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>İyi ki doğdun Anne</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="light-theme birthday-page">
    <header>
        <div class="container header-content">
            <a class="logo" href="index.html" aria-label="S-Haber ana sayfa">S-HABER</a>
            <nav><ul><li><a href="index.html">Ana Sayfa</a></li></ul></nav>
        </div>
    </header>

    <main class="birthday-shell container">
        <section class="birthday-card birthday-login" id="birthday-login" aria-labelledby="birthday-login-title">
            <p class="birthday-kicker">Sana özel bir mesaj var</p>
            <h1 id="birthday-login-title">İyi ki doğdun, Anne.</h1>
            <p>Bu küçük sürprizi açmak için sana verilen özel kodu gir.</p>
            <form id="birthday-form" novalidate>
                <label for="birthday-code">Özel kod</label>
                <div class="birthday-code-row">
                    <input id="birthday-code" name="code" type="password" inputmode="text" autocomplete="off" placeholder="Kodu yaz" required>
                    <button type="submit">Sürprizi aç</button>
                </div>
                <p id="birthday-error" class="birthday-error" role="alert" aria-live="polite"></p>
            </form>
            <p class="birthday-note">İpucu: Bu kod sana sevgiyle verildi. ♡</p>
        </section>

    </main>

    <footer><p>Senin için sevgiyle hazırlandı. ♥</p></footer>
    <script src="birthday.js"></script>
</body>
</html>
