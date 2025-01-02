import express from "express";
import { criarTransferencia } from "../controllers/transferencia.js"; 

const router = express.Router();  

router.post("/", criarTransferencia); 

export default router;
