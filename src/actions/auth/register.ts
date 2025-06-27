'use client';

export const registerUser = async (user_name: string, email_company: string, password: string, bussines_name: string, trade_name: string, ruc: string,  number_company: string, city: number, district: number, provincia: number, direction: string, status: number = 1, type_company_id: number = 1, plan_id: number) => {

    try {

        const endpoint = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
            : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

        const params = {
            user_name,
            email: email_company,
            password,
            bussines_name,
            trade_name,
            identification: ruc,
            phone: number_company,
            city: Number(city),          
            district: Number(district),  
            provincia: Number(provincia), 
            address: direction,
            status,
            type_company_id: Number(type_company_id),
            plan_id: Number(plan_id),
        }


        const response = await fetch(`${endpoint}/company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });


        if (response.ok) {
            const data = await response.json();
            return {
                ok: true,
                user: data.user,
                message: 'Empresa creada correctamente',
            };
        } else {
            const errorData = await response.json();
            return {
                ok: false,
                message: errorData.message || 'No se pudo crear la empresa',
            };
        }


    } catch (error) {

        return {
            ok: false,
            message: 'No se pudo crear la empresa'
        }

    }

}
