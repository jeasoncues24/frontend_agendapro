"use client";

import { useBranchStore } from "@/store/branchStore";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, PlusCircle, UploadCloud, CheckCircle, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Image from "next/image";

// Mock data para UI
const mockPlan = {
  name: "Plan Pro",
  price: 99,
  currency: "PEN",
  renews: true,
  nextPayment: "2024-07-12",
  daysLeft: 1,
};
const mockCards = [
  { id: 1, type: "credit", brand: "mastercard", last4: "3542" },
  { id: 2, type: "debit", brand: "visa", last4: "1543" },
];

const mercadoPagoCard = {
  id: 1,
  type: "credit",
  brand: "visa",
  last4: "4802",
  label: "MercadoPago",
  color: "from-blue-600 to-blue-400",
};

export default function FinancePage() {
  const params = useParams();
  const companyId = params.id as string;
  const searchParams = useSearchParams();
  const branchIdFromUrl = searchParams?.get('branch');
  const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);
  const { selectedBranch } = useBranchStore();

  // UI State
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(mercadoPagoCard.id);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [paymentTab, setPaymentTab] = useState("card");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const user = cookies.get('user');
    if (user) {
      if (selectedBranch) {
        setEstablishmentId(selectedBranch)
      }
    }
  }, [selectedBranch]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-2">Suscripción de tu empresa</h2>
      <div className="w-full max-w-2xl bg-white rounded-md p-8">
        <h2 className="text-md font-medium mb-2">Gestión de Suscripción</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="text-md font-medium">{mockPlan.name}</div>
            <div className="text-sm text-gray-500">S/ {mockPlan.price} {mockPlan.currency} / mes</div>
            <div className="text-sm mt-1">Vence: <span className="font-semibold text-red-500">{mockPlan.nextPayment}</span> ({mockPlan.daysLeft} día{mockPlan.daysLeft === 1 ? '' : 's'} restante{mockPlan.daysLeft === 1 ? '' : 's'})</div>
          </div>
          <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={() => setShowCancelDialog(true)}>
            Anular suscripción
          </Button>
        </div>
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Anular suscripción?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              ¿Estás seguro que deseas anular tu suscripción? <b>Esta acción no se puede deshacer.</b>
            </div>
           
            <DialogFooter>
              <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={() => setShowCancelDialog(false)}>Cancelar</Button>
              <Button className="h-10 cursor-pointer" variant="destructive" onClick={() => { setShowCancelDialog(false);}}>Sí, anular </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
          <span className="font-medium">Recuerda:</span> Puedes renovar automáticamente con tarjeta o subir un comprobante si prefieres transferencia.
        </div>
        {/* Tabs de métodos de pago */}
        <Tabs value={paymentTab} onValueChange={setPaymentTab} className="w-full mt-6">
          <TabsList className="w-full flex mb-6">
            <TabsTrigger value="card" className="flex-1">Tarjeta (MercadoPago)</TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">Pago manual</TabsTrigger>
          </TabsList>
          <TabsContent value="card">
            {/* Tarjeta MercadoPago visual tipo card */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-80 h-48 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg flex flex-col justify-between p-5">
                <Image
                  src="/images/payment/mercadopago.png"
                  alt="MercadoPago"
                  width={50}
                  height={50}
                  className="rounded-2xl pointer-events-none"
                />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">MercadoPago</span>
                  </div>
                  <div className="flex justify-between items-end w-full mt-6">
                    <span className="text-white text-xl tracking-widest font-mono">•••• •••• •••• 4802</span>
                    <span className="text-white text-xs font-semibold uppercase">VISA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2 ml-1">El pago con tarjeta es automático y tu suscripción se renovará cada mes.</div>
            <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white mb-2" onClick={() => alert('Simulación de pago automático con tarjeta.')}>Pagar con Mercado Pago</Button>
          </TabsContent>
          <TabsContent value="manual">
            <div className="font-semibold mb-2">Pago manual (adjuntar comprobante)</div>
            <div className="flex flex-col gap-3 items-center mb-2 w-full">
              <Button
                variant="outline"
                className="border-dashed border-blue-400 text-blue-700 bg-white hover:bg-blue-50 h-12 w-full text-base flex items-center justify-center"
                onClick={() => {
                  setShowUpload(true);
                  setSelectedCard(null);
                  document.getElementById('file-upload')?.click();
                }}
                disabled={uploading}
              >
                <UploadCloud className="mr-2 text-blue-500" size={22} />
                {uploading ? (
                  <span className="flex items-center gap-2">
                    Cargando archivo...
                    <Loader2 className="animate-spin" size={20} />
                  </span>
                ) : uploadSuccess && file ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 size={20} className="text-green-600 animate-pulse" />
                    {file.name}
                  </span>
                ) : (
                  "Adjuntar comprobante"
                )}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async e => {
                  const selected = e.target.files?.[0] || null;
                  setFile(selected);
                  if (selected) {
                    setUploading(true);
                    setUploadSuccess(false);
                    // Simula carga
                    setTimeout(() => {
                      setUploading(false);
                      setUploadSuccess(true);
                    }, 1500);
                  } else {
                    setUploading(false);
                    setUploadSuccess(false);
                  }
                }}
              />
              <div className="text-xs text-gray-500 ml-1 w-full text-left">Sube el comprobante de tu transferencia o depósito. Nuestro equipo validará el pago manualmente.</div>
            </div>
            <Button className="w-full h-12 mt-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => alert('Simulación de envío de comprobante.')} disabled={!uploadSuccess}>
              Enviar comprobante
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de renovación */}
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Renovar suscripción</DialogTitle>
            <DialogDescription>
              Selecciona tu método de pago preferido para renovar tu suscripción.
            </DialogDescription>
          </DialogHeader>

          {/* Tarjeta MercadoPago visual tipo apilado */}
          <div className="mb-2">
            <div className="font-semibold mb-2">Pago automático con tarjeta (MercadoPago)</div>
            <div className="flex flex-col items-center mb-4">
              <div
                className={`relative w-88 h-44 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg flex flex-col justify-between p-5 cursor-pointer transition-all duration-150`}
                onClick={() => setSelectedCard(mercadoPagoCard.id)}
              >
                {/* Logo grande como fondo */}
                <Image
                  src="/images/payment/mercadopago.png"
                  alt="MercadoPago"
                  width={50}
                  height={50}
                  className="rounded-2xl pointer-events-none"
                />
                {/* Contenido principal */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between">
                   
                  </div>
                  <div className="flex justify-between items-end w-full mt-6">
                    <span className="text-white text-xl tracking-widest font-mono">•••• •••• •••• {mercadoPagoCard.last4}</span>
                    <span className="text-white text-xs font-semibold uppercase">{mercadoPagoCard.brand}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2 ml-1">El pago con tarjeta es automático y tu suscripción se renovará cada mes.</div>
            <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white mb-2" onClick={() => alert('Simulación de pago automático con tarjeta.')}>Pagar con Mercado Pago</Button>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Pago manual */}
          <div>
            <div className="font-semibold mb-2">Pago manual (adjuntar comprobante)</div>
            <div className="flex gap-3 items-center mb-2">
              <Button
                variant="outline"
                className="border-dashed border-gray-400 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => { setShowUpload(true); setSelectedCard(null); }}
              >
                <UploadCloud className="mr-2 text-blue-500" size={18} />
                Adjuntar comprobante
              </Button>
              {file && (
                <span className="flex items-center gap-1 text-xs text-green-700"><FileText size={16} /> {file.name}</span>
              )}
            </div>
            {showUpload && (
              <input
                type="file"
                accept="image/*,application/pdf"
                className="block w-full text-xs text-gray-500 mb-2"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            )}
            <div className="text-xs text-gray-500 ml-1">Sube el comprobante de tu transferencia o depósito. Nuestro equipo validará el pago manualmente.</div>
            <Button className="w-full h-12 mt-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => alert('Simulación de envío de comprobante.')}>Enviar comprobante</Button>
          </div>
         
        </DialogContent>
      </Dialog>
    </div>
  );
}