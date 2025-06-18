import { Button } from "@/components/ui/button";

export default function HeaderTradeName() {
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">AgendaPro</span>
                        <span className="text-sm text-gray-500 font-medium">cloud</span>
                    </div>
                </div>
            </div>
            <Button variant="ghost" className="text-gray-600">
                Iniciar sesión
            </Button>
            </div>
        </header>
    )
}