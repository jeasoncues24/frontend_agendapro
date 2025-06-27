"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize, X } from "lucide-react"

export default function FullscreenHandler() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Verificar si ya está en fullscreen
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    // Listener para cambios de fullscreen
    document.addEventListener("fullscreenchange", checkFullscreen)

    // Intentar activar fullscreen automáticamente después de un pequeño delay
    const timer = setTimeout(() => {
      if (!document.fullscreenElement && !window.matchMedia("(display-mode: fullscreen)").matches) {
        setShowPrompt(true)
      }
    }, 1000)

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen)
      clearTimeout(timer)
    }
  }, [])

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
      setShowPrompt(false)
    } catch (error) {
      console.log("Fullscreen not supported or denied")
      setShowPrompt(false)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.log("Exit fullscreen failed")
    }
  }

  // Prompt para activar fullscreen
  if (showPrompt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Maximize className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Experiencia Completa</h3>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Para una mejor experiencia, te recomendamos usar la aplicación en pantalla completa como una app nativa.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPrompt(false)} className="flex-1 rounded-full">
              Ahora no
            </Button>
            <Button
              onClick={enterFullscreen}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full"
            >
              Activar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Botón flotante para controlar fullscreen
  return (
    <div className="fixed top-4 right-4 z-50 lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={isFullscreen ? exitFullscreen : enterFullscreen}
        className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white border border-gray-200/50"
      >
        {isFullscreen ? <X className="w-5 h-5 text-gray-800" /> : <Maximize className="w-5 h-5 text-gray-800" />}
      </Button>
    </div>
  )
}
