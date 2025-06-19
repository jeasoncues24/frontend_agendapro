"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategoryService } from "@/hooks/useCategoryService";
import { Download, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";
import { CreateCategoryServiceModal, DeleteCategoryModal, EditCategoryModal } from "./CategoryServicesModals";
import { customToast } from "@/components/ui/custom-toast";
import { createCategoryService, deleteCategoryService, updateCategoryService } from "@/services/categoryservices.service";

export default function CategoryServicesList({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const { categoryServices, isLoading, error } = useCategoryService(companyId, establishmentId, refreshKey);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Filtrar categorías según el término de búsqueda
    const filteredCategories = categoryServices.filter((category: any) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateCategory = async (data: any) => {
        try {
            await createCategoryService(data)
            customToast.success({ title: "Categoria creada", description: "La categoria de servicio fue creada correctamente." })
            setRefreshKey(k => k + 1)
        } catch ( err: any ) {
            customToast.error({ title: "Error", description: err.message })
        }
    }

    
    const handleEditCategory = async (data: any) => {
        try {
        await updateCategoryService(selectedCategory.id, data)
        customToast.success({ title: "Categoria actualizada", description: "La categoria fue actualizado correctamente." })
        setRefreshKey(k => k + 1)
        } catch (err: any) {
        customToast.error({ title: "Error", description: err.message })
        }
    }

    const handleDeleteCategory = async (category: any) => {
        try {
        await deleteCategoryService(category.id)
        customToast.success({ title: "Categoria eliminada", description: "La categoria fue eliminada correctamente." })
        setRefreshKey(k => k + 1)
        } catch (err: any) {
        customToast.error({ title: "Error", description: err.message })
        }
    }

    return (
        <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Categorias de servicios</h1>
                    <p className="text-gray-600">Aquí puedes ver las categorias de los servicios de la sucursal.</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </Button>
                    <Button className="flex items-center space-x-2" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        <span>Crear categoria</span>
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nombre"
                        className="pl-10"
                        value={searchTerm ?? ""}
                        onChange={e => setSearchTerm(e.target.value ?? "")}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="font-medium text-gray-900">
                            Hay <span className="text-gray-500 font-normal">{categoryServices.length} categoria{categoryServices.length === 1 ? "" : "s"}</span>
                        </h3>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-4"></TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-4"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { filteredCategories.map(( category: any ) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-400 text-white font-bold">
                                                {(category.name && category.name.length > 0) ? category.name.charAt(0).toUpperCase() : "U"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        {category.status === 1 ? (
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
                                            <DropdownMenuItem onClick={() => { setSelectedCategory(category); setIsEditModalOpen(true); }}>Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedCategory(category); setIsDeleteModalOpen(true); }}>Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-between items-center p-6 border-t">
                        <span className="text-sm text-gray-700">Página 1 de 10</span>
                        <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                            Siguiente
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <CreateCategoryServiceModal 
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateCategory}
                companyId={companyId}
                establishmentId={establishmentId}
            />

            <EditCategoryModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEdit={handleEditCategory}
                category={selectedCategory}
                companyId={companyId}
                establishmentId={establishmentId}
            />

            <DeleteCategoryModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteCategory}
                category={selectedCategory}
            />
        </div>
    )
}

export { CreateCategoryServiceModal, EditCategoryModal, DeleteCategoryModal }