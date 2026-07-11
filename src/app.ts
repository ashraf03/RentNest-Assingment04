import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { AuthRoutes } from "./modules/auth/auth.route";
import { PropertyRoutes } from "./modules/properties/properties.route";
import { LandManagementRoutes } from "./modules/landlordManagement/landlordManagement.route";
import { RentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { ReviewRoute } from "./modules/reviews/reviews.route";
import { PaymentRoutes } from "./modules/payment/payment.route";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", AuthRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/landlord", LandManagementRoutes);
app.use("/api/rentals", RentalRequestRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/reviews", ReviewRoute);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

export default app;
