# 🧠 OpenAI CLI Chat

A simple TypeScript-based Node.js script that lets you chat with OpenAI's API directly from your terminal — no client, no server, just pure local testing.

---

## 🚀 Features

- Interactive CLI interface
- Sends messages to OpenAI's Chat API (`gpt-3.5-turbo` or custom model)
- Graceful exit with `exit`, `quit`, or `q`
- Easy to extend and hack

---

## 🛠 Requirements

- Node.js (v16+)
- `ts-node` and `typescript`
- OpenAI API key

- Create a .env file in the root:

```bash
OPENAI_API_KEY=your-openai-key-here
```

---

## 📦 Install

```bash
git clone https://github.com/yourusername/openai-cli-chat.git

cd openai-cli-chat

npm install
```

RUN

```bash
ts-node ask.ts
```
