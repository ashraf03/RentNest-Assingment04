import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

interface IRentalRequestPayload {
  propertyId: string;
  moveInDate: Date;
  message?: string;
}

const createRentalRequest = async (
  payload: IRentalRequestPayload,
  tenantId: string
) => {
  // Check Property Exists
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new Error(
      "Property not found"
    );
  }

  // Check Property Availability
  if (!property.availability) {
    throw new Error(
      "Property is not available"
    );
  }

  // Check Duplicate Request
  const isRequestExist = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (isRequestExist) {
    throw new Error(
      "Rental request already exists"
    );
  }

  // Create Rental Request
  const result = await prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      landlordId: property.landlordId,
      moveInDate: payload.moveInDate,
      message: payload.message,
    },

    include: {
      property: true,

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getMyRentalRequests = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    include: {
      property: {
        include: {
          category: true,
        },
      },

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      payment: true,
    },

    orderBy: {
      moveInDate: "desc",
    },
  });

  return result;
};
const getSingleRentalRequest = async (
  rentalRequestId: string,
  tenantId: string
) => {
  const result = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },

    include: {
      property: {
        include: {
          category: true,
        },
      },

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      payment: true,
    },
  });

  if (!result) {
    throw new Error(
      "Rental request not found"
    );
  }

  // Tenant can only view their own rental request
  if (result.tenantId !== tenantId) {
    throw new Error(
      "You are not authorized to view this rental request"
    );
  }

  return result;
};
export const RentalRequestService = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest
};