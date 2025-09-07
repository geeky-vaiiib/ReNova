"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, Users, Heart, Globe, ShoppingBag } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Vaibhav J P",
      role: "Full-Stack Developer",
      description: "Lead developer passionate about sustainable technology and creating impactful solutions.",
      avatar: "VJ"
    },
    {
      name: "Kritika",
      role: "Frontend Developer",
      description: "UI/UX enthusiast focused on creating beautiful and accessible user experiences.",
      avatar: "K"
    },
    {
      name: "Monisha",
      role: "Backend Developer",
      description: "Database and API specialist ensuring robust and scalable backend architecture.",
      avatar: "M"
    },
    {
      name: "K Chandan Jaysimha",
      role: "Product Manager",
      description: "Product strategist driving the vision for sustainable marketplace solutions.",
      avatar: "CJ"
    }
  ]

  const features = [
    {
      icon: <Recycle className="h-8 w-8 text-emerald-600" />,
      title: "Reduce Waste",
      description: "Give products a second life and reduce environmental impact through reuse."
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-emerald-600" />,
      title: "Affordable Shopping",
      description: "Find quality products at affordable prices while supporting sustainability."
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Community Driven",
      description: "Connect with like-minded individuals who care about the environment."
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-600" />,
      title: "Global Impact",
      description: "Be part of a global movement towards sustainable consumption."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-foreground">About ReNova</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ReNova is a second-hand marketplace built to encourage sustainability, reduce waste,
            and connect buyers with sellers for affordable, eco-friendly shopping.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-emerald-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              We believe that sustainable living should be accessible to everyone. Our platform empowers 
              individuals to make environmentally conscious choices by providing a trusted marketplace 
              for pre-owned goods. Every transaction on ReNova contributes to reducing waste,
              conserving resources, and building a more sustainable future for our planet.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Why Choose ReNova?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-emerald-800 dark:text-emerald-200">
              Join the Sustainable Revolution
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300 mb-6 max-w-2xl mx-auto">
              Every item you buy or sell on ReNova helps reduce waste and promotes a circular economy.
              Together, we can make a significant impact on our planet's future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">24+</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Products Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">7</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Eco-Friendly</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
