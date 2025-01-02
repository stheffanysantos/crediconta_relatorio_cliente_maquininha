import express from "express";
import { getClientes, addCliente, updateCliente, deleteCliente } from "../controllers/cadastrocliente.js"; // Ajuste conforme a estrutura do seu projeto

const router = express.Router();  // Cria um router

router.get("/", getClientes);  // Rota GET para pegar todos os clientes
router.post("/", addCliente);  // Rota POST para adicionar um novo cliente
router.put("/:id", updateCliente);  // Rota PUT para atualizar um cliente
router.delete("/:id", deleteCliente);  // Rota DELETE para excluir um cliente

export default router;  // Exporta o router, que é um objeto que contém as rotas
