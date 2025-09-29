const express = require("express");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
const PORT = 3000;

// Раздаём статические файлы из папки /files
app.use("/files", express.static(path.join(__dirname, "files")));

// Ссылка на подписку в Yandex Cloud
const SUBSCRIPTION_URL = "https://storage.yandexcloud.net/Your_baket/Слово указанное в установке скрипта";

app.get("/", async (req, res) => {
  const qrData = await QRCode.toDataURL(SUBSCRIPTION_URL);

  res.send(`
    <html lang="ru">
      <head>
        <title>VK Tunnel 2.0</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            margin: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            min-height: 100vh; 
            background: linear-gradient(45deg, #6b48ff, #00ddeb);
            background-size: 400%; 
            animation: gradient 15s ease infinite;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          @keyframes gradient {
            0% {background-position: 0% 50%}
            50% {background-position: 100% 50%}
            100% {background-position: 0% 50%}
          }
          .card { 
            background:#fff; 
            border-radius:20px; 
            padding:2rem; 
            max-width:420px; 
            width:90%; 
            text-align:center; 
            box-shadow:0 8px 30px rgba(0,0,0,0.2);
            animation: fadeIn 1s ease;
          }
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(20px);}
            to {opacity: 1; transform: translateY(0);}
          }
          h1 { margin-bottom:1rem; color:#333; }
          .link { 
            word-break: break-all; 
            background:#f5f5f5; 
            padding:1rem; 
            border-radius:10px; 
            margin:1rem 0; 
            font-family:monospace; 
            font-size:0.9rem;
          }
          img { margin:1.5rem 0; max-width:200px; }
          .btn-container {
            display: flex; 
            justify-content: center; 
            flex-wrap: wrap; 
            gap: 10px;
          }
          .btn { 
            display:inline-block; 
            padding:0.8rem 1.5rem; 
            border:none; 
            border-radius:8px; 
            background:#1a1a1a; 
            color:#fff; 
            cursor:pointer; 
            text-decoration:none;
            transition: all 0.3s ease;
          }
          .btn:hover { 
            background:linear-gradient(45deg, #6b48ff, #00ddeb); 
            color:#fff;
            transform: scale(1.05);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>VK Tunnel 2.0</h1>
          <div class="link" id="sub">${SUBSCRIPTION_URL}</div>
          <img src="${qrData}" alt="QR"/>
          <div class="btn-container">
            <button class="btn" onclick="copySub()">Скопировать</button>
            <a class="btn" href="${SUBSCRIPTION_URL}" target="_blank">Открыть подписку</a>
            <a class="btn" href="/files/v2raytun.apk" download>⬇️ Скачать V2RayTun</a>
          </div>
        </div>
        <script>
          async function copySub() {
            const link = document.getElementById("sub").innerText;
            await navigator.clipboard.writeText(link);
            alert("Ссылка подписки скопирована!");
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log("Server on " + PORT));
