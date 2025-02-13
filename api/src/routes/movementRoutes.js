import express from "express";
import { createMovement, getMovementsByClient, getLastModifiedClients } from "../controllers/movementController.js";

const router = express.Router();

// Rota para criar uma nova movimentação
router.post("/", createMovement);

// Rota para buscar movimentações por cliente
router.get("/:cliente_id", getMovementsByClient);

// Nova rota para buscar os últimos 6 clientes modificados
router.get("/", getLastModifiedClients);

export default router;
