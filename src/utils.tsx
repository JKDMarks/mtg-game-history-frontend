// import { PLAYER_AUTH_KEY } from "./constants";

// export const setPlayerAuth = (authValue: string) =>
//   localStorage.setItem(PLAYER_AUTH_KEY, authValue);

// export const getPlayerAuth = () => localStorage.getItem(PLAYER_AUTH_KEY);

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
  // return await resp.json();
}

// export const encrypt = (message: string) => {
//   return CryptoJS.AES.encrypt(
//     message,
//     import.meta.env.VITE_SECRET_KEY
//   ).toString();
// };

// export const decrypt = (cipher: string) => {
//   const bytes = CryptoJS.AES.decrypt(cipher, import.meta.env.VITE_SECRET_KEY);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

export const getURLPathnameFromRequest = (request: Request) =>
  new URL(request.url).pathname;
