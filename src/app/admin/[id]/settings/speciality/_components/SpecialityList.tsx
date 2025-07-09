"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, MoreHorizontal, Plus, Search, CirclePlus } from "lucide-react";
import { useState } from "react";
import { customToast } from "@/components/ui/custom-toast";
import { createServiceS, deleteServiceS, updateServiceS } from "@/services/service.service";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeciality } from "@/hooks/useSpeciality";

// Lista de colores de fondo para los badges
const badgeColors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-red-100 text-red-700 border-red-200",
];

function getBadgeColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % badgeColors.length;
    return badgeColors[index];
}

function formatFecha(fechaStr: string) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

export default function SpecialityList({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {

    const [refreshKey, setRefreshKey] = useState(0);
    const { speciality, isLoading, error } = useSpeciality(companyId, establishmentId, refreshKey);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpeciality, setSelectedSpeciality] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const filteredSpeciality = speciality.filter((specia: any) => specia.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateSpeciality = async (data: any) => {
        try {

            await createServiceS(data);
            customToast.success({ title: "Especialidad creada", description: "La especialidad fue creada correctamente." })
            setRefreshKey(k => k + 1)
        } catch (err: any) {
            customToast.error({ title: "Error", description: err.message })
        }
    }

    const handleDeleteSpeciality = async (service: any) => {
        try {
            await deleteServiceS(service.id)
            customToast.success({ title: "Especialidad eliminada", description: "La especialidad fue eliminada correctamente." })
            setRefreshKey(k => k + 1)
        } catch (err: any) {
            customToast.error({ title: "Error", description: err.message })
        }
    }

    const handleEditSpeciality = async (data: any) => {
        try {
            await updateServiceS(selectedSpeciality.id, data);
            customToast.success({ title: "Especializada actualizada", description: "La especialidad fue actualizada correctamente." })
            setRefreshKey(k => k + 1)
        } catch (err: any) {
            console.log(err)
            customToast.error({ title: "Error", description: err.message })
        }
    }

    return (
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Especialidades</h1>
                </div>
                <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
                    <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors" onClick={() => setIsCreateModalOpen(true)}>
                        <CirclePlus className="w-4 h-4" />
                        <span>Crear especialidad</span>
                    </Button>
                </div>
            </div>
            <div className="max-w-full mx-auto p-6 bg-white min-h-screen">

                <div className="flex justify-end items-center mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar especialidad"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-10 pr-10 py-2 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 border-0"
                        />
                        {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            tabIndex={-1}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        )}
                    </div>
                </div>

                <div>
                    <div className="p-0">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                                        <Skeleton className="w-12 h-12 rounded" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/3 rounded" />
                                            <Skeleton className="h-4 w-1/4 rounded" />
                                        </div>
                                        <Skeleton className="h-8 w-20 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredSpeciality.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-6">
                                <div className="flex items-center justify-center mb-6">
                                    <Image
                                        src="/images/empty.png"
                                        alt="empty"
                                        height={200}
                                        width={200}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm ? "No se encontraron especialidades" : "No tienes especialidades aún"}
                                </h3>
                                <p className="text-gray-600 text-center mb-8 max-w-md">
                                    {searchTerm
                                        ? "No se encontraron especialidades que coincidan con tu búsqueda. Intenta con otros términos."
                                        : "Comienza creando tu primer especialidad para vincular con tus profesionales. Es fácil y rápido."
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button
                                        className="flex items-center space-x-2"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Crear mi primer especialidad</span>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-4"></TableHead>
                                            <TableHead className="text-black font-semibold">Nombre</TableHead>
                                            <TableHead className="text-black font-semibold">Descripción</TableHead>
                                            <TableHead className="text-black font-semibold">Estado</TableHead>
                                            <TableHead className="w-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSpeciality.map((spec: any) => (
                                            <TableRow
                                                key={spec.id}
                                                className="bg-gray-50 rounded-xl shadow-sm my-2 align-middle"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                       
                                                    </div>
                                                </TableCell>
                                                <TableCell>{spec.name}</TableCell>
                                                <TableCell>{spec.description}</TableCell>
                                                <TableCell className=" py-4">
                                                    {spec.status === 1 ? (
                                                        <Badge className="bg-green-100 text-green-600 border-green-100 flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
                                                        Activo
                                                        </Badge>
                                                    )  : (
                                                        <Badge className="bg-red-200 text-red-600 border-red-200 flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                                                        Inactivo
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedSpeciality(spec);
                                                                setIsEditModalOpen(true);
                                                            }}>Editar</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedSpeciality(spec); setIsDeleteModalOpen(true); }}>Eliminar</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex justify-between items-center p-6">
                                    <span className="text-sm text-gray-700">Página 1 de 10</span>
                                    <div className="flex space-x-2">
                                        <Button
                                        className="h-12 px-6 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        >
                                        Anterior
                                        </Button>
                                        <Button
                                        className="h-12 px-6 rounded-lg border border-gray-200 bg-white text-gray-500 font-semibold hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === 1}
                                        >
                                        Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

              

                {/* <CreateServiceModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateService}
                    companyId={companyId}
                    establishmentId={establishmentId}
                />

                <DeleteServiceModal
                    open={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteService}
                    service={selectedService}
                />

                <EditServiceModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onEdit={handleEditService}
                    service={selectedService}
                    companyId={companyId}
                    establishmentId={establishmentId}
                /> */}
            </div>
        </>
    )
}