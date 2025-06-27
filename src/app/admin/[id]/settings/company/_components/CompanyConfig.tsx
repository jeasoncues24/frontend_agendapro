"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
                  <div className="relative">
                    <input
                      id="bussines_name"
                      value={companyData.bussines_name}
                      onChange={(e) => handleInputChange("bussines_name", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="bussines_name"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.bussines_name ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      Nombre de mi empresa *
                    </label>
                  </div>

                  {/* Trade Name */}
                  <div className="relative">
                    <input
                      id="trade_name"
                      value={companyData.trade_name}
                      onChange={(e) => handleInputChange("trade_name", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="trade_name"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.trade_name ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      Nombre comercial *
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Identification (RUC) */}
                  <div className="relative">
                    <input
                      id="identification"
                      value={companyData.identification}
                      onChange={(e) => handleInputChange("identification", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="identification"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.identification ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      RUC *
                    </label>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.phone ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      Teléfono *
                    </label>
                  
                  </div>
                </div>

                {/* Location Selects */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={companyData.city.toString()}
                      onChange={e => handleInputChange("city", parseInt(e.target.value))}
                      className={`block w-full px-4 pt-6 pb-2 pr-10 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                    >
                      <option value="" disabled hidden></option>
                      <option value="1">Piura</option>
                      <option value="2">Lima</option>
                      <option value="3">Trujillo</option>
                      <option value="4">Chiclayo</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                    <label
                      htmlFor="city"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.city ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                    >
                      Ciudad *
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      id="provincia"
                      name="provincia"
                      value={companyData.provincia.toString()}
                      onChange={e => handleInputChange("provincia", parseInt(e.target.value))}
                      className={`block w-full px-4 pt-6 pb-2 pr-10 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                    >
                      <option value="" disabled hidden></option>
                      <option value="1">Piura</option>
                      <option value="2">Castilla</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                    <label
                      htmlFor="provincia"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.provincia ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                    >
                      Provincia *
                    </label>
                  </div>

                  <div className="relative">
                    <select
                      id="district"
                      name="district"
                      value={companyData.district.toString()}
                      onChange={e => handleInputChange("district", parseInt(e.target.value))}
                      className={`block w-full px-4 pt-6 pb-2 pr-10 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                    >
                      <option value="" disabled hidden></option>
                      <option value="1">Piura</option>
                      <option value="2">Castilla</option>
                      <option value="3">26 de Octubre</option>
                      <option value="4">Surco</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                    <label
                      htmlFor="district"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.district ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                    >
                      Distrito *
                    </label>
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                    <input
                      id="address"
                      value={companyData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="address"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${companyData.address ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      Dirección de facturación *
                    </label>
                </div>

                {/* Color Primary */}
                <div className="flex items-center gap-2">
                  <input
                    id="color_primary"
                    type="color"
                    value={formData.color_primary}
                    onChange={(e) => handleInputChange("color_primary", e.target.value)}
                    className="w-20 h-10 p-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                  <div className="relative w-full">
                    <input
                      id="color_primary_hex"
                      value={formData.color_primary}
                      onChange={(e) => handleInputChange("color_primary", e.target.value)}
                      className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="color_primary_hex"
                      className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                        peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                        ${formData.color_primary ? 'top-1.5 text-sm text-blue-600' : ''}`}
                    >
                      Color principal (hex)
                    </label>
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
          className="text-white px-8 h-10 bg-blue-600 hover:bg-blue-600 cursor-pointer"
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
