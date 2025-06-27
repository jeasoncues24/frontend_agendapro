"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
  logoUrl?: string
  companyName?: string
}

export default function SplashScreen({ onComplete, logoUrl, companyName }: SplashScreenProps) {
  const [showZoom, setShowZoom] = useState(false)

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#000000")
    }

    // Animación de zoom a los 2.5 segundos (de 3 segundos total)
    const zoomTimer = setTimeout(() => {
      setShowZoom(true)
    }, 2500)

    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(zoomTimer)
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#8B5CF6")
      }
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.5,
          onComplete: () => {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]')
            if (metaThemeColor) {
              metaThemeColor.setAttribute("content", "#8B5CF6")
            }
          },
        },
      }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col"
    >
      {/* Status Bar - Todo negro */}
      <div className="h-12 bg-white"></div>

      {/* Main Content - Logo centrado */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: showZoom ? 1.5 : 1, 
            opacity: 1 
          }}
          transition={{
            duration: showZoom ? 0.8 : 1.2,
            ease: showZoom ? "easeInOut" : "easeOut",
            delay: showZoom ? 0 : 0.3,
          }}
          className="flex items-center gap-3"
        >
          {/* Logo Icon */}
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName || "Logo de la empresa"}
              width={192}
              height={192}
              priority
              className="mb-2 rounded-xl shadow-2xl"
            />
          ) : (
            <span className="text-white text-6xl font-bold">V</span>
          )}
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="pb-2 flex justify-center">
        <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </motion.div>
  )
}
