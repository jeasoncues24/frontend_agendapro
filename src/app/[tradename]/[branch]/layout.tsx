import { Metadata } from "next"
import { CustomToaster } from "@/components/ui/custom-toast"

export const metadata: Metadata = {
    title: "AgendaYa",
    description: "Sistema de citas para barberias, spa, etc."
}

export default async function TradeNameLayout({
    children
} : {
    children: React.ReactNode
}) {
    return ( 
        <div className="flex justify-center bg-white">
            <CustomToaster />
            <div className="w-full sm:w-full">
                { children }
            </div>
        </div>
    )
}