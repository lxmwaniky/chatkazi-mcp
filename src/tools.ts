import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TOOLS: Tool[] = [
  {
    name: "list_sessions",
    description:
      "List all WhatsApp sessions connected to the ChatKazi account.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "start_session",
    description: "Initialize a new WhatsApp session connection.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description:
            "Optional custom identifier for the session. Defaults to 'default'.",
        },
      },
    },
  },
  {
    name: "get_session_status",
    description:
      "Check the current state of a specific WhatsApp session (e.g., connected, qr_ready).",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The identifier of the session to check.",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "get_session_qr",
    description:
      "Retrieve the QR code pairing link for an initialized session.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The identifier of the session.",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "logout_session",
    description:
      "Disconnect and log out a WhatsApp session, clearing its authentication state.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The identifier of the session to log out.",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "send_whatsapp_text",
    description: "Send a plain text WhatsApp message to a recipient.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description:
            "Recipient phone number in international format without spaces or '+' (e.g., '254712345678').",
        },
        text: {
          type: "string",
          description: "The message body text.",
        },
        sessionId: {
          type: "string",
          description:
            "Optional WhatsApp session identifier to send from. Defaults to 'default'.",
        },
      },
      required: ["to", "text"],
    },
  },
  {
    name: "send_whatsapp_media",
    description:
      "Send a media message (image, video, audio, or document) to a recipient.",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description:
            "Recipient phone number in international format without spaces or '+' (e.g., '254712345678').",
        },
        url: {
          type: "string",
          description: "Publicly accessible URL of the media file to send.",
        },
        type: {
          type: "string",
          description:
            "Type of media being sent: 'image', 'video', 'audio', or 'document'. Defaults to 'image'.",
          enum: ["image", "video", "audio", "document"],
        },
        caption: {
          type: "string",
          description:
            "Optional text caption for image, video, or document messages.",
        },
        fileName: {
          type: "string",
          description: "Optional display name for document messages.",
        },
        mimetype: {
          type: "string",
          description: "Optional recommended MIME type for the media file.",
        },
        sessionId: {
          type: "string",
          description:
            "Optional WhatsApp session identifier to send from. Defaults to 'default'.",
        },
      },
      required: ["to", "url"],
    },
  },
];
