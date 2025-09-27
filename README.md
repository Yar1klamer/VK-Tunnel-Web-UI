# VK Tunnel Web UI

Веб-интерфейс для [easy-vk-tunnel](https://github.com/nebesniy/easy-vk-tunnel).  
Позволяет получать свежие VLESS-ссылки через VK Tunnel, показывать их на странице, копировать, сканировать по QR-коду и импортировать напрямую в клиент.

---

## Возможности

- Генерация новой VLESS-ссылки через `easy-vk-tunnel.sh`
- Автоматическая генерация QR-кода
- Кнопка «Скопировать» для удобства
- Импорт ссылки в клиент одним кликом
- Раздача файлов (например, APK клиента) через `/files`
- Простой и удобный интерфейс, работает на телефонах

---

## Установка

1. Установите зависимости:

```bash
sudo apt update
sudo apt install -y nodejs npm git
npm install express qrcode
```

2. Клонируйте проект:

```bash
git clone https://github.com/ВАШ_ЮЗЕР/VK-Tunnel-Web-UI.git
cd VK-Tunnel-Web-UI
```

3. Убедитесь, что у вас настроен  
[easy-vk-tunnel](https://github.com/nebesniy/easy-vk-tunnel)  
и скрипт доступен по пути:

```
/root/easy-vk-tunnel/easy-vk-tunnel.sh
```

4. Запустите сервер:

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
