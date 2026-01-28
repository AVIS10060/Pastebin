# Pastebin 

A simple Pastebin-like application that allows users to create text pastes and share a link to view them.  
Pastes can optionally expire based on time (TTL) or view count.

This project was built as a take-home assignment and is designed to pass automated testing against a deployed application.

---

## Features

- Create a paste containing arbitrary text
- Receive a shareable URL for the paste
- View the paste via a public link
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Once a constraint is triggered, the paste becomes unavailable (HTTP 404)

---

## Tech Stack

- **Next.js** (App Router)
- **Node.js**
- **Redis (Upstash)** for persistence
- **Vercel** for deployment

---

## How to Run Locally

```bash
npm install
npm run dev

