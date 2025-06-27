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
          <DialogTitle className="text-2xl font-bold">Crear nueva categoria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="nombre"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
              peer-placeholder-shownpeer-placeholder-shown:text-base
              peer-focus:top-1.5 peer-focus:tpeer-focus:text-blue-600
              ${form.name ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Nombre
            </label>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="description"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                            peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                            ${form.description ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Descripción
            </label>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

        </div>
        <DialogFooter>
          <Button className="h-10 border-blue-600 text-blue-600 font-semibold hover:bg-transparent hover:text-blue-700 cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
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

export function EditCategoryModal({ open, onClose, onEdit, category, companyId, establishmentId }: EditCategoryModalProps) {

  const [form, setForm] = useState({
    name: "",
    description: "",
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
          <DialogTitle className="text-2xl font-bold">Editar categoria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="nombre"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                      peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                      ${form.name ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Nombre
            </label>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
              placeholder=" "
            />
            <label
              htmlFor="description"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
              ${form.description ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
              Descripción
            </label>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.status ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            >
              <option value="" disabled hidden></option>
              <option value={1}>Activo</option>
              <option value={2}>Inactivo</option>
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
              htmlFor="status"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                ${form.status ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
            >
              Estado
            </label>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button className="h-10 border-blue-600 text-blue-600 font-semibold hover:bg-transparent hover:text-blue-700 cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" onClick={handleSubmit} disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</Button>
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


export function DeleteCategoryModal({ open, onClose, onDelete, category }: DeleteCategoryModalProps) {

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
          <DialogTitle className="text-2xl font-bold">¿Eliminar categoria?</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p className="text-gray-500">¿Estás seguro de que deseas eliminar a <b>{category?.name}</b>?</p>
        </div>
        <DialogFooter>
          <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="h-10 cursor-pointer" variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );



}