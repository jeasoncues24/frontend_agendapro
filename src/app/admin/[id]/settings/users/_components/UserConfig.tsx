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
  CirclePlus,
} from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

import { CreateUserModal, EditUserModal, DeleteUserModal } from "./UserModals"
import { createUser, updateUser, deleteUser } from "@/services/user.service"
import { customToast } from "@/components/ui/custom-toast"
import Image from "next/image"

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
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-black mb-1">Usuarios</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <CirclePlus className="h-16 w-16"/>
            Agregar usuario
          </Button>
        </div>
      </div>
      <div className="max-w-full mx-auto p-6 bg-white min-h-screen rounded-xl">
        {/* Search and Filters */}
        <div className="flex justify-end items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar usuario"
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
            {users.length === 0 ? (
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
                  {searchTerm ? "No se encontraron usuarios" : "No tienes usuarios aún"}
                </h3>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                  {searchTerm
                    ? "No se encontraron usuarios que coincidan con tu búsqueda. Intenta con otros términos."
                    : "Comienza creando tu primer usuarios. Es fácil y rápido."
                  }
                </p>
                {!searchTerm && (
                  <Button
                    className="flex items-center space-x-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear mi primer usuario</span>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-4"></TableHead>
                      <TableHead className="text-black font-semibold">Nombres</TableHead>
                      <TableHead className="text-black font-semibold">Rol</TableHead>
                      <TableHead className="text-black font-semibold">Email</TableHead>
                      <TableHead className="text-black font-semibold">Estado</TableHead>
                      <TableHead className="w-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id} className="bg-gray-50 rounded-xl shadow-sm my-2 align-middle">
                        <TableCell className="px-4 py-4">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium text-gray-900">{user.name}</TableCell>
                        <TableCell className="px-4 py-4 font-medium text-gray-900">{ROLES[user.role_id] || "Desconocido"}</TableCell>
                        <TableCell className="px-4 py-4 font-medium text-gray-900">{user.email}</TableCell>
                        <TableCell className="px-4 py-4">
                          {user.status === 1 ? (
                            <Badge className="bg-green-100 text-green-500 border-green-200">Activo</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-500 border-red-200">Inactivo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-4">
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
          </div >
        </div >

        {/* Sheet para ver información del usuario */}
        < Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} >
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
                        <svg className="w-3 h-3 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                        Activo
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
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
        </Sheet >

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
    </>

  )
}

export { CreateUserModal, EditUserModal, DeleteUserModal };
