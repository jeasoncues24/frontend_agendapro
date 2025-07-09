"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Loader2
} from "lucide-react"
import { useBranches } from "@/hooks/useBranchCompany"
import EditBranchModal from "./EditBranchModal"
import { toast } from "sonner"
import { updateBranch, getBranchDetails, deleteBranch } from "@/services/branches/branchService"
import { customToast } from "@/components/ui/custom-toast"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { addBranch } from "@/services/branch.service"
import { Skeleton } from "@/components/ui/skeleton"

interface Inquiry {
  id: string
  inquiryNumber: string
  name: string
  submittedDate: string
  status: "Processing" | "Success" | "On hold" | "Drafts"
  executedBy: {
    name: string
    email: string
  }
}

interface Props {
  id: string;
}

export default function ListEstablishment({ id }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const { branches, isLoading, error } = useBranches(id, refreshKey);
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    ubication: "",
    companyId: "",
    status: 1
  });
  const [createErrors, setCreateErrors] = useState<{ [key: string]: string }>({});
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter()

  const openEditModal = async (branch: any) => {
    try {
      const branchDetails = await getBranchDetails(branch.id);
      setSelectedBranch(branchDetails);
      setIsEditModalOpen(true);
    } catch (error) {
      customToast.error({
        title: "Error",
        description: "No se pudieron obtener los detalles de la sucursal"
      });
    }
  }

  const handleEditBranch = async (branchData: any) => {
    try {
      if (!selectedBranch?.id) {
        customToast.error({
          title: "Error",
          description: "No se ha seleccionado una sucursal para editar"
        });
        return;
      }

      if (branchData instanceof FormData) {
        await updateBranch(selectedBranch.id, branchData)
      } else {
        await updateBranch(selectedBranch.id, {
          name: branchData.name,
          ubication: branchData.ubication,
          banner_path: branchData.banner_path,
        })
      }

      customToast.success({
        title: "Operación exitosa",
        description: "Sucursal actualizada correctamente"
      });
      setRefreshKey((k) => k + 1);
      setIsEditModalOpen(false);
    } catch (error) {
      customToast.error({
        title: "Error",
        description: `${error}`
      });
      throw error;
    }
  }

  const closeEditModal = () => {
    setSelectedBranch(null)
    setIsEditModalOpen(false)
  }

  const handleCreateEstablishment = async (data: any) => {
    setIsCreating(true);
    try {

      console.log(id)
      console.log(data)

      await addBranch(data);

      customToast.success({
        title: "Sucursal creada",
        description: "La sucursal fue creada correctamente."
      });
      setRefreshKey((k) => k + 1);
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        ubication: "",
        companyId: id,
        status: 1
      });
      setCreateErrors({});
    } catch (error: any) {
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        ubication: "",
        companyId: id,
        status: 1
      });
      customToast.error({
        title: "Error",
        description: `${error?.message}`
      });
    } finally {
      setIsCreating(false);
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
    if (createErrors[field]) {
      setCreateErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!createForm.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (createForm.name.trim().length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!createForm.ubication.trim()) {
      errors.ubication = "La ubicación es obligatoria";
    } else if (createForm.ubication.trim().length < 5) {
      errors.ubication = "La ubicación debe tener al menos 5 caracteres";
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleCreateSubmit = () => {
    if (!validateForm()) {
      customToast.error({
        title: "Campos inválidos",
        description: "Por favor, corrige los errores en el formulario."
      });
      return;
    }
    handleCreateEstablishment({
      ...createForm,
      companyId: id
    });
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      name: "",
      ubication: "",
      companyId: id,
      status: 1
    });
    setCreateErrors({});
    setIsCreating(false);
  }

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    try {
      await deleteBranch(branchToDelete.id);
      customToast.success({
        title: "Sucursal eliminada",
        description: `La sucursal '${branchToDelete.name}' fue eliminada correctamente.`
      });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      customToast.error({
        title: "Error",
        description: `No se pudo eliminar la sucursal. ${error}`
      });
    } finally {
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
    }
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-500">Error al cargar las sucursales: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-black mb-1">Sucursales</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            <Button  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors"
            onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-16 h-16" />
              <span>Crear sucursal</span>
            </Button>
          </div>
      </div>
      <div className="max-w-full mx-auto p-6 bg-white min-h-screen">

        <div className="flex justify-end items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar sucursal"
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

        {/* Data Table */}
        <div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4"></TableHead>
                  <TableHead className="text-black font-semibold">Nombres</TableHead>
                  <TableHead className="text-black font-semibold">Ubicación</TableHead>
                  <TableHead className="text-black font-semibold">ID</TableHead>
                  <TableHead className="w-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {[1,2,3].map(i => (
                      <TableRow key={i} className="bg-white">
                        <TableCell><Skeleton className="w-5 h-5 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 rounded" /></TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : currentBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No se encontraron sucursales.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBranches.map((branch) => (
                    <TableRow key={branch.id} className="bg-gray-50 rounded-xl shadow-sn my-2 align-middle">
                      <TableCell className="px-4 py-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{branch.name}</TableCell>
                      <TableCell className="text-gray-900">{branch.address}</TableCell>
                      <TableCell className="text-gray-900">{branch.id}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-8 h-8" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(branch)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:text-red-500" onClick={() => { setBranchToDelete(branch); setIsDeleteModalOpen(true); }}>
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-6 border-t">
              <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
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
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>

        <EditBranchModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleEditBranch}
          branch={selectedBranch}
        />

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">¿Eliminar sucursal?</DialogTitle>
            </DialogHeader>
            <p className="text-gray-500">¿Estás seguro de que deseas eliminar la sucursal <b>{branchToDelete?.name}</b>? Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="h-10 cursor-pointer" variant="destructive" onClick={handleDeleteBranch}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Crear nueva sucursal</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2 relative">
                <input
                  type="text"
                  id="nombre"
                  name="name"
                  value={createForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${createErrors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="nombre"
                  className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                    ${createForm.name ? 'top-1.5 text-sm text-blue-600' : ''}`}
                >
                  Nombre
                </label>
                {createErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{createErrors.name}</p>
                )}
              </div>

              <div className="space-y-2 relative">
                <input
                  type="text"
                  id="ubication"
                  name="ubication"
                  value={createForm.ubication}
                  onChange={(e) => handleFormChange('ubication', e.target.value)}
                  className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${createErrors.ubication ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="ubication"
                  className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                    ${createForm.ubication ? 'top-1.5 text-sm text-blue-600' : ''}`}
                >
                  Ubicación
                </label>
                {createErrors.ubication && (
                  <p className="text-red-500 text-xs mt-1">{createErrors.ubication}</p>
                )}

            </div>
          </div>

            <DialogFooter>
              <Button className="h-10 border-blue-600 text-blue-600 font-semibold hover:bg-transparent hover:text-blue-700 cursor-pointer" variant="outline" onClick={handleCloseCreateModal} disabled={isCreating}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" onClick={handleCreateSubmit} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
