import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
          <Link
            href="/properties/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            List Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              No properties listed yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to list a property!
            </p>
            <Link
              href="/properties/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const images = JSON.parse(property.images || "[]")
              const firstImage = images[0] || "/placeholder-house.jpg"

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-48 bg-gray-200">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {property.address}, {property.city}, {property.state}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        property.type === "SALE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        For {property.type === "SALE" ? "Sale" : "Rent"}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
