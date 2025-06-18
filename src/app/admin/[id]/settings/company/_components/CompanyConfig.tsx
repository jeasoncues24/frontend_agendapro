"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, X, Loader2 } from "lucide-react"
import { useCompany } from "@/hooks/useCompany"
import { useParams } from "next/navigation"
import { customToast } from "@/components/ui/custom-toast"
import { Company } from "@/types/company"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CompanyConfigComponent() {
  const params = useParams();
  const companyId = params.id as string;
  const { companyData, isLoading, updateCompany } = useCompany(companyId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLogoPath, setCurrentLogoPath] = useState<string | null>(null);

  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessName: "",
    identification: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    industry: "",
    size: "",
    logo: null as File | null,
    color_primary: companyData?.color_primary || "#000000"
  })

  useEffect(() => {
    if (companyData?.logo_path) {
      setCurrentLogoPath(companyData.logo_path);
    }
  }, [companyData]);

  useEffect(() => {
    if (companyData) {
      setFormData(prev => ({
        ...prev,
        color_primary: companyData.color_primary
      }));
    }
  }, [companyData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
    setLogo(null);
    setLogoPreview(null);
    setCurrentLogoPath(null);
  }

  const handleUpdate = async () => {
    if (!companyData) return;

    try {
      setIsUpdating(true);
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('identification', formData.identification || companyData.identification);
      formDataToSend.append('bussines_name', formData.businessName || companyData.bussines_name);
      formDataToSend.append('phone', formData.phone || companyData.phone);
      formDataToSend.append('address', formData.address || companyData.address);

      if (logo) {
        formDataToSend.append('logo', logo);
      }
      

      // Actualizamos la compañía con FormData
      await updateCompany(formDataToSend);
      
      customToast.success({
        title: "Empresa actualizada",
        description: "La información de la empresa se ha actualizado correctamente"
      });
    } catch (error) {
      customToast.error({
        title: "Error al actualizar",
        description: "No se pudo actualizar la información de la empresa. Por favor, inténtalo de nuevo."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No se encontraron datos de la empresa</p>
      </div>
    );
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
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div>
                    <Label htmlFor="bussines_name" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre de mi empresa *
                    </Label>
                    <Input
                      id="bussines_name"
                      value={companyData.bussines_name}
                      onChange={(e) => handleInputChange("bussines_name", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Trade Name */}
                  <div>
                    <Label htmlFor="trade_name" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre comercial *
                    </Label>
                    <Input
                      id="trade_name"
                      value={companyData.trade_name}
                      onChange={(e) => handleInputChange("trade_name", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Identification (RUC) */}
                  <div>
                    <Label htmlFor="identification" className="text-sm font-medium text-gray-700 mb-2 block">
                      RUC *
                    </Label>
                    <Input
                      id="identification"
                      value={companyData.identification}
                      onChange={(e) => handleInputChange("identification", e.target.value)}
                      placeholder="20537425998"
                      className="w-full"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="999230132"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Location Selects */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Ciudad *</Label>
                    <Select
                      value={companyData.city.toString()}
                      onValueChange={(value) => handleInputChange("city", parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Piura</SelectItem>
                        <SelectItem value="2">Lima</SelectItem>
                        <SelectItem value="3">Trujillo</SelectItem>
                        <SelectItem value="4">Chiclayo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Provincia *</Label>
                    <Select
                      value={companyData.provincia.toString()}
                      onValueChange={(value) => handleInputChange("provincia", parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Piura</SelectItem>
                        <SelectItem value="2">Lima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Distrito *</Label>
                    <Select
                      value={companyData.district.toString()}
                      onValueChange={(value) => handleInputChange("district", parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Piura</SelectItem>
                        <SelectItem value="2">Castilla</SelectItem>
                        <SelectItem value="3">26 de Octubre</SelectItem>
                        <SelectItem value="4">Surco</SelectItem>
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

                {/* Color Primary */}
                <div>
                  <Label htmlFor="color_primary" className="text-sm font-medium text-gray-700 mb-2 block">
                    Color principal *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color_primary"
                      type="color"
                      value={formData.color_primary}
                      onChange={(e) => handleInputChange("color_primary", e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={formData.color_primary}
                      onChange={(e) => handleInputChange("color_primary", e.target.value)}
                      className="w-full"
                    />
                  </div>
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
                  {logoPreview || currentLogoPath ? (
                    <div className="space-y-4">
                      <div className="relative w-64 h-32 mx-auto">
                        <Image
                          src={logoPreview || `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${currentLogoPath}`}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                          onError={(e) => {
                            console.error('Error loading image:', e);
                            console.log('Image path:', `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${currentLogoPath}`);
                          }}
                        />
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="text-gray-600">
                              <X className="w-4 h-4 mr-2" />
                              Quitar logo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>¿Quitar el logo?</DialogTitle>
                              <DialogDescription>
                                Esta acción solo quitará la vista previa del logo. Para guardar los cambios, deberás hacer clic en "Actualizar".
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={() => {
                                removeLogo();
                                setIsDialogOpen(false);
                              }}>
                                Quitar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
                  {(logoPreview || currentLogoPath) && (
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
      <div className="flex justify-end">
        <Button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="text-white px-8"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Actualizando...
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      </div>
    </div>
  )
}
