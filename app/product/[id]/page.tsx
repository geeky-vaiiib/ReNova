"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Edit, Trash2, Leaf, User } from "lucide-react"
import Link from "next/link"

// Mock product data (same as in home page)
const mockProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    description:
      "Classic brown leather jacket in excellent condition. This timeless piece has been well-maintained and shows minimal signs of wear. Perfect for adding a vintage touch to any outfit. The leather is soft and supple, and all zippers work perfectly.",
    price: 89.99,
    category: "Clothing",
    imageUrl: "/vintage-leather-jacket.png",
    sellerId: 2,
    sellerName: "sarah_vintage",
  },
  {
    id: 2,
    title: "iPhone 12 Pro",
    description:
      "Unlocked iPhone 12 Pro, 128GB storage, minor scratches on the back but screen is in perfect condition. Comes with original charger and box. Battery health is at 87%. Great phone for everyday use.",
    price: 599.99,
    category: "Electronics",
    imageUrl: "/iphone-12-pro.jpg",
    sellerId: 3,
    sellerName: "tech_reseller",
  },
  // Add more mock products...
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Find product by ID
    const productId = Number.parseInt(params.id as string)

    // Check in mock products first
    let foundProduct = mockProducts.find((p) => p.id === productId)

    // If not found, check user products
    if (!foundProduct) {
      const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")
      foundProduct = userProducts.find((p: any) => p.id === productId)
    }

    // Add mock user products for demo
    if (!foundProduct && productId >= 101) {
      const mockUserProducts = [
        {
          id: 101,
          title: "MacBook Pro 2019",
          description:
            "Well-maintained MacBook Pro 13-inch from 2019. Perfect for students or professionals. Includes original charger and box. No dents or scratches, battery cycle count is low. Runs the latest macOS smoothly.",
          price: 899.99,
          category: "Electronics",
          imageUrl: "/placeholder.svg?height=400&width=400&text=MacBook",
          sellerId: 1,
          sellerName: userData ? JSON.parse(userData).username : "user",
        },
        {
          id: 102,
          title: "Vintage Denim Jacket",
          description:
            "Classic 90s denim jacket in excellent condition, size M. This authentic vintage piece has the perfect faded wash and comfortable fit. No tears or stains, all buttons intact. A timeless wardrobe staple.",
          price: 45.0,
          category: "Clothing",
          imageUrl: "/placeholder.svg?height=400&width=400&text=Denim+Jacket",
          sellerId: 1,
          sellerName: userData ? JSON.parse(userData).username : "user",
        },
      ]
      foundProduct = mockUserProducts.find((p) => p.id === productId)
    }

    setProduct(foundProduct)
    setIsLoading(false)
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = existingCart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      existingCart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    // You could add a toast notification here
  }

  const isOwner = user && product && user.id === product.sellerId

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!product) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/home">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="mb-6">
            <Link href="/home">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90 flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    Eco-Friendly
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
                <p className="text-4xl font-bold text-accent mb-4">${product.price.toFixed(2)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Sold by</p>
                      <p className="text-sm text-muted-foreground">@{product.sellerName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwner ? (
                  <div className="flex gap-3">
                    <Link href={`/edit-product/${product.id}`} className="flex-1">
                      <Button className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </Button>
                    </Link>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAddToCart} className="w-full" size="lg">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>

              {/* Sustainability Info */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Sustainable Choice</h4>
                      <p className="text-sm text-muted-foreground">
                        By buying this second-hand item, you're helping reduce waste and supporting a circular economy.
                        Estimated CO₂ savings: ~15kg
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
