import cookies from "js-cookie";

const getEndpoint = () =>
    process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
        : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;


export const getAvailableProfessionals = async (
  establishmentId: string,
  serviceId: string,
  date: string,
  time: string
) => {
  const endpoint = getEndpoint();
  const url = `${endpoint}/availability/professionals?establishment_id=${establishmentId}&service_id=${serviceId}&date=${date}&time=${time}`;

  console.log("Antes de fetch", url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': `Bearer ${token}` // <-- ¿Debería ir aquí?
    }
  });
  console.log("Después de fetch", response);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}; 

export async function fetchAvailableProfessionalsMulti(
  establishmentId: string,
  serviceIds: string[],
  date: string,
  startTime: string
) {
  const params = new URLSearchParams({
    establishment_id: establishmentId,
    service_ids: serviceIds.join(","),
    date,
    start_time: startTime,
  });
  const endpoint = getEndpoint();
  const res = await fetch(`${endpoint}/availability/professionals/multi?${params.toString()}`);
  if (!res.ok) throw new Error("Error fetching professionals");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
} 