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
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"

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

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    inquiryNumber: "IN - 000011102",
    name: "Template generic questi...",
    submittedDate: "Jan 13, 2022",
    status: "Processing",
    executedBy: {
      name: "Olivia Rhye",
      email: "olivia@untitledui.com",
    },
  },
  {
    id: "2",
    inquiryNumber: "IN - 000001037",
    name: "Wind turbines generator...",
    submittedDate: "Jan 13, 2022",
    status: "Success",
    executedBy: {
      name: "Phoenix Baker",
      email: "phoenix@untitledui.com",
    },
  },
  {
    id: "3",
    inquiryNumber: "IN - 000001023",
    name: "Template generic questi...",
    submittedDate: "Jan 13, 2022",
    status: "Success",
    executedBy: {
      name: "Lana Steiner",
      email: "lana@untitledui.com",
    },
  },
  {
    id: "4",
    inquiryNumber: "IN - 000001094",
    name: "Template generic questi...",
    submittedDate: "Jan 13, 2022",
    status: "On hold",
    executedBy: {
      name: "Demi Wilkinson",
      email: "demi@untitledui.com",
    },
  },
  {
    id: "5",
    inquiryNumber: "IN - 000028893",
    name: "Template generic questi...",
    submittedDate: "Jan 12, 2022",
    status: "Drafts",
    executedBy: {
      name: "Candice Wu",
      email: "candice@untitledui.com",
    },
  },
  {
    id: "6",
    inquiryNumber: "IN - 000038892",
    name: "Template generic questi...",
    submittedDate: "Jan 12, 2022",
    status: "Drafts",
    executedBy: {
      name: "Natali Craig",
      email: "natali@untitledui.com",
    },
  },
]

export default function ListEstablishment() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState("Jan 6, 2024 – Jan 13, 2024")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Processing":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "On hold":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "Drafts":
        return <FileText className="w-4 h-4 text-gray-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Success: "bg-green-100 text-green-800 border-green-200",
      "On hold": "bg-red-100 text-red-800 border-red-200",
      Drafts: "bg-gray-100 text-gray-800 border-gray-200",
    }

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  const filteredInquiries = mockInquiries.filter((inquiry) => {
    if (activeTab === "all") return true
    return inquiry.status.toLowerCase() === activeTab.replace(" ", "").toLowerCase()
  })

  const getTabCount = (status: string) => {
    if (status === "all") return mockInquiries.length
    return mockInquiries.filter((inquiry) => inquiry.status.toLowerCase() === status.replace(" ", "").toLowerCase())
      .length
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
              Hay <span className="text-gray-500 font-normal">58 usuarios</span>
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4"></TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Ubicacion</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>{inquiry.name.charAt(0)}</TableCell>
                  <TableCell className="font-medium text-gray-900">{inquiry.inquiryNumber}</TableCell>
                  <TableCell className="text-gray-600">{inquiry.name}</TableCell>
                  <TableCell className="text-gray-600">{inquiry.submittedDate}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
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
    </div>
  )
}
