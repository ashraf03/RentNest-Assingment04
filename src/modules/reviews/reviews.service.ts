import { PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface IReviewPayload {
  propertyId: string;
  rating: number;
  comment: string;
}

const createReview = async (
  payload: IReviewPayload,
  tenantId: string
) => {
  // Check Property

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

  // Check Completed Rental

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
      status: RentalRequestStatus.APPROVED,
      payment: {
        status: PaymentStatus.COMPLETED,
      },
    },
  });

  if (!rentalRequest) {
    throw new Error(
      "You can review only after completing the rental payment"
    );
  }

  // Already Reviewed

  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this property"
    );
  }

  // Create Review

  const result = await prisma.review.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      rating: payload.rating,
      comment: payload.comment,
    },

    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },

      property: {
        include: {
          category: true,
        },
      },
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
};