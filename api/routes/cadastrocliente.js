import express from "express";
import {
  getCliente,
  addCliente,
  updateCliente, 
  deleteCliente,
} from "../controllers/cadastrocliente.js"; 

const router = express.Router();

// Definindo as rotas da API
router.get("/", getCliente);        // Busca todos os clientes
router.post("/", addCliente);       // Adiciona um novo cliente
router.put("/:id", updateCliente); // Atualiza um cliente
router.delete("/:id", deleteCliente); // Deleta um cliente

export default router;
