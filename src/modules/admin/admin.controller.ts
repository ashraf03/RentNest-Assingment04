import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from 'http-status';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const result = await AdminService.updateUserStatus(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const result = await AdminService.getAllProperties();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req, res) => {
  const result = await AdminService.getAllRentalRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

export const AdminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests
}