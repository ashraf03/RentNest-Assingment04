import { PaymentProvider, PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import SSLCommerzPayment from 'sslcommerz-lts';

const createPayment = async (
  payload: {
    rentalRequestId: string;
  },
  tenantId: string
) => {

  // Check Rental Request

  const rentalRequest = await prisma.rentalRequest.findUnique({

    where: {
      id: payload.rentalRequestId,
    },

    include: {
      property: true,
      payment: true,
      tenant: true,
    },
  });

  if (!rentalRequest) {
    throw new Error(
      "Rental Request not found"
    );
  }

  // Tenant Check

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You are not authorized"
    );
  }

  // Must be approved

  if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
    throw new Error(
      "Rental request is not approved"
    );
  }

  // Already Paid

  if (rentalRequest.payment) {
    throw new Error(
      "Payment already exists"
    );
  }

  // Transaction Id

  const transactionId = uuidv4();

  // Save Payment

  await prisma.payment.create({

    data: {

      transactionId,

      rentalRequestId: rentalRequest.id,

      amount: rentalRequest.property.rent,

      method: "Online",

      provider: PaymentProvider.SSLCOMMERZ,

      status: PaymentStatus.PENDING,

    },

  });

  // SSLCommerz

  const sslcz = new SSLCommerzPayment(

    process.env.STORE_ID!,

    process.env.STORE_PASSWORD!,

    process.env.IS_LIVE === "true"

  );

  const paymentData = {

    total_amount: rentalRequest.property.rent,

    currency: "BDT",

    tran_id: transactionId,

    success_url: `${process.env.BACKEND_URL}/api/payments/success`,

    fail_url: `${process.env.BACKEND_URL}/api/payments/fail`,

    cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel`,

    ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,

    shipping_method: "NO",

    product_name: rentalRequest.property.title,

    product_category: "Rental",

    product_profile: "general",

    cus_name: rentalRequest.tenant.name,

    cus_email: rentalRequest.tenant.email,

    cus_add1: rentalRequest.property.address,

    cus_city: rentalRequest.property.city,

    cus_country: "Bangladesh",

    cus_phone: rentalRequest.tenant.phone || "01700000000",

  };

  const session = await sslcz.init(paymentData);

  return {
    paymentUrl: session.GatewayPageURL,
    transactionId,
  };
};

const confirmPayment = async (transactionId: string) => {
  // Find Payment
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },

    include: {
      rentalRequest: true,
    },
  });

  if (!payment) {
    throw new Error(
      "Payment not found"
    );
  }

  // Already Completed
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new Error(
      "Payment already confirmed"
    );
  }

  // Update Payment Status
  const result = await prisma.payment.update({
    where: {
      transactionId,
    },

    data: {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: true,
        },
      },
    },
  });

  return result;
};

const getPaymentHistory = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: tenantId,
      },
    },

    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
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
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSinglePayment = async (
  paymentId: string,
  tenantId: string
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
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

          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error(
      "Payment not found"
    );
  }

  // Authorization Check
  if (payment.rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You are not authorized to view this payment"
    );
  }

  return payment;
};

export const PaymentService = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getSinglePayment
};