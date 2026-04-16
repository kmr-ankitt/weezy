const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const GQL_URL =
  process.env.NEXT_PUBLIC_GQL_URL || "http://localhost:8000/graphql";

export async function gqlRequest<T, V = Record<string, unknown>>(
  query: string,
  variables?: V,
): Promise<T> {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    const message = json.errors
      .map((e: { message: string }) => e.message)
      .join(", ");
    throw new Error(`GraphQL Error: ${message}`);
  }

  return json.data;
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function postData<T, R>(url: string, data: T): Promise<R> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.error || "An error occurred while posting data.");
    }
    throw new Error(`Server Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function putData<T, R>(url: string, data: T): Promise<R> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.error || "An error occurred while updating data.");
    }
    throw new Error(`Server Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
