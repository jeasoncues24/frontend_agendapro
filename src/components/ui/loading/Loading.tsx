import { Loader } from "lucide-react";

interface Props {
    description: string;
}


export const Loading = ({ description }: Props ) => {
    return( 
        <div className="flex justify-center items-center">
            <Loader className="animate-spin text-md" /> 
            <p className="mx-2">{ description }</p>
        </div>
    );
}