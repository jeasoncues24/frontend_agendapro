import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateCategoryServiceModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: any) => Promise<void>;
    companyId: string;
    establishmentId?: string;
}

export function CreateCategoryServiceModal({ open, onClose, onCreate, companyId, establishmentId }: CreateCategoryServiceModalProps) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        status: 1
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!form.description.trim()) newErrors.descripcion = "La descripcion es obligatoria";
        return newErrors;
    }

    const handleSubmit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            await onCreate({
                ...form,
                status: Number(form.status),
                establishment_id: establishmentId
            });
            setForm({ name: "", description: "", status: 1 });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nueva categoria</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Input name="description" placeholder="Descripcion" value={form.description} onChange={handleChange} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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


interface EditCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onEdit: (data: any) => Promise<void>;
    category: any;
    companyId: string;
    establishmentId?: string;
}

export function EditCategoryModal({ open, onClose, onEdit, category, companyId, establishmentId }: EditCategoryModalProps ) {

    console.log(category)
    const [form, setForm] = useState({
        name: "",
        description:  "",
        status: 1
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setForm({
          name: category?.name || "",
          description: category?.description || "",
          status: category?.status || 1,
        });
        setErrors({});
    }, [category, open]);

    
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };


    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!form.description.trim()) newErrors.descripcion = "La descripcion es obligatoria";
        return newErrors;
    }

    const handleSubmit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        setLoading(true);
        try {
          await onEdit({
            ...form,
            status: Number(form.status),
            establishment_id: establishmentId
          });
          onClose();
        } finally {
          setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input name="description" placeholder="Descripcion" value={form.description} onChange={handleChange} />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md p-2 text-sm">
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
}


interface DeleteCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: (user: any) => Promise<void>;
    category: any;
}
  

export function DeleteCategoryModal({ open, onClose, onDelete, category }: DeleteCategoryModalProps ) {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      setLoading(true);
      try {
        await onDelete(category);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar categoria?</DialogTitle>
            </DialogHeader>
            <div className="my-4">
              <p className="text-gray-500">¿Estás seguro de que deseas eliminar a <b>{category?.name}</b>?</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );



}