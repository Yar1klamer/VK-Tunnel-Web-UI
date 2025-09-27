const express = require("express");
const { execSync } = require("child_process");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
const PORT = 3000;

// Раздача статических файлов (например, APK)
app.use("/files", express.static(path.join(__dirname, "files")));

// Получение VLESS ссылки
function getVlessLink() {
  try {
    const output = execSync("/root/easy-vk-tunnel/easy-vk-tunnel.sh", { encoding: "utf-8" });
    const match = output.match(/vless:\/\/[^\s]+/);
    return { link: match ? match[0] : null, raw: output };
  } catch (err) {
    return { link: null, raw: err.message };
  }
}

// Главная страница
app.get("/", async (req, res) => {
  const data = getVlessLink();
  let qrData = "";
  if (data.link) {
    qrData = await QRCode.toDataURL(data.link);
  }
  res.send(`
    <html>
      <head>
        <title>VK Tunnel</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg, #6b48ff, #00ddeb);
            background-size: 400%;
            animation: gradient 15s ease infinite;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          h1 {
            font-size: 2rem;
            color: #1a1a1a;
            margin: 0 0 1.5rem;
            font-weight: 600;
          }
          .key-container {
            background: #f5f5f5;
            border-radius: 10px;
            padding: 1rem;
            margin: 1rem 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 0.9rem;
            color: #333;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .qr-container {
            background: #fff;
            border-radius: 10px;
            padding: 1rem;
            margin: 1.5rem 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            display: inline-block;
          }
          .qr-container img {
            max-width: 180px;
            border-radius: 8px;
          }
          .btn {
            display: inline-block;
            padding: 0.8rem 1.5rem;
            margin: 0.5rem;
            border: none;
            border-radius: 8px;
            background: #1a1a1a;
            color: white;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
          }
          .btn:hover {
            background: linear-gradient(45deg, #6b48ff, #00ddeb);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .download-link {
            display: inline-block;
            margin-top: 1rem;
            color: #6b48ff;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          .download-link:hover {
            color: #00ddeb;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>VK Tunnel</h1>
          <div class="key-container" id="key">${data.link ? data.link : "Ошибка получения ссылки"}</div>
          ${data.link ? `<div class="qr-container"><img id="qr" src="${qrData}" alt="QR-код"/></div>` : ""}
          <button class="btn" onclick="copyKey()">Копировать</button>
          ${data.link ? `<a class="btn" id="importBtn" href="v2raytun://import/\${btoa('${data.link}')}">Импортировать</a>` : ""}
          <button class="btn" onclick="fetchNewKey()">Получить новый ключ</button>
          <a class="download-link" href="/files/v2raytun.apk">⬇️ Скачать v2raytun</a>
        </div>
        <script>
          function encodeBase64(str) {
            return btoa(unescape(encodeURIComponent(str)));
          }

          async function copyKey() {
            const key = document.getElementById("key").innerText;
            await navigator.clipboard.writeText(key);
            alert("Ключ скопирован!");
          }

          async function fetchNewKey() {
            const keyContainer = document.getElementById("key");
            const qrContainer = document.getElementById("qr").parentElement;
            keyContainer.innerText = "Запрос выполняется...";
            qrContainer.innerHTML = "";
            const res = await fetch("/new");
            const data = await res.json();
            keyContainer.innerText = data.link || "Ошибка получения ссылки";
            if (data.link) {
              const qrData = await fetch("/qr?link=" + encodeURIComponent(data.link)).then(r => r.text());
              qrContainer.innerHTML = '<img id="qr" src="' + qrData + '" alt="QR-код"/>';
              const importBtn = document.querySelector('#importBtn');
              if (importBtn) {
                importBtn.innerText = "Импортировать";
                importBtn.setAttribute("href", "v2raytun://import/" + encodeBase64(data.link));
              } else {
                const newImportBtn = document.createElement("a");
                newImportBtn.className = "btn";
                newImportBtn.id = "importBtn";
                newImportBtn.href = "v2raytun://import/" + encodeBase64(data.link);
                newImportBtn.innerText = "Импортировать";
                document.querySelector(".download-link").before(newImportBtn);
              }
            }
            document.querySelector('button[onclick="copyKey()"]').innerText = "Копировать";
            document.querySelector('button[onclick="fetchNewKey()"]').innerText = "Получить новый ключ";
          }
        </script>
      </body>
    </html>
  `);
});

// Эндпоинт JSON
app.get("/new", (req, res) => {
  res.json(getVlessLink());
});

// Эндпоинт генерации QR для fetch
app.get("/qr", async (req, res) => {
  const link = req.query.link;
  if (!link) return res.status(400).send("No link");
  const qrData = await QRCode.toDataURL(link);
  res.send(qrData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
