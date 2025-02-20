import express from "express";
import {
  getCliente,
  addCliente,
  updateCliente,
  deactivateCliente,
  deleteCliente,
} from "../controllers/cadastrocliente.js"; 

const router = express.Router();

// Definindo as rotas da API
router.get("/", getCliente);        // Busca todos os clientes
router.post("/", addCliente);
router.put("/cliente/:id", updateCliente);       // Adiciona um novo cliente
router.put("/:id", deactivateCliente);
router.delete("/:id", deleteCliente); // Deleta um cliente
export default router;
