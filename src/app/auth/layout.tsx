import { Metadata } from "next"


export const metadata: Metadata = {
    title: "Autenticación | AgendaPro",
    description: "Sistema de citas para barberias, spa, etc."
}

export default async function AuthLayout({
    children
} : {
    children: React.ReactNode
}) {
    return ( 
        <div className="flex justify-center bg-white">
            <div className="w-full sm:w-full">
                { children }
            </div>
        </div>
    )
}