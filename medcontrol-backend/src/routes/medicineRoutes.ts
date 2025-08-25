import { Router } from "express";
import medicineController from "../controllers/medicineController";
import authMiddleware from "../middlewares/authMiddleware";
import {
  validateRequest,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createMedicineSchema,
  updateMedicineSchema,
  medicineIdSchema,
  regenerateDosagesSchema,
} from "../validators/medicineValidators";

const router = Router();

router.use(authMiddleware);

router.get("/", medicineController.getAllMedicines);
router.get(
  "/:id",
  validateParams(medicineIdSchema),
  medicineController.getMedicineById
);
router.post(
  "/",
  validateRequest(createMedicineSchema),
  medicineController.createMedicine
);
router.put(
  "/:id",
  validateParams(medicineIdSchema),
  validateRequest(updateMedicineSchema),
  medicineController.updateMedicine
);
router.delete(
  "/:id",
  validateParams(medicineIdSchema),
  medicineController.deleteMedicine
);

router.post(
  "/:id/regenerate-dosages",
  validateParams(medicineIdSchema),
  validateRequest(regenerateDosagesSchema),
  medicineController.regenerateDosages
);

export default router;
