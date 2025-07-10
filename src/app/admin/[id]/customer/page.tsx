"use client";

import { useParams, useSearchParams } from "next/navigation";
import ListCustomer from "./_components/ListCustomer";
import { useEffect, useState } from "react";
import { useBranchStore } from "@/store/branchStore";
import Cookies from "js-cookie";

export default function CustomerPage() {

    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const branchIdFormUrl = searchParams?.get('branch');
    const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);

    const { selectedBranch } = useBranchStore();

    useEffect(() => {
        const user = Cookies.get('user');
        if ( user ) {
            if ( selectedBranch ) {
                setEstablishmentId(selectedBranch);
            }
        }
    }, [selectedBranch])

    return ( 
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div>
                { establishmentId && (
                    <ListCustomer companyId={companyId} establishmentId={establishmentId}/>
                )}
            </div>
        </div>
    )
}