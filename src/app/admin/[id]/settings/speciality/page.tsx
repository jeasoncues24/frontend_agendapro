"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { useBranchStore } from "@/store/branchStore";
import SpecialityList from "./_components/SpecialityList";

export default function SpecialityPage() {
    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const branchIdFormUrl = searchParams?.get('branch');
    const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);
    const { selectedBranch } = useBranchStore();

    useEffect(() => {

        const user = cookies.get('user');
        if ( user ) {
            if ( selectedBranch ) {
                setEstablishmentId(selectedBranch)
            }
        }

    }, [selectedBranch]);


    return ( 
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div>
                { establishmentId && (
                    <SpecialityList companyId={companyId} establishmentId={establishmentId}/>
                )}
            </div>
        </div>
    )
}