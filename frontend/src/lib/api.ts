const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000";

export function getBackendApiUrl() {
  return BACKEND_API;
}

export async function apiCall(
  endpoint: string,
  method: string = "GET",
  data?: any,
  token?: string
) {
  const url = `${BACKEND_API}${endpoint}`;
  
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API call failed");
  }

  return response.json();
}

export async function fetchArticles(token?: string) {
  return apiCall("/api/articles", "GET", undefined, token);
}

export async function fetchArticleBySlug(slug: string, token?: string) {
  return apiCall(`/api/articles/${slug}`, "GET", undefined, token);
}

export async function createArticle(data: any, token: string) {
  return apiCall("/api/articles", "POST", data, token);
}

export async function updateArticle(id: string, data: any, token: string) {
  return apiCall(`/api/articles/${id}`, "PUT", data, token);
}

export async function deleteArticle(id: string, token: string) {
  return apiCall(`/api/articles/${id}`, "DELETE", undefined, token);
}

export async function register(email: string, password: string, firstName?: string, lastName?: string) {
  return apiCall("/api/auth/register", "POST", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
}

export async function login(email: string, password: string) {
  return apiCall("/api/auth/login", "POST", { email, password });
}

export async function getCurrentUser(token: string) {
  return apiCall("/api/auth/me", "GET", undefined, token);
}

export async function logout(token: string) {
  return apiCall("/api/auth/logout", "POST", {}, token);
}

export async function fetchPrayers(token?: string) {
  return apiCall("/api/prayers", "GET", undefined, token);
}

export async function createPrayer(data: any, token: string) {
  return apiCall("/api/prayers", "POST", data, token);
}

export async function fetchMarketplace(token?: string) {
  return apiCall("/api/marketplace", "GET", undefined, token);
}

export async function createMarketplaceItem(data: any, token: string) {
  return apiCall("/api/marketplace", "POST", data, token);
}

export async function fetchMessages(token: string) {
  return apiCall("/api/messages", "GET", undefined, token);
}

export async function sendMessage(receiverId: number, content: string, token: string) {
  return apiCall("/api/messages", "POST", { receiver_id: receiverId, content }, token);
}
