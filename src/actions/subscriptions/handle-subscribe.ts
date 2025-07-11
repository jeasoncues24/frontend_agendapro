'use server'

import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { redirect } from "next/navigation";

const config = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!
})

export const handleSubscriber = async( formData: FormData ) => {
    const subscriptionCost = formData.get('subscriptionCost')?.toString() ?? '';

    if ( subscriptionCost === '' ) {
        console.log('El costo de suscripcion es requerido');
        return;
    }

    const preApproval = new PreApproval(config);
    const newSubscriber = await preApproval.create({
        body: {
            payer_email: "", // Hace referencia a un email de MercadoPago. Una cuenta asociada y activa de MercadoPago
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                transaction_amount: Number(subscriptionCost),
                currency_id: 'PEN' // MONEDA PERUANA // https://api.mercadopago.com/currencies
            },
            reason: "", // Hace referencia al nombre de la suscripcion => motivo de cobro de la suscripcion
            status: "pending", // Método de pago pendiente
            back_url: "http://localhost:3000/success"
        }
    })

    console.dir({ newSubscriber }, { depth: null });
    redirect(newSubscriber.init_point!) // redireccionamos al suscriptor nuevo
}