"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface Branch {
  id: string
  name: string
  ubication: string
  banner_path: string | null
  companyId: string
  token: string | null
  status: number
  createdAt: string
  updatedAt: string
}

interface BranchFormData {
  name: string
  ubication: string
  banner_path: string | null
}

interface EditBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (branchData: FormData | Partial<BranchFormData>) => Promise<void>
  branch?: Branch
}

export default function EditBranchModal({ isOpen, onClose, onSave, branch }: EditBranchModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BranchFormData>({
    name: "",
    ubication: "",
    banner_path: null,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logo, setLogo] = useState<File | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Limpiar estados cuando se cierra el modal
      setPreviewImage(null);
      setSelectedFile(null);
      setFormData({
        name: "",
        ubication: "",
        banner_path: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        ubication: branch.ubication || "",
        banner_path: branch.banner_path,
      });
      if (branch.banner_path) {
        setPreviewImage(`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${branch.banner_path}`);
      } else {
        setPreviewImage(null);
      }
    }
  }, [branch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, banner_path: "Por favor, selecciona una imagen válida" }))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, banner_path: "La imagen no debe superar los 5MB" }))
        return
      }

      // Crear una URL temporal para la previsualización
      const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
        setSelectedFile(file)
        setFormData(prev => ({ ...prev, banner_path: null }))
        setErrors(prev => ({ ...prev, banner_path: "" }))
      }
  }

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    if (!formData.ubication?.trim()) {
      newErrors.ubication = "La ubicación es requerida"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('ubication', formData.ubication)
      
      if (selectedFile) {
        formDataToSend.append('banner', selectedFile)
      } else if (branch?.banner_path) {
        formDataToSend.append('banner_path', branch.banner_path)
      }

      await onSave(formDataToSend)
      onClose()
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: "Error al actualizar los cambios" }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      banner_path: null
    }));

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{branch ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Preview */}
          <div className="space-y-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={previewImage || `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${branch?.banner_path}`}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      console.log('Image path:', `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${branch?.banner_path}`);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Haz clic para subir una imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {errors.banner_path && (
              <p className="text-sm text-red-500">{errors.banner_path}</p>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2 relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="name"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                ${formData.name ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Nombre
            </label>
          </div>

          {/* Location Input */}
          <div className="space-y-2 relative">
            <input
              type="text"
              id="ubication"
              name="ubication"
              value={formData.ubication}
              onChange={handleInputChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.ubication ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="ubication"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                ${formData.ubication ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Ubicación
            </label>
            
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 border-blue-600 text-blue-600 font-semibold hover:bg-transparent hover:text-blue-700 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 