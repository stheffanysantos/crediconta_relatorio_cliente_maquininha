import express from "express";
import { createMovement, getMovementsByClient } from "../controllers/movementController.js";

const router = express.Router();

// Rota para criar uma nova movimentação
router.post("/", createMovement);

// Rota para buscar movimentações por cliente
router.get("/:cliente_id", getMovementsByClient);

export default router;
