import express from "express";
import medicineRoutes from "./medicineRoutes";
import authRoutes from "./authRoutes";
import dosageRoutes from "./dosageRoutes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/medicines", medicineRoutes);
router.use("/dosages", dosageRoutes);

export default router;
