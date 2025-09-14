import { Router } from "express";
import dosageController from "../controllers/dosageController";
import authMiddleware from "../middlewares/authMiddleware";
import {
  validateRequest,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createDosageSchema,
  dosageIdSchema,
  medicineIdSchema,
} from "../validators/dosageValidators";

const router = Router();

router.use(authMiddleware);

router.get("/", dosageController.getAllDosages);
router.get(
  "/:id",
  validateParams(dosageIdSchema),
  dosageController.getDosageById
);
router.post(
  "/",
  validateRequest(createDosageSchema),
  dosageController.createDosage
);
router.put(
  "/:id/taken",
  validateParams(dosageIdSchema),
  dosageController.registerDosageTaken
);
router.put(
  "/:id/missed",
  validateParams(dosageIdSchema),
  dosageController.markDosageMissed
);
router.delete(
  "/medicine/:medicineId",
  validateParams(medicineIdSchema),
  dosageController.deleteByMedicine
);

export default router;
