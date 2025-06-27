import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading/Loading";
import clsx from "clsx";

export default function SignButton ({ pending, initialIsDisable }: any) {
    return ( 
        <Button 
            type="submit"
            disabled={initialIsDisable}
            className={clsx({
                "w-full mt-4 h-12  rounded-xl text-center" : !pending && !initialIsDisable, 
                "bg-black/100 text-white border-gray-200  rounded-xl h-12 mt-4 w-full" : pending | initialIsDisable
            })}
        >
            { pending ? (
                <Loading
                    description="Ingresando"
                />
            ) : (
                "Ingresar"
            )}
        </Button>
       
    )
}