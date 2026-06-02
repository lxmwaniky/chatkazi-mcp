export class ChatKaziClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.CHATKAZI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing CHATKAZI_API_KEY environment variable. Provide your key to authenticate.",
      );
    }
    this.apiKey = apiKey;
    this.baseUrl =
      process.env.CHATKAZI_BASE_URL || "https://api.chatkazi.app/api/v1";
  }

  private async request<T>(
    path: string,
    method: string = "GET",
    body?: any,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload.message ||
          payload.error ||
          `Request failed with status ${response.status}`,
      );
    }

    return payload as T;
  }

  async listSessions() {
    const response = await this.request<{ data: any[] }>("/sessions", "GET");
    return response.data;
  }

  async startSession(sessionId?: string) {
    return this.request<any>("/session/start", "POST", { sessionId });
  }

  async getSessionStatus(sessionId: string) {
    const encoded = encodeURIComponent(sessionId);
    return this.request<any>(`/session/status?sessionId=${encoded}`, "GET");
  }

  async getSessionQr(sessionId: string) {
    const encoded = encodeURIComponent(sessionId);
    return this.request<any>(`/session/qr?sessionId=${encoded}`, "GET");
  }

  async logoutSession(sessionId: string) {
    return this.request<any>("/session/logout", "POST", { sessionId });
  }

  async sendTextMessage(to: string, text: string, sessionId?: string) {
    return this.request<any>("/messages/text", "POST", {
      sessionId: sessionId || "default",
      to,
      text,
    });
  }

  async sendMediaMessage(params: {
    to: string;
    url: string;
    type?: string;
    caption?: string;
    mimetype?: string;
    fileName?: string;
    sessionId?: string;
  }) {
    return this.request<any>("/messages/media", "POST", {
      sessionId: params.sessionId || "default",
      to: params.to,
      url: params.url,
      type: params.type || "image",
      caption: params.caption,
      mimetype: params.mimetype,
      fileName: params.fileName,
    });
  }
}
