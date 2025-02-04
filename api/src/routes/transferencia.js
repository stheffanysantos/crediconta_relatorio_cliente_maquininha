import express from "express";
import { criarTransferencia } from "../controllers/transferencia.js";

const router = express.Router();

// Rota para criar transferência de maquininha
router.post("/", criarTransferencia);

export default router;
