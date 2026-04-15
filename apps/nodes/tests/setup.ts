import { beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Initialize the MSW server with no handlers initially
// We will add handlers in individual tests for more specific control
export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
