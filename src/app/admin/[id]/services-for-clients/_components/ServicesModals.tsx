import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { listCategoriesActives } from "@/services/categoryservices.service";



interface ServiceProps {
    open: boolean;
    onClose: () => void;
    onCreate: ( data: any ) => Promise<void>;
    companyId: string;
    establishmentId?: string;
}

export function CreateServiceModal({ open, onClose, onCreate, companyId, establishmentId }: ServiceProps ) {
    const [ form, setForm ] = useState({
        name: "",
        duration: 0,
        price: 0,
        image: null,
        category_id: "",
        status: 1
    });
    
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!open) {
          // Limpiar estados cuando se cierra el modal
          setPreviewImage(null);
          setSelectedFile(null);
          setForm({
            name: "",
            duration: 0,
            price: 0,
            image: null,
            category_id: "",
            status: 1
          });
          setErrors({});
          setCategories([]);
        } else if (establishmentId) {
          listCategoriesActives(establishmentId)
            .then(res => setCategories(res.data || res))
            .catch(() => setCategories([]));
        }
      }, [open, establishmentId]);
    

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, image: "Por favor, selecciona una imagen válida" }))
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: "La imagen no debe superar los 5MB" }))
            return
        }

        const previewUrl = URL.createObjectURL(file)
            setPreviewImage(previewUrl)
            setSelectedFile(file)
            setForm(prev => ({ ...prev, image: null }))
            setErrors(prev => ({ ...prev, image: "" }))
        }
    }

    useEffect(() => {
        return () => {
          if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage)
          } 
        }
    }, [previewImage])
 
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (form.duration <= 0) newErrors.duration = "El tiempo debe ser mayor a 0";
        if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
        if (!form.category_id.trim()) newErrors.category_id = "La categoria es obligatoria"
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        setLoading(true)
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', form.name);
            formDataToSend.append('duration', String(Number(form.duration)));
            formDataToSend.append('price', String(Number(form.price)));
            formDataToSend.append('category_id', form.category_id);
            formDataToSend.append('status', String(Number(form.status)));
            formDataToSend.append('establishment_id', establishmentId || "");
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            await onCreate(formDataToSend);
            onClose();
        } catch ( error ){
            setErrors( prev => ({ ...prev }));
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setSelectedFile(null);
        setForm(prev => ({
          ...prev,
          image: null
        }));
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo servicio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Input name="duration" placeholder="Duración" value={form.duration} onChange={handleChange} />
                        {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                    </div>
                    <div>
                        <Input name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 text-sm"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>
                    <div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                        {previewImage ? (
                            <div className="relative w-full h-full">
                            <Image
                                src={previewImage}
                                alt="Image preview"
                                fill
                                className="object-cover"
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
                    </div>
                   
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

}

interface EditServiceProps {
    open: boolean;
    onClose: () => void;
    onEdit: ( data: any ) => Promise<void>;
    service: any;
    companyId: string;
    establishmentId?: string;
}


export function EditServiceModal({ open, onClose, onEdit, service, companyId, establishmentId }: EditServiceProps ) {
    const [ form, setForm ] = useState({
        name: "",
        duration: 0,
        price: 0,
        image: null,
        category_id: "",
        status: 1
    });
    
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!open) {
          // Limpiar estados cuando se cierra el modal
          setPreviewImage(null);
          setSelectedFile(null);
          setErrors({});
        } else if (establishmentId) {
          // Cargar categorías activas al abrir el modal
          listCategoriesActives(establishmentId)
            .then(res => setCategories(res.data || res))
            .catch(() => setCategories([]));
        }
    }, [open, establishmentId]);

    useEffect(() => {
        if (service && open) {
            setForm({
                name: service.name || "",
                duration: service.duration || 0,
                price: service.price || 0,
                image: service.image || null,
                category_id: service.category_id || "",
                status: service.status || 1
            });

            if ( service.image ) {
                setPreviewImage(`${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${service.image}`)
            } else {
                setPreviewImage(null);
            }
           
        }
    }, [service, open]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, image: "Por favor, selecciona una imagen válida" }))
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: "La imagen no debe superar los 5MB" }))
            return
        }

        const previewUrl = URL.createObjectURL(file)
            setPreviewImage(previewUrl)
            setSelectedFile(file)
            setForm(prev => ({ ...prev, image: null }))
            setErrors(prev => ({ ...prev, image: "" }))
        }
    }

    useEffect(() => {
        return () => {
          if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage)
          } 
        }
    }, [previewImage])
 
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (form.duration <= 0) newErrors.duration = "El tiempo debe ser mayor a 0";
        if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
        if (!form.category_id.trim()) newErrors.category_id = "La categoria es obligatoria"
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
  

        setLoading(true)
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', form.name);
            formDataToSend.append('duration', String(Number(form.duration)));
            formDataToSend.append('price', String(Number(form.price)));
            formDataToSend.append('category_id', form.category_id);
            formDataToSend.append('status', String(Number(form.status)));
            formDataToSend.append('establishment_id', establishmentId || "");
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            } else {
                formDataToSend.append('image', String(form.image));
            }

            await onEdit(formDataToSend);
            onClose();
        } catch ( error ){
            setErrors( prev => ({ ...prev }));
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setSelectedFile(null);
        setForm(prev => ({
          ...prev,
          image: null
        }));
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar servicio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Input name="duration" placeholder="Duración" value={form.duration} onChange={handleChange} />
                        {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                    </div>
                    <div>
                        <Input name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 text-sm"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>
                    <div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                        {previewImage ? (
                            <div className="relative w-full h-full">
                            <Image
                                src={previewImage || `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${form.image}`}
                                alt="Image preview"
                                fill
                                className="object-cover"
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
                    </div>
                   
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


interface DeleteServiceProps {
    open: boolean;
    onClose: () => void;
    onDelete: (service: any) => Promise<void>;
    service: any;
}


export function DeleteServiceModal({ open, onClose, onDelete, service }: DeleteServiceProps ) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete(service);
            onClose();
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar servicio?</DialogTitle>
            </DialogHeader>
            <div className="my-4">
              <p className="text-gray-500">¿Estás seguro de que deseas eliminar el servicio <b>{service?.name}</b>?</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
}