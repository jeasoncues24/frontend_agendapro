"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import CategoryServicesList from "./_components/CategoryServicesList";

export default function CategoryServicesPage() {
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
               {
                establishmentId && (
                    <CategoryServicesList companyId={companyId} establishmentId={establishmentId} />
                )
               }
            </div>
        </div>
    )
}