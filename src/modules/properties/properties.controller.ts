import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyService } from "./properties.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.createProperty(
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getAllProperties(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getSingleProperty(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.updateProperty(
    req.params.id,
    req.body,
    req.user?.id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.deleteProperty(
    req.params.id as string,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Property deleted successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PropertyService.updateAvailability(
      req.params.id as string,
      req.body.availability,
      req.user?.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Property availability updated successfully",
      data: result,
    });
  }
);

export const PropertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  updateAvailability,
};