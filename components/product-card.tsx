"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Leaf, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  imageUrl: string
  sellerId: number
  sellerName: string
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, showActions = true, onAddToCart }: ProductCardProps) {
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onAddToCart) {
      onAddToCart(product)
    } else {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingItem = existingCart.find((item: any) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        existingCart.push({ ...product, quantity: 1 })
      }

      localStorage.setItem("cart", JSON.stringify(existingCart))

      window.dispatchEvent(new Event("cartUpdated"))

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toast({
      title: "Added to favorites",
      description: `${product.title} has been saved to your favorites.`,
    })
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/5 transition-all duration-300 cursor-pointer h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:-translate-y-1 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-emerald-100/90 dark:bg-emerald-900/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700 backdrop-blur-sm font-medium"
              >
                {product.category}
              </Badge>
            </div>

            <div className="absolute top-3 right-3 flex gap-2">
              <Badge
                variant="outline"
                className="bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 text-xs flex items-center gap-1 backdrop-blur-sm font-medium"
              >
                <Leaf className="h-3 w-3" />
                Eco-Friendly
              </Badge>
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleFavorite}
                className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <Heart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 text-lg leading-tight">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">by {product.sellerName}</span>
              </div>

              <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-muted-foreground/20">
                Good Condition
              </Badge>
            </div>

            {showActions && (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
