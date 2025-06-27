"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Store, TrendingDown, TrendingUp } from "lucide-react"
import { FaStore } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useState } from "react"

const chartData = [
  { date: "16/06", value: 0 },
  { date: "17/06", value: 0 },
  { date: "18/06", value: 0 },
  { date: "19/06", value: 0 },
  { date: "20/06", value: 0 },
  { date: "21/06", value: 0 },
  { date: "22/06", value: 0 },
  { date: "23/06", value: 0 },
]

const tabOptions = [
  { key: "valor-ventas", label: "Valor ventas" },
  { key: "ordenes", label: "No. órdenes" },
  { key: "ticket", label: "Ticket promedio" },
  { key: "clientes", label: "Clientes" },
]

export default function DashboardComponent() {
  const [activeTab, setActiveTab] = useState("valor-ventas")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-auto">
            <div className="flex space-x-8 border-b border-gray-200 bg-white pt-4">
              {tabOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-3 px-4 text-md font-medium transition-all duration-300 ease-in-out
                    ${activeTab === key
                      ? "text-black font-bold border-b-2 border-blue-500"
                      : "text-gray-500 font-normal border-b-2 border-transparent hover:text-gray-700"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Venta bruta</CardTitle>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 0,00</div>
                <p className="text-sm text-gray-500 mt-1">
                  Total de órdenes: <span className="font-semibold">0</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ticket promedio</CardTitle>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 0,00</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-orange-500">👑</span>
                  <span className="text-sm text-gray-500">
                    Órdenes Pro: <span className="font-semibold">S/ 0,00</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Comparación en valor de ventas</CardTitle>
              <p className="text-sm text-gray-500">16/06 - 23/06 comparado a 08/06 - 15/06</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Período anterior</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Período actual</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis
                      domain={[-1, 1]}
                      ticks={[-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      tickFormatter={(value) => `S/ ${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Alert */}
          <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center gap-2">
            <span className="text-orange-500">👑</span>
            <span className="text-sm">
              Órdenes de usuarios Pro representaron <span className="font-semibold">0%</span> de la venta de este
              período
            </span>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#FF441F] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm"><FaStore className="h-5 w-5" /></span>
                    </div>
                    <div>
                    <h1 className="font-bold text-lg">Sucursal Principal</h1>
                    <p className="text-xs text-gray-500">Acompañamiento de performance</p>
                    </div>
                </div>
              <div className="text-lg font-semibold">Métricas de servicio</div>
              <p className="text-sm text-gray-500">16/06 - 23/06 comparado a 08/06 - 15/06</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Reclamos</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">0</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-gray-500">% órdenes que presentaron reclamos en soporte</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Cancelaciones</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">0</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-gray-500">% órdenes canceladas</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Disponibilidad</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">0</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-gray-500">% tiempo en que la tienda estuvo en operación</p>
              </div>
             
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
