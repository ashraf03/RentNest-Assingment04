import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getRentalRequests = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      landlordId,
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          address: true,
          rent: true,
        },
      },

      tenant: {
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

const updateRentalRequest = async (
  requestId: string,
  payload: {
    status: RentalRequestStatus;
  },
  landlordId: string
) => {
  // Check request exists
  const isRequestExist = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!isRequestExist) {
    throw new Error(
      "Rental request not found"
    );
  }

  // Check ownership
  if (isRequestExist.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to update this request"
    );
  }

  // Allow only APPROVED or REJECTED
  if (
    payload.status !== RentalRequestStatus.APPROVED &&
    payload.status !== RentalRequestStatus.REJECTED
  ) {
    throw new Error(
      "Status must be APPROVED or REJECTED"
    );
  }

  const result = await prisma.rentalRequest.update({
    where: {
      id: requestId,
    },

    data: {
      status: payload.status,
    },

    include: {
      property: true,

      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      payment: true,
    },
  });

  return result;
};


export const LandManagementService = {
  getRentalRequests,
  updateRentalRequest
};