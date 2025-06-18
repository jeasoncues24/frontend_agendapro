import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactInfo() {
    return (
        <Card>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Oficina 101 urba</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">51957532973</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">¡Contáctanos por Whatsapp!</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <Button variant="link" className="p-0 h-auto text-sm text-gray-600">
                        Ver horario
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}