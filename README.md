
# 🎵 Spotify Mood Recommendation (Prompt Engineering + Poe.com)

A Next.js serverless route that connects to the **Poe API** for chat completions.  
Handles authentication, error management, and quota limits while returning structured JSON responses.

---

## 🚀 Features
- Chat completions via Poe API
- Error handling for quota & auth issues
- JSON responses with timestamps
- Configurable model (default: `beatbotzz`)

---

## 🛠 Tech Stack
- Next.js (App Router)
- TypeScript
- OpenAI SDK (custom baseURL → Poe API)

---

## ⚙️ Usage
```bash
npm install
npm run dev
```

Send a `POST` request with:
```json
{
  "message": "Hello Poe!"
}
```

---

## 📡 API Endpoint
- `POST /api/chat` → Returns Poe model response + timestamp

---

## 📄 License
Proprietary – Internal Use
