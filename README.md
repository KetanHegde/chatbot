# AI Chatbot Application

A modern, secure chatbot application built with Next.js, featuring email authentication, real-time messaging, and AI-powered responses through automated workflows.

---

🌐 **Live Demo:** [https://respond-bot.netlify.app/](https://respond-bot.netlify.app/) – Try the chatbot in action.

---

## 🌟 Features

- **Email OTP Authentication** – Secure password-less login
- **Real-time Chat Interface** – Instant messaging with live updates
- **AI-Powered Responses** – Intelligent chatbot via OpenRouter
- **Multi-Chat Support** – Organise multiple conversations
- **Responsive Design** – Optimised for desktop and mobile
- **Data Security** – Row-level security and user isolation
- **GraphQL API** – Efficient data fetching with subscriptions

---

## 🏗️ Architecture

### Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | Next.js 15, TypeScript, Tailwind CSS         |
| Backend   | Nhost (PostgreSQL + Hasura GraphQL)          |
| Auth      | Nhost Email-OTP (JWT)                        |
| Workflows | n8n                                          |
| AI        | OpenRouter API                               |
| Realtime  | GraphQL Subscriptions                        |

### Overview Diagram

```
┌─────────────┐ ┌──────────────┐  ┌─────────────┐ ┌───────────────┐
│  Next.js    │──▶│   Hasura  │──▶    n8n      │──▶ OpenRouter  │
│  Frontend   │ │     GraphQL     │ Workflow    │ │   AI API      │
└─────────────┘ └──────────────┘  └─────────────┘ └───────────────┘
        │                    │
        ▼                    │
┌──────────────┐             │
│ PostgreSQL   │◀───────────┘
│ Database     │
└──────────────┘
```

---

## 📖 Documentation

Full technical documentation is available in-app at **/docs** covering:

- System architecture
- Database schema & permissions
- GraphQL API reference
- Authentication flow
- n8n workflow

---

## 🔧 Configuration

### Database

| Table       | Purpose              |
|-------------|----------------------|
| `chats`     | Conversation meta    |
| `messages`  | Individual messages  |

**Row-level security** ensures each user accesses only their own rows.

**Hasura Permissions (user role):**

```yaml
chats:
  select: { user_id: { _eq: "X-Hasura-User-Id" } }
  insert: { user_id: { _eq: "X-Hasura-User-Id" } }
  update: { user_id: { _eq: "X-Hasura-User-Id" } }
messages:
  select: { chat: { user_id: { _eq: "X-Hasura-User-Id" } } }
  insert: { chat: { user_id: { _eq: "X-Hasura-User-Id" } } }
```

---

### n8n Workflow

1. Webhook from Hasura Action `sendMessage`
2. Validate user owns `chat_id`
3. Fetch message history via GraphQL
4. Call OpenRouter API for AI response
5. Insert assistant message via GraphQL

---

## 📊 GraphQL API

### Queries

```graphql
query GetChats {
  chats(order_by: { updated_at: desc }) {
    id
    title
    created_at
    updated_at
    messages(limit: 1, order_by: { created_at: desc }) {
      content
      sender
      created_at
    }
  }
}

query GetMessages($chatId: uuid!) {
  messages(
    where: { chat_id: { _eq: $chatId } }
    order_by: { created_at: asc }
  ) {
    id
    content
    sender
    created_at
  }
}
```

### Mutations

```graphql
mutation InsertChat($title: String!) {
  insert_chats_one(object: { title: $title }) {
    id
    title
  }
}

mutation SendMessage($chatId: uuid!, $content: String!) {
  sendMessage(chat_id: $chatId, content: $content) {
    reply
  }
}
```

### Subscriptions

```graphql
subscription MessagesSubscription($chatId: uuid!) {
  messages(
    where: { chat_id: { _eq: $chatId } }
    order_by: { created_at: asc }
  ) {
    id
    content
    sender
    created_at
  }
}

subscription ChatsUpdatedAt {
  chats {
    id
    updated_at
  }
}
```

---

## 🔐 Security

- JWT-based authentication
- Role-based authorization
- Row-level security in PostgreSQL
- Hasura action-level checks
- No direct external API calls from frontend

---

## 🙏 Acknowledgements

- Next.js • Nhost • Hasura • n8n • OpenRouter • Tailwind CSS

---

<p align="center">Made with ❤️  by <a href="https://github.com/KetanHegde">Ketan Hegde</a></p>

