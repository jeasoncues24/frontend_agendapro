"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useService } from "@/hooks/useService";
import { CheckCircle, CheckCircle2, Circle, Download, MoreHorizontal, Plus, Search, Package, CirclePlus } from "lucide-react";
import { useState } from "react";
import { CreateServiceModal, DeleteServiceModal, EditServiceModal } from "./ServicesModals";
import { customToast } from "@/components/ui/custom-toast";
import { createServiceS, deleteServiceS, updateServiceS } from "@/services/service.service";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

// Función para obtener un color de badge basado en el nombre de la categoría
function getBadgeColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % badgeColors.length;
    return badgeColors[index];
}

// Función para formatear la fecha en español
function formatFecha(fechaStr: string) {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

export default function ServicesForClientsList({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {

    const [refreshKey, setRefreshKey] = useState(0);
    const { services, isLoading, error } = useService(companyId, establishmentId, refreshKey);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const filteredServices = services.filter((service: any) => service.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreateService = async (data: any) => {
        try {

            await createServiceS(data);
            customToast.success({ title: "Servicio creado", description: "El servicio fue creado correctamente." })
            setRefreshKey(k => k + 1)
        } catch (err: any) {
            customToast.error({ title: "Error", description: err.message })
        }
    }

    const handleDeleteService = async (service: any) => {
        try {
            await deleteServiceS(service.id)
            customToast.success({ title: "Servicio eliminado", description: "El servicio fue eliminado correctamente." })
            setRefreshKey(k => k + 1)
        } catch (err: any) {
            customToast.error({ title: "Error", description: err.message })
        }
    }

    const handleEditService = async (data: any) => {
        try {
            await updateServiceS(selectedService.id, data);
            customToast.success({ title: "Servicio actualizado", description: "El servicio fue actualizado correctamente." })
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
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Servicios</h1>
                </div>
                <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
                    <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors" onClick={() => setIsCreateModalOpen(true)}>
                        <CirclePlus className="w-4 h-4" />
                        <span>Crear servicio</span>
                    </Button>
                </div>
            </div>
            <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
                

                <div className="flex justify-end items-center mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar servicio"
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
                       
                        {filteredServices.length === 0 ? (
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
                                    {searchTerm ? "No se encontraron servicios" : "No tienes servicios aún"}
                                </h3>
                                <p className="text-gray-600 text-center mb-8 max-w-md">
                                    {searchTerm
                                        ? "No se encontraron servicios que coincidan con tu búsqueda. Intenta con otros términos."
                                        : "Comienza creando tu primer servicio para ofrecer a tus clientes. Es fácil y rápido."
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button
                                        className="flex items-center space-x-2"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Crear mi primer servicio</span>
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
                                            <TableHead className="text-black font-semibold">Duración</TableHead>
                                            <TableHead className="text-black font-semibold">Precio</TableHead>
                                            <TableHead className="text-black font-semibold">Categoria</TableHead>
                                            <TableHead className="text-black font-semibold">Estado</TableHead>
                                            <TableHead className="w-4"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredServices.map((service: any) => (
                                            <TableRow
                                                key={service.id}
                                                className="bg-gray-50 rounded-xl shadow-sm my-2 align-middle"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {service.image && (
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${service.image}`}
                                                                alt={service.name}
                                                                width={40}
                                                                height={40}
                                                                className="rounded object-cover border"
                                                                style={{ minWidth: 45, minHeight: 45, maxWidth: 45, maxHeight: 45 }}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{service.name}</TableCell>
                                                <TableCell>{service.duration} hora(s)</TableCell>
                                                <TableCell>S/ {service.price}</TableCell>
                                                <TableCell>
                                                    <Badge className={getBadgeColor(service.category.name)}>
                                                        {service.category.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {service.status === 1 ? (
                                                        <Badge className="bg-green-100 text-green-500 border-green-200">Activo</Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-500 border-red-200">Inactivo</Badge>
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
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedService(service);
                                                                    setIsSheetOpen(true);
                                                                }}
                                                            >
                                                                Ver
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedService(service);
                                                                setIsEditModalOpen(true);
                                                            }}>Editar</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedService(service); setIsDeleteModalOpen(true); }}>Eliminar</DropdownMenuItem>
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

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>{selectedService?.name}</SheetTitle>
                        </SheetHeader>
                        <Separator />
                        {selectedService && (

                            <div className="space-y-4 p-4">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-semibold line-clamp-1">{selectedService?.id}</h2>
                                            <Badge variant="secondary" className="bg-green-100 text-green-500 hover:bg-green-100">
                                                <CheckCircle2 className="h-4 w-4" /> Aprobado
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Creado el <span className="font-medium">{formatFecha(selectedService.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-base font-medium">Servicio</Label>
                                        <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                                {selectedService.image && (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV?.replace(/\/$/, '')}/${selectedService.image?.replace(/^\//, '')}`}
                                                        alt={selectedService.name}
                                                        width={200}
                                                        height={200}
                                                        className="rounded object-cover border"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-medium">{selectedService.name}</h3>
                                                <div className="text-sm text-muted-foreground space-y-0.5">
                                                    <div>{selectedService.category?.name} | Duración {selectedService.duration} hora(s)</div>
                                                    <div>S/ {selectedService.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Return Reason */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium">Imagen verificada</Label>
                                    <div className="p-3 bg-orange-50 border-l-4 border-orange-200 rounded-r-md">
                                        <p className="text-sm text-orange-400">La imagen se verifico correctamente.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium">Previsualización</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                                            <Image src={`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV?.replace(/\/$/, '')}/${selectedService.image?.replace(/^\//, '')}`} alt={selectedService.name} fill className="object-cover" />
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {selectedService.name}
                                            </div>
                                        </div>
                                        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                <Image src={`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV?.replace(/\/$/, '')}/${selectedService.image?.replace(/^\//, '')}`} alt={selectedService.name} fill className="object-cover" />
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {selectedService.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Estado</Label>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="status" className="text-sm text-gray-500">
                                                {selectedService.status === 1 ? "Activo" : "Inactivo"}
                                            </Label>
                                            <Switch id="status" checked={selectedService.status} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                <CreateServiceModal
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
                />
            </div>
        </>
    )
}