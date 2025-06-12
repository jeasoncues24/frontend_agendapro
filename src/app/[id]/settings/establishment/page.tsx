import BackButton from "@/components/back-button";
import ListEstablishment from "./_components/ListEstablishment";



export default function EstablishmentPage() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div className="mb-6 flex items-center justify-between">
                <BackButton />
            </div>
            
            <div>
                <ListEstablishment />
            </div>
        </div>
    )
}