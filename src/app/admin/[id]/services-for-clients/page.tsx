"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import ServicesForClientsList from "./_components/ServicesForClientsList";

export default function ServicesForClientes() {
    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const branchIdFormUrl = searchParams?.get('branch');
    const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);

    useEffect(() => {

        const user = cookies.get('user');
        if ( user ) {
            const data = JSON.parse(user);
            setEstablishmentId(branchIdFormUrl || data.company.firstEstablishment?.id);
        }

    }, [branchIdFormUrl]);


    return ( 
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div>
                { establishmentId && (
                    <ServicesForClientsList companyId={companyId} establishmentId={establishmentId}/>
                )}
            </div>
        </div>
    )
}