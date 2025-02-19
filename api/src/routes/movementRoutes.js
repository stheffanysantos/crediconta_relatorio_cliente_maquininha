import express from "express";
import { 
  createMovement, 
  getMovementsByClient, 
  getLastModifiedClients, 
  getAllMovements 
} from "../controllers/movementController.js";

const router = express.Router();

// Rota para criar uma nova movimentação
router.post("/", createMovement);

// Rota para obter todas as movimentações (correta agora)
router.get("/clientes", getAllMovements);

// Rota para obter os últimos clientes modificados
router.get("/ultimos-modificados", getLastModifiedClients);

// Rota para obter movimentações por cliente (deve vir depois para evitar conflitos)
router.get("/:cliente_id", getMovementsByClient);

export default router;
