"use client"

import { useEffect } from "react"

export function useThemeColor(color: string, condition = true) {
  useEffect(() => {
    if (!condition) return

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    const originalColor = metaThemeColor?.getAttribute("content") || "#8B5CF6"

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", color)
    }

    return () => {
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", originalColor)
      }
    }
  }, [color, condition])
}
