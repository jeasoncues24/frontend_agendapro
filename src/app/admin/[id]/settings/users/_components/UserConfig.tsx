"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  CirclePlus,
  Clock,
  Check,
  ChevronDownIcon,
} from "lucide-react"
import { useUsers } from "@/hooks/useUsers"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useShift } from "@/hooks/useShift"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"

import { CreateUserModal, EditUserModal, DeleteUserModal } from "./UserModals"
import { createUser, updateUser, deleteUser } from "@/services/user.service"
import { customToast } from "@/components/ui/custom-toast"
import Image from "next/image"
import { useUserShifts } from "@/hooks/useUserShifts"
import { useAssignShifts } from "@/hooks/useAssignShifts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpecialityActives, useSpecialityCollaborators } from "@/hooks/useSpeciality";
import { useCategoryService, useCategoryServicesCollaborator } from "@/hooks/useCategoryService";

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
  const [isShiftsModalOpen, setIsShiftsModalOpen] = useState(false)
  const [isSpecialityModalOpen, setIsSpecialityModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);


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

  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>([]);
  const { speciality, isLoading: loadingSpecialities, error: errorSpecialities } = useSpecialityActives(companyId, establishmentId);
  const { specialityCollaborator, isLoading: loadingSpecialityCollaborator } = useSpecialityCollaborators(selectedUser?.collaborator?.id);

  useEffect(() => {
    if (isSpecialityModalOpen && selectedUser && Array.isArray(specialityCollaborator)) {
      setSelectedSpecialities(specialityCollaborator.map((s: any) => s.specialty_id));
    }
    if (isSpecialityModalOpen && selectedUser && !specialityCollaborator) {
      setSelectedSpecialities([]);
    }
  }, [isSpecialityModalOpen, selectedUser, specialityCollaborator]);

  useEffect(() => {
    if (errorSpecialities) {
      customToast.error({
        title: "Error al cargar especialidades",
        description: errorSpecialities,
      });
    }
  }, [errorSpecialities]);

  const handleSpecialityChange = (id: number) => {
    setSelectedSpecialities((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSaveSpecialities = () => {
    // Aquí deberías guardar la relación en backend o estado global
    customToast.success({
      title: "Especialidades actualizadas",
      description: `Se actualizaron las especialidades de ${selectedUser?.name}`,
    });
    setIsSpecialityModalOpen(false);
  };

  const handleCancelSpecialities = () => {
    setIsSpecialityModalOpen(false);
  };

  // Para categorías de servicio
  const { categoryServices, isLoading: loadingCategories, error: errorCategories } = useCategoryService(companyId, establishmentId);
  const { categoriesCollaborator, isLoading: loadingCategoriesCollaborator } = useCategoryServicesCollaborator(selectedUser?.collaborator?.id);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isCategoryModalOpen && selectedUser && Array.isArray(categoriesCollaborator)) {
      setSelectedCategories(categoriesCollaborator.map((c: any) => c.category_service_id));
    }
    if (isCategoryModalOpen && selectedUser && !categoriesCollaborator) {
      setSelectedCategories([]);
    }
  }, [isCategoryModalOpen, selectedUser, categoriesCollaborator]);

  const handleCategoryChange = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSaveCategories = () => {
    // Aquí deberías guardar la relación en backend o estado global
    customToast.success({
      title: "Categorías actualizadas",
      description: `Se actualizaron las categorías de ${selectedUser?.name}`,
    });
    setIsCategoryModalOpen(false);
  };

  const handleCancelCategories = () => {
    setIsCategoryModalOpen(false);
  };

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
            ) : users.length === 0 ? (
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
                        <TableCell className="px-4 py-4"> 
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsSheetOpen(true); }}>Ver</DropdownMenuItem>
                              {
                                user.role_id === 4 && ( 
                                  <>
                                    <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsShiftsModalOpen(true); }}>Horarios</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsSpecialityModalOpen(true); }}>Especialidad</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsCategoryModalOpen(true); }}>Vincular a categorías</DropdownMenuItem>
                                  </>
                                )
                              }
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
            )}
          </div >
        </div >

        {/* Sheet para ver información del usuario */}
        < Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} >
          <SheetContent className="z-[9999]">
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

        {/* Modal de Horarios */}
        <Dialog open={isShiftsModalOpen} onOpenChange={setIsShiftsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold"> Horarios del usuario</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <ShiftsList
                establishmentId={establishmentId || ""}
                userId={selectedUser?.id}
                collaboratorId={selectedUser?.collaborator?.id}
                onClose={() => setIsShiftsModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de especialidades */}
        <Dialog open={isSpecialityModalOpen} onOpenChange={setIsSpecialityModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Vincular especialidades</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="text-gray-700 mb-2 font-medium">Selecciona una o más especialidades:</div>
              {(loadingSpecialityCollaborator || loadingSpecialities) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-32 h-10 rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(speciality) && speciality.length > 0 ? (
                    speciality.map((spec: any) => (
                      <button
                        key={spec.id}
                        type="button"
                        className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedSpecialities.includes(spec.id)
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
                        onClick={() => handleSpecialityChange(spec.id)}
                      >
                        {selectedSpecialities.includes(spec.id) && (
                          <span className="inline-block w-4 h-4 bg-white rounded-full border border-blue-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                        {spec.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-gray-400 italic">No hay especialidades registradas.</div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all"
                onClick={handleCancelSpecialities}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                onClick={handleSaveSpecialities}
                type="button"
                disabled={loadingSpecialities}
              >
                Guardar
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de categorías de servicio */}
        <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Vincular categorías de servicio</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="text-gray-700 mb-2 font-medium">Selecciona una o más categorías:</div>
              {(loadingCategoriesCollaborator || loadingCategories) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-32 h-10 rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(categoryServices) && categoryServices.length > 0 ? (
                    categoryServices.map((cat: any) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedCategories.includes(cat.id)
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        {selectedCategories.includes(cat.id) && (
                          <span className="inline-block w-4 h-4 bg-white rounded-full border border-blue-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-gray-400 italic">No hay categorías registradas.</div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all"
                onClick={handleCancelCategories}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                onClick={handleSaveCategories}
                type="button"
                disabled={loadingCategories}
              >
                Guardar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>

  )
}

export { CreateUserModal, EditUserModal, DeleteUserModal };

function ShiftsList({ establishmentId, userId, collaboratorId, onClose }: { establishmentId: string, userId?: string, collaboratorId: string, onClose: () => void }) {
  if (!establishmentId) return <div>No se ha seleccionado sucursal.</div>;
  const { shift, isLoading, error } = useShift(establishmentId);
  const { userShifts, isLoading: isLoadingUserShifts } = useUserShifts(collaboratorId);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({});
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { assign, loading: assignLoading, error: assignError, success: assignSuccess } = useAssignShifts();

  const daysOfWeek = [
    "", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  const shiftsByDay: Record<number, any[]> = {};
  (shift as any[]).forEach((item) => {
    if (!shiftsByDay[item.day_of_week]) shiftsByDay[item.day_of_week] = [];
    shiftsByDay[item.day_of_week].push(item);
  });

  useEffect(() => {
    if (shift && Array.isArray(shift)) {
      const initial: Record<string, boolean> = {};
      (shift as any[]).forEach((item) => {
        initial[item.id] = !!userShifts.find((us: any) => us.establishment_shift_id === item.id);
      });
      setActiveDays(initial);
    }
  }, [shift, userShifts]);

  useEffect(() => {
    if (assignError) {
      customToast.error({ title: "Error", description: assignError });
    }
    if (assignSuccess) {
      customToast.success({ title: "Turnos asignados", description: "Los turnos fueron asignados correctamente." });
    }
  }, [assignError, assignSuccess]);

  const handleSwitch = (id: string, value: boolean) => {
    setActiveDays(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleDay = (day: number) => {
    setOpenDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = async () => {
    if (!collaboratorId) return;
    setSaving(true);
    setSuccess(false);
    const selectedShiftIds = Object.entries(activeDays)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    await assign(collaboratorId, selectedShiftIds);
    setSaving(false);
    setSuccess(true);
    onClose();
  };

  if (isLoading || isLoadingUserShifts) {
    return (
      <div className="space-y-4 mb-4">
        {[1,2,3,4].map(day => (
          <div key={day} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;
  if (!shift || (shift as any[]).length === 0) return <div>No hay horarios configurados.</div>;

  return (
    <div>
      <div className="space-y-4 mb-4">
        {[1,2,3,4,5,6,7].map(day => {
          const hasActive = (shiftsByDay[day] || []).some((item: any) => activeDays[item.id]);
          return (
            <Collapsible key={day} open={!!openDays[day]}>
              <div
                className={`
                  rounded-2xl border transition-all bg-white
                  ${hasActive ? 'ring-1 ring-blue-100' : 'border-gray-200'}
                `}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={`
                      w-full flex items-center justify-between px-6 py-4
                      font-semibold rounded-2xl text-lg transition-colors bg-white`}
                    onClick={() => handleToggleDay(day)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base font-bold">{daysOfWeek[day]}</span>
                      {hasActive && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        {shiftsByDay[day]?.length || 0} turno(s)
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${openDays[day] ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="space-y-2 px-6 pb-4 pt-2">
                    {(shiftsByDay[day] || []).map((item: any) => (
                      <li
                        key={item.id}
                        className={`
                          flex items-center justify-between gap-4 py-3 px-4 rounded-xl
                          bg-gray-50 border border-gray-200
                          transition-all
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-base">
                            {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
                          </span>
                        </div>
                        <Switch
                          checked={activeDays[item.id]}
                          onCheckedChange={val => handleSwitch(item.id, val)}
                        />
                      </li>
                    ))}
                    {(!shiftsByDay[day] || shiftsByDay[day].length === 0) && (
                      <li className="text-gray-400 italic">No hay turnos para este día</li>
                    )}
                  </ul>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
      <div className="flex justify-end gap-2">
        <Button className="h-10 border-blue-600 text-blue-600 font-semibold hover:bg-transparent hover:text-blue-700 cursor-pointer" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" onClick={handleSave} disabled={saving || assignLoading}>
          {assignLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
      
    </div>
  );
}
