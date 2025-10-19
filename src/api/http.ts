export class Http {
  private baseUrl: string;
  private getUserId: () => string | null;

  constructor(baseUrl: string, getUserId: () => string | null) {
    this.baseUrl = baseUrl;
    this.getUserId = getUserId;
  }

  async get<T>(path: string): Promise<T> {
    const r = await fetch(this.baseUrl + path, { headers: this.h(false) });
    return this.ok<T>(r);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const r = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: this.h(true),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.ok<T>(r);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const r = await fetch(this.baseUrl + path, {
      method: "PUT",
      headers: this.h(true),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.ok<T>(r);
  }

  private h(json: boolean) {
    const headers: Record<string, string> = {};
    const uid = this.getUserId();
    if (uid) headers["X-User-Id"] = uid;
    if (json) headers["Content-Type"] = "application/json";
    return headers;
  }

  private async ok<T>(r: Response): Promise<T> {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return (await r.json()) as T;
  }
}
