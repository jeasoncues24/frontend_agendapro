import CompanyConfigComponent from "./_components/CompanyConfig";

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black flex-grow text-center">Configuración de la empresa</h1>
                <div className="w-24"></div>
            </div>

            <div>
                <CompanyConfigComponent />
            </div>
        </div>
    )
}