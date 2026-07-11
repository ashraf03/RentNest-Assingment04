import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RentalRequestService } from "./rentalRequest.service";
import httpStatus from 'http-status';

const createRentalRequest = catchAsync(async (req, res) => {
  const result = await RentalRequestService.createRentalRequest(
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req, res) => {
  const result = await RentalRequestService.getMyRentalRequests(
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});


const getSingleRentalRequest = catchAsync(async (req, res) => {
  const result =
    await RentalRequestService.getSingleRentalRequest(
      req.params.id as string,
      req.user?.id as string
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request retrieved successfully",
    data: result,
  });
});

export const RentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest
};