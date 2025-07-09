import cookies from "js-cookie";

const getEndpoint = () => process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

const getToken = () => {
    const token = cookies.get('authtoken');
    if (!token) throw new Error("Token de autenticación no disponible.");
    return token;
};

export const getCustomers = async ( establishment_id?: string ) => {
    const endpoint = getEndpoint();

    const url = new URL(`${endpoint}/customer/${establishment_id}`);
    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

export const createCustomer = async (data: any) => {
    const endpoint = getEndpoint();
    const response = await fetch(`${endpoint}/customer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
};

export const searchCustomers = async (query: string) => {
    const endpoint = getEndpoint();
    const response = await fetch(`${endpoint}/customer/search?q=${encodeURIComponent(query)}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
};

export const createCustomerApi = async (data: { name: string; phone: string; email: string; establishment_id: string }) => {
  const endpoint = getEndpoint();
  const response = await fetch(`${endpoint}/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

export const getActiveCustomersApi = async (establishment_id: string) => {
  const endpoint = getEndpoint();
  const response = await fetch(`${endpoint}/customer/actives/${establishment_id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};