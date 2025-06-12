"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, X } from "lucide-react"

export default function CompanyConfigComponent() {
  const [companyData, setCompanyData] = useState({
    name: "Empresa S.A.C.",
    ruc: "11111111",
    department: "Lima",
    province: "Lima",
    district: "Miraflores",
    address: "Calle Juan fanning 419",
  })

  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(null)
  }

  const handleSave = () => {
    console.log("Guardando datos de empresa:", companyData)
    console.log("Logo:", logo)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Datos de tu empresa Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Column - Title and Description */}
        <div className="col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos de tu empresa</h2>
          <p className="text-sm text-gray-600">Completa la información de tu empresa</p>
        </div>

        {/* Right Column - Content Card */}
        <div className="col-span-9">
          <Card className="bg-white rounded-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="company-name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nombre de mi empresa *
                  </Label>
                  <Input
                    id="company-name"
                    value={companyData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* RUC */}
                <div>
                  <Label htmlFor="ruc" className="text-sm font-medium text-gray-700 mb-2 block">
                    RUC *
                  </Label>
                  <Input
                    id="ruc"
                    value={companyData.ruc}
                    onChange={(e) => handleInputChange("ruc", e.target.value)}
                    placeholder="11111111"
                    className="w-full"
                  />
                </div>

                {/* Location Selects */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Departamento *</Label>
                    <Select
                      value={companyData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lima">Lima</SelectItem>
                        <SelectItem value="Arequipa">Arequipa</SelectItem>
                        <SelectItem value="Cusco">Cusco</SelectItem>
                        <SelectItem value="Trujillo">Trujillo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Provincia *</Label>
                    <Select
                      value={companyData.province}
                      onValueChange={(value) => handleInputChange("province", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lima">Lima</SelectItem>
                        <SelectItem value="Callao">Callao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Distrito *</Label>
                    <Select
                      value={companyData.district}
                      onValueChange={(value) => handleInputChange("district", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                  <SelectItem value="Miraflores">Miraflores</SelectItem>
                        <SelectItem value="San Isidro">San Isidro</SelectItem>
                        <SelectItem value="Barranco">Barranco</SelectItem>
                        <SelectItem value="Surco">Surco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                    Dirección de facturación *
                  </Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logotipo de tu empresa Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Column - Title and Description */}
        <div className="col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Logotipo de tu empresa</h2>
          <p className="text-sm text-gray-600">
            Medidas recomendadas: 320 px de ancho x 160 px de alto, en formato PNG o JPG
          </p>
        </div>

        {/* Right Column - Content Card */}
        <div className="col-span-9">
          <Card className="bg-white rounded-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="max-w-xs max-h-32 mx-auto object-contain"
                      />
                      <div className="flex justify-center space-x-4">
                        <Button variant="outline" onClick={removeLogo} className="text-gray-600">
                          <X className="w-4 h-4 mr-2" />
                          Quitar logo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload">
                          <Button variant="outline" className="cursor-pointer" asChild>
                            <span>Seleccione</span>
                          </Button>
                        </label>
                        <p className="text-sm text-gray-500 mt-2">o suelta archivos para subir</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                <div className="flex justify-between items-center pt-4">
                  {logoPreview && (
                    <Button variant="ghost" className="text-gray-600">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Galería de fotos
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#25B562] hover:bg-teal-700 text-white px-8">
          Guardar
        </Button>
      </div>
    </div>
  )
}
