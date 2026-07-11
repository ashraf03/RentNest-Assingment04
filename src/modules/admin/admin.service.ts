import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          properties: true,
          tenantRequests: true,
          ownerRequests: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};


const updateUserStatus = async (
  userId: string,
  payload: {
    status: UserStatus;
  }
) => {
  // Check User Exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new Error(
      "User not found"
    );
  }

  // Update Status
  const result = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status: payload.status,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllProperties = async () => {
  const result = await prisma.property.findMany({
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

      _count: {
        select: {
          rentalRequests: true,
          reviews: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getAllRentalRequests = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          address: true,
          rent: true,
          availability: true,
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

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },

      payment: {
        select: {
          id: true,
          transactionId: true,
          amount: true,
          provider: true,
          status: true,
          paidAt: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests
};