# Lovebox-App (Web-App fürs iPhone)

Eine einzelne Webseite, die man aufs iPhone-Home-Bildschirm legt.
Sie redet über MQTT-über-WebSocket mit demselben "Briefkasten" wie die Box.

| Datei | Wozu |
|---|---|
| `index.html` | die ganze App (Aussehen + Logik) |
| `mqtt.min.js` | MQTT-Bibliothek (mqtt.js 5.10.1) |
| `manifest.json`, `icon-*.png` | Name + Icon auf dem Home-Bildschirm |
| `sw.js` | hält die App offline im Speicher |

Lokal testen: `python3 -m http.server 8765 --directory app` und http://localhost:8765 öffnen.

Verschlüsselung: siehe `include/geheim.h`. Aus dem geheimen Schlüssel werden per SHA-256
der AES-256-GCM-Schlüssel (`"lovebox-aes:"+key`) und die Topic-ID (`"lovebox-topic:"+key`,
erste 12 Byte hex) abgeleitet. Payload = Base64([12 Byte IV][Geheimtext][16 Byte Tag]).

Topics (alle unter `lovebox/<TOPIC-ID>/`, alle außer `online` verschlüsselt):
- `nachricht` App → Box `{"id","von","text"}` (retained)
- `gelesen`  Box → App `{"id","t"}` (retained)
- `herz`     Box → App `{"n","t"}` (retained)
- `online`   Box → App `"1"`/`"0"` (retained, "0" kommt automatisch bei Verbindungsabbruch)

Zugangsdaten stehen **nicht** in den Dateien, sondern werden beim ersten Öffnen
in der App eingegeben und nur auf dem Handy gespeichert.
