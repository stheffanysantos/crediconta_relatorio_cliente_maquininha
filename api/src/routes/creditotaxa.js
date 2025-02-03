import express from "express";
import {
  gethistoricocredito,
  addhistoricocredito,
  updatehistoricocredito,
  deletehistoricocredito,
} from "../controllers/creditotaxa.js";

const router = express.Router();

router.get("/", gethistoricocredito); // Rota para buscar todas as taxas ativas
router.post("/", addhistoricocredito); // Rota para adicionar uma nova taxa
router.put("/:id", updatehistoricocredito); // Rota para atualizar uma taxa
router.delete("/:id", deletehistoricocredito); // Rota para excluir uma taxa (remover do banco)

export default router;
