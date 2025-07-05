import express from "express";
import { createTracking, getTracking, updateTracking, deleteTracking } from "../controllers/trackingController.js";

const router = express.Router();

router.post("/create", createTracking);
router.get("/:trackingId", getTracking);
router.put("/:trackingId", updateTracking);
router.delete("/:trackingId", deleteTracking);

export default router;

