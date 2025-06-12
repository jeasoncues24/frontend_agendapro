import BackButton from "@/components/back-button";
import ListCustomer from "./_components/ListCustomer";

export default function CustomerPage() {
    return ( 
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div className="mb-6 flex items-center justify-between">
                <BackButton />
            </div>
                <ListCustomer />
            <div>
            </div>
        </div>
    )
}