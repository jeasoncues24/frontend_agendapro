import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    ventaTotal: number | string
    totalReservas: number | string
    clientesEntrantes: number | string
    reservasEspera: number | string
    reservasTerminadas: number | string
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const prefix = num >= 0 ? "S/. " : "-S/. "
    const value = Math.abs(num).toFixed(2)
    return prefix + value
  }

  const getTextColor = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num > 0) return "text-green-600"
    if (num < 0) return "text-red-600"
    return "text-gray-900"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="border rounded">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Venta total</span>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-xl font-semibold ${getTextColor(stats.ventaTotal)}`}>
            {formatCurrency(stats.ventaTotal)}
          </div>
        </div>
      </div>

      <div className="border rounded">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total de reservas</span>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-xl font-semibold text-green-500`}>
            {stats.totalReservas}
          </div>
        </div>
      </div>

      <div className="border rounded">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Clientes entrantes</span>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-xl font-semibold text-green-500`}>
            {stats.clientesEntrantes}
          </div>
        </div>
      </div>

      <div className="border rounded">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reservas en espera</span>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-xl font-semibold text-yellow-600`}>
            {stats.reservasEspera}
          </div>
        </div>
      </div>

      <div className="border rounded">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reservas terminadas</span>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-xl font-semibold text-blue-600`}>
            {stats.reservasTerminadas}
          </div>
        </div>
      </div>
    </div>
  )
}
