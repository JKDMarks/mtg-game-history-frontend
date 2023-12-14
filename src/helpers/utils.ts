import { Player } from "./types";

export type HTTPMethod = "GET" | "POST";

export async function callAPI(
  route: string,
  options?: { method?: HTTPMethod; body?: object }
) {
  const headers = options?.body
    ? { "Content-Type": "application/json" }
    : undefined;

  return await fetch(import.meta.env.VITE_API_URL + route, {
    method: options?.method ?? "GET",
    mode: "cors",
    credentials: "include",
    body: options?.body ? JSON.stringify(options.body) : null,
    headers: {
      ...headers,
    },
  });
}

export const getURLPathnameFromRequest = (request: Request) =>
  new URL(request.url).pathname;

export const getPlayerName = (player?: Player) =>
  player?.name ?? player?.username;
