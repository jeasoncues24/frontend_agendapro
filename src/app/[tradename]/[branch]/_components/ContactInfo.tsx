import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";


interface CompanyData {
    id: string;
    trade_name: string;
    bussines_name: string;
    phone: string;
    address: string;
    logo_path: string;
}

interface BranchData {
    id: string;
    name: string;
    ubication: string;
    banner_path: string;
}

interface BranchApiResponse {
    company: CompanyData;
    branch: BranchData;
}

export default function ContactInfo( data : BranchApiResponse) {
    return (
        <Card>
            <div>
                <div className="h-48 bg-blue-100 relative rounded-xl overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.915964893982!2d-72.94246368469238!3d-41.4711959792537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9616363e2e2e2e2e%3A0x1234567890abcdef!2sJuan%20Soler%20Manfredini%2041%2C%20Puerto%20Montt%2C%20Llanquihue%2C%20Chile!5e0!3m2!1ses!2scl!4v1718820000000!5m2!1ses!2scl"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación"
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-200/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                        <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=Juan%20Soler%20Manfredini%2041,%20Puerto%20Montt,%20Llanquihue,%20Chile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 text-xs font-medium text-blue-700 shadow hover:bg-blue-50 transition"
                    >
                        Ver en Google Maps
                    </a>
                </div>
            </div>
            <CardContent className="p-4 space-y-3">
                
                <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{data.branch.ubication}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">{data.company.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">¡Contáctanos por Whatsapp!</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                    <Clock className="w-4 h-4" />
                    <Button variant="link" className="p-0 h-auto text-xs text-gray-600">
                        Ver horario
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}