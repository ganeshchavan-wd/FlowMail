const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch(
  path: string,
  options?: RequestInit
) {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  return response;
}