// Mock Next.js Request and Response
class MockRequest {
  public readonly nextUrl: URL;
  public readonly headers: Headers;

  constructor(input: string | URL, init?: RequestInit) {
    this.nextUrl = new URL(typeof input === 'string' ? input : input.toString());
    this.headers = new Headers(init?.headers);
  }

  json() {
    return Promise.resolve({});
  }
}

class MockResponse {
  public readonly headers: Headers;
  public readonly ok: boolean;
  public readonly status: number;
  public readonly statusText: string;
  public readonly type: ResponseType;
  public readonly url: string;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this.headers = new Headers(init?.headers);
    this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.type = 'default';
    this.url = '';
  }

  json() {
    return Promise.resolve({});
  }
}

class MockHeaders {
  private headers: { [key: string]: string } = {};

  append(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }

  delete(name: string): void {
    delete this.headers[name.toLowerCase()];
  }

  get(name: string): string | null {
    return this.headers[name.toLowerCase()] || null;
  }

  has(name: string): boolean {
    return name.toLowerCase() in this.headers;
  }

  set(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }
}

// Mock NextResponse
const NextResponse = {
  json: (data: any, init?: ResponseInit) => {
    const response = new MockResponse(JSON.stringify(data), init);
    Object.defineProperty(response, 'json', {
      value: () => Promise.resolve(data),
    });
    return response;
  },
};

// Setup global mocks
global.Request = MockRequest as any;
global.Response = MockResponse as any;
global.Headers = MockHeaders as any;

// Mock Next.js modules
jest.mock('next/server', () => ({
  NextResponse,
}));

// Setup test environment
import '@testing-library/jest-dom';
