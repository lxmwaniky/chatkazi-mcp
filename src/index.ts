#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ChatKaziClient } from "./client.js";
import { TOOLS } from "./tools.js";

const server = new Server(
  {
    name: "chatkazi-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

let client: ChatKaziClient;

try {
  client = new ChatKaziClient();
} catch (error: any) {
  console.error(`Initialization error: ${error.message}`);
  process.exit(1);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_sessions": {
        const sessions = await client.listSessions();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sessions, null, 2),
            },
          ],
        };
      }

      case "start_session": {
        const sessionArgs = (args as { sessionId?: string }) || {};
        const result = await client.startSession(sessionArgs.sessionId);
        return {
          content: [
            {
              type: "text",
              text: `Session start requested. Status: ${JSON.stringify(result)}`,
            },
          ],
        };
      }

      case "get_session_status": {
        const statusArgs = args as { sessionId: string };
        const result = await client.getSessionStatus(statusArgs.sessionId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_session_qr": {
        const qrArgs = args as { sessionId: string };
        const result = await client.getSessionQr(qrArgs.sessionId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "logout_session": {
        const logoutArgs = args as { sessionId: string };
        const result = await client.logoutSession(logoutArgs.sessionId);
        return {
          content: [
            {
              type: "text",
              text: `Logout requested. Status: ${JSON.stringify(result)}`,
            },
          ],
        };
      }

      case "send_whatsapp_text": {
        const textArgs = args as {
          to: string;
          text: string;
          sessionId?: string;
        };
        const result = await client.sendTextMessage(
          textArgs.to,
          textArgs.text,
          textArgs.sessionId,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "send_whatsapp_media": {
        const mediaArgs = args as {
          to: string;
          url: string;
          type?: string;
          caption?: string;
          fileName?: string;
          mimetype?: string;
          sessionId?: string;
        };
        const result = await client.sendMediaMessage(mediaArgs);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing tool '${name}': ${error.message}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ChatKazi MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
