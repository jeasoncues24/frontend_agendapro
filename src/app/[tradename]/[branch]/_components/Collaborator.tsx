import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CollaboratorComponent({ professional }: { professional: any[] }) {
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Profesionales</h3>
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {professional.map((p: any) => (
                        <div key={p.id} className="flex-shrink-0 text-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mb-2 bg-gray-200 mx-auto">
                                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                                    {p.initials}
                                </div>
                            </div>
                            <p className="text-xs text-gray-900 font-medium">{p.name}</p>
                            <p className="text-xs text-gray-600">{p.lastName}</p>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center gap-1 mt-3">
                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    )
}