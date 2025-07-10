"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  MoreHorizontal,
  CirclePlus,
} from "lucide-react"
import Image from "next/image"
import { useCustomers } from "@/hooks/useCustomer"

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


export default function ListCustomer({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { customers, isLoading, error } = useCustomers(companyId, establishmentId, refreshKey);

  const filteredInquiries: any[] = customers.filter(( customer: any ) => customer.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-1">Clientes</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 h-12 px-6">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg h-12 px-6 text-base transition-colors">
            <CirclePlus className="w-16 h-16" />
            <span>Crear cliente</span>
          </Button>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6 bg-white min-h-screen">

        <div className="flex justify-end items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar cliente"
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
            {filteredInquiries.length === 0 ? (
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
                  {searchTerm ? "No se encontraron clientes" : "No tienes clientes aún"}
                </h3>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                  {searchTerm
                    ? "No se encontraron clientes que coincidan con tu búsqueda. Intenta con otros términos."
                    : "Comienza creando tu primer cliente. Es fácil y rápido."
                  }
                </p>
                {!searchTerm && (
                  <Button
                    className="flex items-center space-x-2 h-12"
                  >
                    <CirclePlus className="w-4 h-4" />
                    <span>Crear mi primer cliente</span>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-4"></TableHead>
                      <TableHead>Nombres</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Celular</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry, idx) => (
                      <TableRow key={inquiry.id || idx}>
                        <TableCell></TableCell>
                        <TableCell className="font-medium text-gray-900">{inquiry.name}</TableCell>
                        <TableCell className="font-medium text-gray-900">{inquiry.email}</TableCell>
                        <TableCell className="font-medium text-gray-900">{inquiry.phone}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
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
        </div>
      </div>
    </>
  )
}
