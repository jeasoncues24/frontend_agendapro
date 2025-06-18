import cookies from "js-cookie";

const getEndpoint = () =>
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

const getToken = () => {
  const token = cookies.get("authtoken");
  if (!token) throw new Error("Token de autenticación no disponible.");
  return token;
};

export const getUsers = async (companyId: string, establishmentId?: string) => {
  const endpoint = getEndpoint();
  const token = getToken();

  const url = new URL(`${endpoint}/user`);
  url.searchParams.append("companyId", companyId);
  if (establishmentId) url.searchParams.append("establishmentId", establishmentId);

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
};

export const createUser = async (data: any) => {
  const endpoint = getEndpoint();
  const token = getToken();
  const response = await fetch(`${endpoint}/user`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const updateUser = async (id: string, data: any) => {
  const endpoint = getEndpoint();
  const token = getToken();
  const response = await fetch(`${endpoint}/user/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const deleteUser = async (id: string) => {
  const endpoint = getEndpoint();
  const token = getToken();
  const response = await fetch(`${endpoint}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}; 