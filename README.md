

# VK Tunnel Web UI 2.0

Веб-интерфейс для удобного доступа к VK Tunnel.
Позволяет быстро получить ссылку на подписку, скопировать её, отсканировать по QR-коду и скачать клиентское приложение.

---

## Возможности

* Отображение ссылки подписки (например, Yandex Cloud)
* Автоматическая генерация QR-кода
* Кнопка **📋 Скопировать**
* Кнопка **🌐 Открыть подписку**
* Кнопка **⬇️ Скачать V2RayTun (APK)** через `/files/v2raytun.apk`
* Современный интерфейс с анимацией и адаптивной версткой

---

Обязательно чтоб был установлен https://github.com/nebesniy/easy-vk-tunnel/      
В конце скрипта выдадут подписку 
В формате "https://storage.yandexcloud.net/Your_baket/Слово указанное в установке скрипта"



## Установка

1. Установите зависимости:

```bash
sudo apt update
sudo apt install -y nodejs npm git
npm install express qrcode
```

2. Клонируйте проект:

```bash
git clone https://github.com/Yar1klamer/VK-Tunnel-Web-UI.git
cd VK-Tunnel-Web-UI
```

3. Создайте папку `files` и положите туда APK-клиент:

```bash
mkdir files
cp /путь/к/v2raytun.apk ./files/
```

4. Измените 12 строку в server.js. Укажите подписку полученную при установке скрипта

const SUBSCRIPTION_URL = "https://storage.yandexcloud.net/Your_baket/Слово указанное в процессе установки";

5. Запустите сервер:

```bash
node server.js
```

Теперь веб-интерфейс будет доступен по адресу:
[http://localhost:3000](http://localhost:3000)

---

## Автозапуск через systemd

Файл `/etc/systemd/system/vk-tunnel-web.service`:

```ini
[Unit]
Description=VK Tunnel Web UI
After=network.target

[Service]
ExecStart=/usr/bin/node /root/VK-Tunnel-Web-UI/server.js
WorkingDirectory=/root/VK-Tunnel-Web-UI
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Активируем:

```bash
sudo systemctl daemon-reload
sudo systemctl enable vk-tunnel-web
sudo systemctl start vk-tunnel-web
```

---

## Настройка HTTPS (через Nginx + Certbot)

Пример конфига:

```nginx
server {
    listen 80;
    server_name ваш.домен;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Далее:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ваш.домен
```

---

## Лицензия

MIT

---

