"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { updateBranch, getBranchDetails } from "@/services/branches/branchService"
import { customToast } from "@/components/ui/custom-toast"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { branches, isLoading, error } = useBranches(id);
  const [dateRange, setDateRange] = useState("Jan 6, 2024 – Jan 13, 2024")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)

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

      await updateBranch(selectedBranch.id, {
        name: branchData.name,
        ubication: branchData.ubication,
        banner_path: branchData.banner_path
      });

      customToast.success({
        title: "Operación exitosa",
        description: "Sucursal actualizada correctamente"
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-600">Cargando sucursales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-500">Error al cargar las sucursales: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sucursales</h1>
          <p className="text-gray-600">Aqui puedes ver las sucursales de la empresa.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button className="bg-[#25B562] hover:bg-[#25B562] flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Crear sucursal</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre o dirección"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="font-medium text-gray-900">
              Hay <span className="text-gray-500 font-normal">{filteredBranches.length} sucursales</span>
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4"></TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No se encontraron sucursales.
                  </TableCell>
                </TableRow>
              ) : (
                currentBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="w-4"></TableCell>
                    <TableCell className="font-medium text-gray-900">{branch.name}</TableCell>
                    <TableCell className="text-gray-600">{branch.address}</TableCell>
                    <TableCell className="text-gray-600">{branch.id}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(branch)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleEditBranch}
        branch={selectedBranch}
      />
    </div>
  )
}
