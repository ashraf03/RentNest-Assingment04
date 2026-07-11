import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { ReviewService } from "./reviews.service";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(
    req.body,
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});


export const ReviewController = {
  createReview,
};

