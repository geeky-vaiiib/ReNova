"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { cartAPI } from "@/lib/api"

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setItemCount(0)
          return
        }

        const response = await cartAPI.getCartCount()
        setItemCount(response.itemCount || 0)
      } catch (error) {
        console.error("Error fetching cart count:", error)
        setItemCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for custom cart update events
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  if (itemCount === 0) return null

  return (
    <Badge
      variant="destructive"
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {itemCount > 99 ? "99+" : itemCount}
    </Badge>
  )
}
