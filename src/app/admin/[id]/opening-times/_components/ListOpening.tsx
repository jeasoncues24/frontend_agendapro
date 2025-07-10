import { useState, useEffect } from "react";
import { getBranchStatus, updateBranchStatus } from "@/services/branch.service";
import { customToast } from "@/components/ui/custom-toast";
import { useBranchStore } from "@/store/branchStore";

export default function ListOpening({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
    const branchId = establishmentId;
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setIsOpenStore = useBranchStore((state) => state.setIsOpen);

    useEffect(() => {
        if (!branchId) return;
        setLoading(true);
        getBranchStatus(branchId)
            .then((status) => {
                setIsOpen(status === 1);
                setIsOpenStore(status === 1);
            })
            .catch(() => setError("No se pudo obtener el estado del local."))
            .finally(() => setLoading(false));
    }, [branchId]);

    const handleToggle = async () => {
        if (!branchId || isOpen === null) return;
        setLoading(true);
        setError(null);
        try {
            const newStatus = isOpen ? 0 : 1;
            await updateBranchStatus(branchId, newStatus);
            setIsOpen(!isOpen);
            setIsOpenStore(!isOpen);
            customToast.success({
                title: `El local ha sido ${!isOpen ? 'abierto' : 'cerrado'}`,
                description: `El estado del local se actualizó a ${!isOpen ? 'abierto' : 'cerrado'}.`
            });
        } catch (e) {
            setError("No se pudo actualizar el estado del local.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Estado de tu local</h1>
                </div>
            </div>
            <div className="relative min-h-screen bg-white p-8">
                {/* Estado visual en la esquina superior derecha */}
                <div className="absolute top-6 right-8 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-gray-500'}`}>{isOpen ? 'Abierto' : 'Cerrado'}</span>
                </div>

                <div className="flex flex-col gap-8 max-w-2xl ">
                    <div className="flex items-center gap-4  p-6">
                        {/* Switch */}
                        <button
                            className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none ${isOpen ? 'bg-green-500' : 'bg-gray-400'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleToggle}
                            aria-label={isOpen ? 'Cerrar local' : 'Abrir local'}
                            disabled={loading || isOpen === null}
                        >
                            <span
                                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${isOpen ? 'translate-x-6' : ''}`}
                            ></span>
                        </button>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Estado de tu local</span>
                            <span className="text-sm text-gray-500">{isOpen ? 'Abierto dependiendo tu horario.' : 'Cerrado por hoy.'}</span>
                            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}