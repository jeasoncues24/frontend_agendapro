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
          <DialogTitle>Crear nuevo usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <Input name="password" placeholder="Password" value={form.password} onChange={handleChange} type="password" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
            {Object.entries(ROLES).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
            <option value={1}>Activo</option>
            <option value={2}>Inactivo</option>
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
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
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <Input name="password" placeholder="Password (opcional)" value={form.password} onChange={handleChange} type="password" />
          </div>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded p-2">
            {Object.entries(ROLES).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
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
          <DialogTitle>¿Eliminar usuario?</DialogTitle>
        </DialogHeader>
        <div className="my-4">
          <p className="text-gray-500">¿Estás seguro de que deseas eliminar a <b>{user?.name}</b>?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

