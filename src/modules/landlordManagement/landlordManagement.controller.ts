// src/app/modules/landManagement/landManagement.controller.ts

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyService } from "../properties/properties.service";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { LandManagementService } from "./landlordManagement.service";


const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.createProperty(
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const result = await PropertyService.updateProperty(
    req.params.id as string,
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const result = await PropertyService.deleteProperty(
    req.params.id as string,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property deleted successfully",
    data: result,
  });
});

const getRentalRequests = catchAsync(async (req, res) => {
  const result = await LandManagementService.getRentalRequests(
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalRequest = catchAsync(async (req:Request, res: Response) => {
  const result = await LandManagementService.updateRentalRequest(
    req.params.id as string,
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental request updated successfully",
    data: result,
  });
});

export const LandManagementController = {
  createProperty,
  updateProperty,
  deleteProperty,
  getRentalRequests,
  updateRentalRequest,
};