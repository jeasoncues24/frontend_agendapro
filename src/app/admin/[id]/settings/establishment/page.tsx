"use client";

import { useParams } from "next/navigation";
import ListEstablishment from "./_components/ListEstablishment";



export default function EstablishmentPage() {
    const params = useParams()
    const companyId = params.id as string 
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div>
                <ListEstablishment id={companyId}/>
            </div>
        </div>
    )
}