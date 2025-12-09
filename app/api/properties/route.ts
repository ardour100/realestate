import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // For now, we'll create a default user if none exists
    // In production, you'd get this from the authenticated session
    let user = await prisma.user.findFirst()

    if (!user) {
      // Create a default user for demo purposes
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          password: "hashed_password",
          name: "Demo User"
        }
      })
    }

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        sqft: body.sqft,
        type: body.type,
        images: body.images || "[]",
        userId: user.id
      }
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error("Failed to create property:", error)
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    )
  }
}
