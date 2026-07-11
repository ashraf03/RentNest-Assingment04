import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.createPayment(
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.confirmPayment(
    req.body.transactionId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getPaymentHistory = catchAsync(async (req, res) => {
  const result = await PaymentService.getPaymentHistory(
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getSinglePayment(
    req.params.id as string,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});
export const PaymentController = {
    createPayment,
    confirmPayment,
    getPaymentHistory,
    getSinglePayment
}