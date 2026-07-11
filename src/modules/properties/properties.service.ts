import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { IUpdateProperty } from "./properites.interface";

const createProperty = async (
  payload: any,
  landlordId: string
) => {
  // Check if category exists
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!isCategoryExist) {
    throw new Error(
      "Category not found"
    );
  }

  // Create Property
  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      rent: payload.rent,
      address: payload.address,
      city: payload.city,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      availability: payload.availability ?? true,
      landlordId,
      categoryId: payload.categoryId,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });

  return result;
};

const getAllProperties = async (query: Record<string, any>) => {
  const {
    searchTerm,
    city,
    categoryId,
    availability,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // Search
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // City Filter
  if (city) {
    andConditions.push({
      city: {
        equals: city,
        mode: "insensitive",
      },
    });
  }

  // Category Filter
  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }

  // Availability Filter
  if (availability !== undefined) {
    andConditions.push({
      availability: availability === "true",
    });
  }

  // Price Filter
  if (minPrice || maxPrice) {
    andConditions.push({
      rent: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.property.findMany({
    where: whereConditions,

    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: true,
    },

    skip: (Number(page) - 1) * Number(limit),

    take: Number(limit),

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.property.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },

    data: result,
  };
};

const getSingleProperty = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id,
    },

    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      category: true,

      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error(
      "Property not found"
    );
  }

  return result;
};

const deleteProperty = async (
  propertyId: string,
  landlordId: string
) => {
  // Check Property Exists
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error(
      "Property not found"
    );
  }

  // Check Ownership
  if (property.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to delete this property"
    );
  }

  // Delete Property
  const result = await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return result;
};

const updateAvailability = async (
  propertyId: string,
  availability: boolean,
  landlordId: string
) => {
  // Check Property Exists
  const isPropertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!isPropertyExist) {
    throw new Error(
      "Property not found"
    );
  }

  // Check Property Owner
  if (isPropertyExist.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to update this property"
    );
  }

  // Update Availability
  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },

    data: {
      availability,
    },

    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      category: true,
    },
  });

  return result;
};

const updateProperty = async (
  propertyId: string,
  payload: IUpdateProperty,
  landlordId: string
) => {
  // Check Property Exists
  const isPropertyExist = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!isPropertyExist) {
    throw new Error(
      "Property not found"
    );
  }

  // Check Owner
  if (isPropertyExist.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to update this property"
    );
  }

  // Check Category (if category is changing)
  if (payload.categoryId) {
    const isCategoryExist = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!isCategoryExist) {
      throw new Error(
        "Category not found"
      );
    }
  }

  // Update Property
  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },

    data: {
      ...payload,
    },

    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      category: true,
    },
  });

  return result;
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  deleteProperty,
  updateAvailability,
  updateProperty
};