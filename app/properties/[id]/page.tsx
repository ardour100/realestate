import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!property) {
    notFound()
  }

  const images = JSON.parse(property.images || "[]")

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/properties"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Properties
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-200">
            {images.length > 0 ? (
              <Image
                src={images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xl">
                No Image Available
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-blue-600">
                  ${property.price.toLocaleString()}
                </p>
                <span className={`inline-block mt-2 px-4 py-2 text-sm rounded-full ${
                  property.type === "SALE"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  For {property.type === "SALE" ? "Sale" : "Rent"}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{property.bedrooms}</p>
                <p className="text-gray-600">Bedrooms</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{property.bathrooms}</p>
                <p className="text-gray-600">Bathrooms</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{property.sqft.toLocaleString()}</p>
                <p className="text-gray-600">Square Feet</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Agent</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Name:</span> {property.user.name || "N/A"}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Email:</span> {property.user.email}
              </p>
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
