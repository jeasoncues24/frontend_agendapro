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
} from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

import { CreateUserModal, EditUserModal, DeleteUserModal } from "./UserModals"
import { createUser, updateUser, deleteUser } from "@/services/user.service"
import { customToast } from "@/components/ui/custom-toast"

const ROLES: Record<number, string> = {
  1: "Super Admin",
  2: "Admin",
  3: "Gerente",
  4: "Colaborador",
  5: "Cliente"
};

export default function UserConfigComponent({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const { users, isLoading, error } = useUsers(companyId, establishmentId, refreshKey)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


  const handleCreateUser = async (data: any) => {
    try {
      await createUser(data)
      customToast.success({ title: "Usuario creado", description: "El usuario fue creado correctamente." })
      setRefreshKey(k => k + 1)
    } catch (err: any) {
      customToast.error({ title: "Error", description: err.message })
    }
  }

  const handleEditUser = async (data: any) => {
    try {
      await updateUser(selectedUser.id, data)
      customToast.success({ title: "Usuario actualizado", description: "El usuario fue actualizado correctamente." })
      setRefreshKey(k => k + 1)
    } catch (err: any) {
      customToast.error({ title: "Error", description: err.message })
    }
  }

  const handleDeleteUser = async (user: any) => {
    try {
      await deleteUser(user.id)
      customToast.success({ title: "Usuario eliminado", description: "El usuario fue eliminado correctamente." })
      setRefreshKey(k => k + 1)
    } catch (err: any) {
      customToast.error({ title: "Error", description: err.message })
    }
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Usuarios</h1>
          <p className="text-gray-600">Aquí puedes ver los usuarios por sucursal.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button className="flex items-center space-x-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Crear usuario</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre"
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
              Hay <span className="text-gray-500 font-normal">{users.length} usuario{users.length === 1 ? "" : "s"}</span>
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4"></TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-400 text-white font-bold">
                        {(user.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{ROLES[user.role_id] || "Desconocido"}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    {user.status === 1 ? (
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
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsSheetOpen(true); }}>Ver</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
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

      {/* Sheet para ver información del usuario */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Información del usuario</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="flex flex-col items-center py-8 px-2">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full text-white bg-blue-500 text-2xl">
                {(selectedUser.name && selectedUser.name.length > 0) ? selectedUser.name.charAt(0).toUpperCase() : "U"}
              </span>
              <div className="text-center mb-6">
                <div className="font-bold text-lg text-gray-900">{selectedUser.name}</div>
                <div className="text-gray-500 text-sm">{selectedUser.email}</div>
              </div>
              <div className="w-full max-w-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">ID</span>
                  <span className="font-mono text-xs text-gray-700 truncate max-w-[140px]">{selectedUser.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Rol</span>
                  <span className="font-medium text-xs text-gray-700">{ROLES[selectedUser.role_id] || "Desconocido"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estado</span>
                  {selectedUser.status === 1 ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                      Activo
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                      Inactivo
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Creado</span>
                  <span className="text-xs text-gray-700">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Actualizado</span>
                  <span className="text-xs text-gray-700">{selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "-"}</span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
        companyId={companyId}
        establishmentId={establishmentId}
      />

      <EditUserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditUser}
        user={selectedUser}
        companyId={companyId}
        establishmentId={establishmentId}
      />

      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  )
}

export { CreateUserModal, EditUserModal, DeleteUserModal };
