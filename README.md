# QBot Embeddable Widget

A standalone, embeddable chat widget that connects to your existing QBot backend.

## Quick Start

### Development
```bash
npm install
npm run dev
# Opens on http://localhost:5173
# Widget sandbox will show the floating button in the bottom-right
```

### Build for Production
```bash
npm run build
# Outputs: dist/widget.js (single self-contained bundle)
```

---

## Embed on Any Website

```html
<!-- 1. Configure the widget -->
<script>
  window.QBotConfig = {
    apiKey: "YOUR_PUBLIC_API_KEY",
    tenantId: "your-tenant-id",
    apiBaseUrl: "https://your-backend.com",
    botName: "AI Assistant",
    botAvatar: "https://your-cdn.com/bot-avatar.png",
    welcomeTitle: "Welcome! 👋",
    welcomeSubtitle: "How can I help you today?",
    theme: {
      primary: "#4F46E5",
      secondary: "#6366F1"
    },
    position: "bottom-right"
  };
</script>

<!-- 2. Load the widget script -->
<script src="https://your-cdn.com/widget.js"></script>
```

---

## Programmatic Control

```js
window.QBot.open();    // Open the chat window
window.QBot.close();   // Close the chat window
window.QBot.toggle();  // Toggle open/closed
window.QBot.destroy(); // Remove widget from page
```

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | Public API key |
| `tenantId` | string | required | Your tenant ID |
| `apiBaseUrl` | string | required | Backend base URL |
| `botName` | string | "AI Assistant" | Bot display name |
| `botAvatar` | string | default icon | URL to bot avatar image |
| `placeholder` | string | "Type your message..." | Input placeholder |
| `welcomeTitle` | string | "Welcome!" | Welcome screen title |
| `welcomeSubtitle` | string | default | Welcome screen subtitle |
| `theme.primary` | string | "#4F46E5" | Primary brand color (hex) |
| `theme.secondary` | string | same as primary | Secondary accent color |
| `position` | "bottom-right" \| "bottom-left" | "bottom-right" | Widget position |
| `zIndex` | number | 999999 | CSS z-index |

---

## Architecture

```
Client Website
    ↓
dist/widget.js  (self-contained IIFE bundle)
    ↓
Shadow DOM      (CSS isolation from host page)
    ↓
React App       (FloatingButton + ChatWindow)
    ↓
Existing Backend API  (/api/chat endpoint)
    ↓
LLM / RAG / Database
```

## Project Structure

```
wedget/
├── src/
│   ├── main.tsx              # Entry point & bootstrap loader
│   ├── App.tsx               # Root React component
│   ├── index.css             # Tailwind + widget styles
│   ├── types.ts              # TypeScript types
│   ├── store/
│   │   └── chatStore.ts      # Zustand state management
│   ├── services/
│   │   └── api.ts            # Axios API client
│   ├── components/
│   │   ├── FloatingButton.tsx # Chat bubble toggle button
│   │   ├── ChatWindow.tsx     # Main chat popup window
│   │   ├── ChatBubble.tsx     # Individual message bubble
│   │   ├── ChatInput.tsx      # Message input + send button
│   │   ├── QuickReplies.tsx   # Quick reply chips
│   │   ├── ActionButtons.tsx  # Schedule/Later action buttons
│   │   └── WelcomeScreen.tsx  # Initial welcome state
│   └── utils/
│       └── uuid.ts            # Lightweight UUID generator
├── dist/
│   └── widget.js              # Built bundle (generated)
├── index.html                 # Dev sandbox page
├── vite.config.ts             # Vite library mode config
├── tailwind.config.cjs        # Tailwind config
├── postcss.config.cjs         # PostCSS config
└── package.json
```

## Deployment

```bash
# Build the widget
npm run build

# dist/widget.js is ready to deploy to:
# - Your CDN (CloudFront, Cloudflare, etc.)
# - Your backend static files
# - npm package registry
```
