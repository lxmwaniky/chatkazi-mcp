# ChatKazi MCP

An implementation of the Model Context Protocol (MCP) designed to act as a bridge between an MCP-compliant client and the [ChatKazi](https://chatkazi.app) WhatsApp API gateway.

This server exposes a series of tools that enable an AI model to interact with WhatsApp instances, programmatically managing sessions, monitoring connection states, and dispatching text and media messages.

---

## Architectural Overview

This server functions as a local translation layer running over Standard Input/Output (Stdio) transport:

```
[ MCP Client / Host ] <--- Stdio (JSON-RPC) ---> [ chatkazi-mcp Server ] <--- HTTPS (fetch) ---> [ ChatKazi API ]
```

1. **Client / Host Handshake:** The host launches this server as a subprocess. The server registers its capabilities and schemas.
2. **Dynamic Tool Execution:** When the AI model decides to call a tool, the host routes a JSON-RPC request over Stdio.
3. **API Forwarding:** The server translates the arguments, formats the HTTPS headers, executes the fetch call to ChatKazi, parses the result, and returns a clean text context block to the model.

---

## Environment Configuration

The server relies on the host environment to supply authentication variables. These must be defined when spawning the process:

- `CHATKAZI_API_KEY` *(Required)*: Your live API key retrieved from your ChatKazi dashboard.
- `CHATKAZI_BASE_URL` *(Optional)*: The base URL of the API. Defaults to `https://api.chatkazi.app/api/v1` if omitted.

---

## WhatsApp Session Lifecycle

The AI model can track and manage the lifecycle of connected WhatsApp numbers. Under the hood, sessions transition through the following states, which are returned by the session status tools:

| State | Meaning | Required Action |
|---|---|---|
| `not_started` | The session has been created but not initialized. | Call `start_session` |
| `connecting` | ChatKazi is preparing the connection. | Wait and poll status |
| `qr_ready` | A QR code pairing link is active. | Retrieve QR and scan in WhatsApp |
| `pairing_code_ready` | A text pairing code has been generated. | Retrieve code |
| `connected` | The session is online and ready. | Proceed to send messages |
| `disconnected` | The connection dropped or failed. | Re-authenticate or restart session |
| `logged_out` | The session was explicitly terminated. | Run `start_session` to reconnect |

---

## Detailed Tool Reference

The following tools are dynamically exposed to the AI model:

### Session Management Tools

#### `list_sessions`
- **Description:** Retrieve a list of all WhatsApp session instances owned by the ChatKazi account.
- **Parameters:** None.

#### `start_session`
- **Description:** Prepares and starts a session instance.
- **Parameters:**
  - `sessionId` *(string, optional)*: A unique identifier. Defaults to `"default"`.

#### `get_session_status`
- **Description:** Queries the current state of a session.
- **Parameters:**
  - `sessionId` *(string, required)*: The target session identifier.

#### `get_session_qr`
- **Description:** Retrieves the QR code link to link a device.
- **Parameters:**
  - `sessionId` *(string, required)*: The target session identifier.

#### `logout_session`
- **Description:** Logs out and disconnects a session, clearing all state.
- **Parameters:**
  - `sessionId` *(string, required)*: The target session identifier.

### Messaging Tools

#### `send_whatsapp_text`
- **Description:** Dispatches a plain text WhatsApp message.
- **Parameters:**
  - `to` *(string, required)*: Recipient number in international format without spaces or `+` (e.g., `"254712345678"`).
  - `text` *(string, required)*: The text content of your message.
  - `sessionId` *(string, optional)*: The session identifier to send from. Defaults to `"default"`.

#### `send_whatsapp_media`
- **Description:** Dispatches an image, video, audio, or document file.
- **Parameters:**
  - `to` *(string, required)*: Recipient number in international format without spaces or `+`.
  - `url` *(string, required)*: Publicly reachable URL of the direct file asset (e.g., a direct link ending in `.png` or `.jpg`).
  - `type` *(string, optional)*: One of `image`, `video`, `audio`, or `document`. Defaults to `image`.
  - `caption` *(string, optional)*: Optional caption text.
  - `fileName` *(string, optional)*: Display name for document attachments.
  - `mimetype` *(string, optional)*: Explicit MIME type.
  - `sessionId` *(string, optional)*: The session identifier to send from. Defaults to `"default"`.

---

## Error Mapping & Resilience

When the ChatKazi API returns an error, the server intercepts the HTTP status and surfaces semantic guidance to the AI model rather than throwing unhandled exceptions. This allows the model to alter its behavior and advise the user:

- **HTTP 401 (Unauthorized):** Surfaced as a credential configuration error, advising the user to check their `CHATKAZI_API_KEY`.
- **HTTP 402 (Payment Required / Limit Reached):** Surfaced as a plan limitation error (e.g., *"WhatsApp instance limit reached"*), informing the model to stop trying to create instances or sending messages and advise the user to upgrade their plan.
- **HTTP 409 (Conflict):** Surfaced when trying to start an active or conflicted session.
- **Empty Media Payload:** Intercepts files that fail to download (e.g., file sizes of `0` bytes) and warns the model that the URL is likely invalid or blocked.

---

## General Integration (MCP Client Setup)

To integrate this server into an MCP client or host platform, add the server to your host's configuration settings:

```json
{
  "mcpServers": {
    "chatkazi-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@lxmwaniky/chatkazi-mcp"
      ],
      "env": {
        "CHATKAZI_API_KEY": "your_chatkazi_api_key_here",
        "CHATKAZI_BASE_URL": "https://api.chatkazi.app/api/v1"
      }
    }
  }
}
```

---

## Local Development

To compile and verify this project locally:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Compile TypeScript code:**
   ```bash
   pnpm run build
   ```

3. **Grant executable permissions to the output binary:**
   ```bash
   chmod +x build/index.js
   ```

4. **Verify using the MCP Inspector:**
   ```bash
   CHATKAZI_API_KEY="your_api_key" pnpm dlx @modelcontextprotocol/inspector node build/index.js
   ```

## Disclaimers

### 1. WhatsApp Terms of Service (ToS) Compliance
Using third-party, unofficial WhatsApp gateway interfaces carries an inherent risk of account suspension by WhatsApp. WhatsApp strictly prohibits bulk messaging, automated spamming, and unsolicited outreach. You are solely responsible for ensuring your messaging workflows comply with WhatsApp's official Terms of Service. The developers and contributors of this MCP server are not liable for any suspended, blocked, or permanently banned WhatsApp numbers resulting from the use of this software.

### 2. No Official Affiliation
This project is an independent, community-driven open-source integration. It is **not** officially affiliated with, endorsed by, sponsored by, or associated with ChatKazi, Meta Platforms, Inc., or WhatsApp. All product names, trademarks, and registered trademarks are the property of their respective owners.

### 3. Financial and Usage Liability
While this MCP server software is distributed for free under an open-source license, utilizing the ChatKazi API may incur financial costs depending on your ChatKazi subscription tier. You are entirely responsible for monitoring your own platform usage, API call quotas, billing, and any rate limits associated with your ChatKazi account.

### 4. Warranty and Support
This software is provided "as is," without warranty of any kind, express or implied. The underlying ChatKazi API endpoints, request/response formats, or authentication methods may change over time without notice, which could temporarily or permanently impact the functionality of this server.

## License

This project is licensed under the ISC License.