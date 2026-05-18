import { Router } from "express";
import { deletePatient, getPatients, updatePatient } from "../controllers/patients.controller.js";

const router = Router();

router.get("/", getPatients);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
