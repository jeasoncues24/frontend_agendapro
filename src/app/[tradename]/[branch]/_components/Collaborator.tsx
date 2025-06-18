import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CollaboratorComponent({ professional }: { professional: any[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Profesionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {professional.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                    {p.initials}
                    </div>
                    <div>
                    <p className="font-medium text-sm">{p.name.split(" ")[0]}</p>
                    <p className="text-xs text-gray-500">{p.name.split(" ").slice(1).join(" ")}</p>
                    </div>
                </div>
                ))}
            </CardContent>
        </Card>
    )
}