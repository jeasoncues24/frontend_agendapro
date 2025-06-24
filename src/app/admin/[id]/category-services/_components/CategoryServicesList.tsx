"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategoryService } from "@/hooks/useCategoryService";
import { CirclePlus, Download, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";
import { CreateCategoryServiceModal, DeleteCategoryModal, EditCategoryModal } from "./CategoryServicesModals";
import { customToast } from "@/components/ui/custom-toast";
import { createCategoryService, deleteCategoryService, updateCategoryService } from "@/services/categoryservices.service";
import Image from "next/image";

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
        } catch (err: any) {
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
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-semibold text-gray-900 mb-1">Categorias de servicios</h1>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors" onClick={() => setIsCreateModalOpen(true)}>
                        <CirclePlus className="w-16 h-16" />
                        <span>Crear categoria</span>
                    </Button>
                </div>
            </div>
            <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
                <div className="flex justify-end items-center mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                        type="text"
                        placeholder="Buscar categoria"
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
                        {filteredCategories.length === 0 ? (
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
                                    {searchTerm ? "No se encontraron categorias de servicios" : "No tienes categorias de servicios aún"}
                                </h3>
                                <p className="text-gray-600 text-center mb-8 max-w-md">
                                    {searchTerm
                                        ? "No se encontraron categorias de servicios que coincidan con tu búsqueda. Intenta con otros términos."
                                        : "Comienza creando tu primera categoria de servicio para ofrecer a tus clientes. Es fácil y rápido."
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button
                                        className="flex items-center space-x-2"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Crear mi primer categoria</span>
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
                                        {filteredCategories.map((category: any) => (
                                            <TableRow key={category.id} className="bg-gray-50 rounded-xl shadow-sm my-2 align-middle">
                                                <TableCell className="px-4 py-4">
                                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                                                </TableCell>
                                                <TableCell className="px-4 py-4 font-medium text-gray-900">{category.name}</TableCell>
                                                <TableCell className="font-medium text-gray-900">{category.description}</TableCell>
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
                                                            <DropdownMenuItem className="text-red-600 hover:text-red-500" onClick={() => { setSelectedCategory(category); setIsDeleteModalOpen(true); }}>Eliminar</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table >

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
                        )
                        }

                    </div>
                </div >

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
        </>
    )
}

export { CreateCategoryServiceModal, EditCategoryModal, DeleteCategoryModal }