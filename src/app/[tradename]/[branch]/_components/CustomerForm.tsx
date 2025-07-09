import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomerFormProps {
  branchName?: string;
  logoUrl?: string;
  onBack: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export default function CustomerForm({ branchName = "Sucursal", logoUrl = "/placeholder.svg", onBack, onSubmit }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    onSubmit({ name, email, phone });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-100 relative">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">Datos del cliente</h1>
        <span className="w-8" />
      </header>

      {/* Logo y nombre de sucursal */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-white flex items-center gap-4 px-4 py-3">
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={branchName}
            height={48}
            width={48}
            className="rounded-full bg-white border border-gray-100 object-cover"
          />
          <div className="flex-1 text-left">
            <div className="text-lg font-bold text-gray-900 leading-tight">{branchName}</div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form className="flex-1 px-4 pt-8 pb-32 max-w-lg mx-auto w-full" onSubmit={handleSubmit}>
        <div className="mb-6 space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
              Nombre completo *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
              Teléfono *
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full h-12"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <div className="flex w-full gap-3 mt-8">
          {/* <Button variant="outline" className="h-16 rounded-full px-8 flex-1" type="button" onClick={onBack}>Anterior</Button> */}
          <Button className="bg-green-500 h-16 text-white rounded-full px-8 flex-1" type="submit">
            Reservar
          </Button>
        </div>
      </form>
    </div>
  );
} 