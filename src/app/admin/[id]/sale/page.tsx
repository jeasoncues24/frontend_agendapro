"use client";

import PlanFreeComponent from "@/components/plan-free";
import { getInformationSubscription } from "@/services/subscription.service";
import { SubscriptionInfo } from "@/types/subscription";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function SalePage() {

    const params = useParams();
    const companyId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SubscriptionInfo | null>(null)

    useEffect(() => {
        if (!companyId) return;
        setLoading(true);
        getInformationSubscription(companyId)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [companyId])


    if ( data?.acceso_pos === 0 ) {
        return (
            <PlanFreeComponent />
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Ventas</h2>
        </div>
    )
}