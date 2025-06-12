import BackButton from "@/components/back-button";
import CreateUserComponent from "../_components/CreateUser";

export default function CreatePage() {
    return ( 
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div className="mb-6 flex items-center justify-between">
                <BackButton />
            </div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex-grow text-center">Crear usuario</h1>
                <div className="w-24"></div>
            </div>
            <div>
                <CreateUserComponent />
            </div>
        </div>
    )
}