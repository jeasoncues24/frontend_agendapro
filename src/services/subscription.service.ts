import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
  : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV || 'http://localhost:5000/api/v1';

export interface SubscriptionStatusResponse {
  status: boolean;
  active: boolean;
  daysLeft: number;
  subscription: {
    id: number;
    planId: number;
    date_start: string;
    date_finish: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    companyId: string;
  };
}

export const getSubscriptionStatus = async (companyId: string): Promise<SubscriptionStatusResponse> => {
  const token = Cookies.get('authtoken');
  if (!token) throw new Error('Token de autenticación no disponible.');

  const url = `${API_URL}/subscription/status?companyId=${companyId}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error al obtener el estado de la suscripción: ${response.status}`);
  }

  return await response.json();
};

export const getInformationSubscription = async ( companyId: string ) => {
  const token = Cookies.get('authtoken');
  if (!token) throw new Error('Token de autenticación no disponible.');

  const url = `${API_URL}/subscription?companyId=${companyId}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error al obtener la información de la suscripción: ${response.status}`);
  }

  return await response.json();
}

// export default { getSubscriptionStatus }; 