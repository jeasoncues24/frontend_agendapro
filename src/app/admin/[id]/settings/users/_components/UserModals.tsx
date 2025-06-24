import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ROLES: Record<number, string> = {
  1: "Super Admin",
  2: "Admin",
  3: "Gerente",
  4: "Colaborador",
  5: "Cliente"
};

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  companyId: string;
  establishmentId?: string;
}

export function CreateUserModal({ open, onClose, onCreate, companyId, establishmentId }: CreateUserModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: 4,
    status: 1,
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
    if (!form.email.trim()) newErrors.email = "El email es obligatorio";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) newErrors.email = "Email inválido";
    if (!form.password.trim()) newErrors.password = "La contraseña es obligatoria";
    return newErrors;
  };

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
        role: Number(form.role),
        status: Number(form.status),
        companyId,
        establishmentId
      });
      setForm({ name: "", email: "", password: "", role: 4, status: 1 });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Crear nuevo usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="mb-6">
            <div className="space-y-4 mb-4">
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
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                    ${form.email ? 'top-1.5 text-sm text-blue-600' : ''}`}
                >
                  Email
                </label>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                    ${form.password ? 'top-1.5 text-sm text-blue-600' : ''}`}
                >
                  Password (opcional)
                </label>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.role ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            >
              <option value="" disabled hidden></option>
              {Object.entries(ROLES).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <label
              htmlFor="role"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                ${form.role ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
            >
              Rol
            </label>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
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
          <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-semibold cursor-pointer" onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (data: any) => Promise<void>;
  user: any;
  companyId: string;
  establishmentId?: string;
}

export function EditUserModal({ open, onClose, onEdit, user, companyId, establishmentId }: EditUserModalProps) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || 4,
    status: user?.status || 1,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || 4,
      status: user?.status || 1,
    });
    setErrors({});
  }, [user, open]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.email.trim()) newErrors.email = "El email es obligatorio";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) newErrors.email = "Email inválido";
    return newErrors;
  };

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
        role: Number(form.role),
        status: Number(form.status),
        companyId,
        establishmentId
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
          <DialogTitle className="text-2xl font-bold">Editar usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200  ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            />
            <label
              htmlFor="name"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
              ${form.name ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
                Usuario *
            </label>
          </div>
          <div className="relative">
            <input 
              type="email" 
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200  ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            />
            <label
              htmlFor="email"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
              ${form.email ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
                Email *
            </label>
          </div>
          <div className="relative">
          <input 
              type="password" 
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200  ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
              ${form.password ? 'top-1.5 text-sm text-blue-600' : ''}`}
            >
                Password (opcional)
            </label>
          </div>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer ${errors.role ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-600 focus:border-blue-600'}`}
            >
              <option value="" disabled hidden></option>
              {Object.entries(ROLES).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <label
              htmlFor="role"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                ${form.role ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
            >
              Rol
            </label>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
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

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: (user: any) => Promise<void>;
  user: any;
}

export function DeleteUserModal({ open, onClose, onDelete, user }: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(user);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">¿Eliminar usuario?</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p className="text-gray-500">¿Estás seguro de que deseas eliminar a <b>{user?.name}</b>?</p>
        </div>
        <DialogFooter>
          <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="h-10 cursor-pointer" variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

