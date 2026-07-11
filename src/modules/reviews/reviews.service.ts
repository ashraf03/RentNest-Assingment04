import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import {
  PaymentStatus,
  RentalRequestStatus,
} from "@prisma/client";

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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Property not found"
    );
  }

  // Check Approved Rental
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
      status: RentalRequestStatus.APPROVED,
    },
    include: {
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have not rented this property"
    );
  }

  // Check Payment
  if (
    !rentalRequest.payment ||
    rentalRequest.payment.status !== PaymentStatus.COMPLETED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Complete payment before leaving a review"
    );
  }

  // Check Existing Review
  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
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
      property: true,

      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
};