import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeaderTradeName from "./HeaderTradeName";

export default function EmptyBranchPage() {
    return (
        <>
            <HeaderTradeName />

            <div className="text-center mt-40">
                <Image
                    src="/images/offline.webp"
                    alt="offline"
                    height={200}
                    width={200}
                    className="mx-auto"
                />
                <h2 className="mt-4 text-4xl font-bold">Lo sentimos</h2>
                <p className="mt-2 text-gray-500">No hemos encontrado nada aquí.</p>
                <Button className="h-12 bg-[#29D884] hover:bg-[#29D884] mt-8 w-[160px]">
                    Ir al inicio
                </Button>
            </div>
        </>
    )
}