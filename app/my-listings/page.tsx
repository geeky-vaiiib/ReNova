"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Package } from "lucide-react" // Import Package component

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  imageUrl: string
  sellerId: number
  sellerName: string
  createdAt?: string
}

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load user's products from localStorage
    const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")

    // Add some mock products for the current user for demo purposes
    const mockUserProducts = [
      {
        id: 101,
        title: "MacBook Pro 2019",
        description: "Well-maintained MacBook Pro, perfect for students or professionals",
        price: 899.99,
        category: "Electronics",
        imageUrl: "/placeholder.svg?height=300&width=300&text=MacBook",
        sellerId: 1,
        sellerName: userData ? JSON.parse(userData).username : "user",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: 102,
        title: "Vintage Denim Jacket",
        description: "Classic 90s denim jacket in excellent condition, size M",
        price: 45.0,
        category: "Clothing",
        imageUrl: "/placeholder.svg?height=300&width=300&text=Denim+Jacket",
        sellerId: 1,
        sellerName: userData ? JSON.parse(userData).username : "user",
        createdAt: "2024-01-10T14:30:00Z",
      },
    ]

    // Combine mock products with user-added products
    const allUserProducts = [...mockUserProducts, ...userProducts]
    setProducts(allUserProducts)
  }, [])

  const handleDeleteProduct = (productId: number) => {
    const updatedProducts = products.filter((product) => product.id !== productId)
    setProducts(updatedProducts)

    // Update localStorage (remove from userProducts, keep mock products in memory only)
    const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]")
    const updatedUserProducts = userProducts.filter((product: Product) => product.id !== productId)
    localStorage.setItem("userProducts", JSON.stringify(updatedUserProducts))

    setDeleteProductId(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
              <p className="text-muted-foreground">Manage your products on the marketplace</p>
            </div>
            <Link href="/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start selling by adding your first product to the marketplace
                </p>
              </div>
              <Link href="/add-product">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} showActions={false} />

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link href={`/edit-product/${product.id}`}>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit product</span>
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteProductId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete product</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  )
}
