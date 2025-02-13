import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cadastroclienteRoutes from "../src/routes/cadastrocliente.js";
import transferenciasRoutes from "../src/routes/transferencia.js";
import creditotaxaRoutes from "../src/routes/creditotaxa.js";
import userRoutes from "../src/routes/userRoutes.js";
import db from "../src/config/db.js"; // Certifique-se de que o arquivo `db.js` exporta uma instância de conexão válida
import movementRoutes from "../src/routes/movementRoutes.js";

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const PORT = process.env.PORT || 8800;

console.log("Iniciando o servidor...");

const app = express();
app.use(express.json()); // Suporte para JSON no corpo das requisições
app.use(cors());
console.log("Middlewares configurados.");

// Rota principal para verificação do servidor.
app.get("/", (req, res) => {
  res.status(200).send("Servidor funcionando!");
});

// Configuração das rotas
app.use("/api/cadastrocliente", cadastroclienteRoutes);
app.use("/api/transferencia", transferenciasRoutes);
app.use("/api/creditotaxa", creditotaxaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movement", movementRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).send({ error: "Rota não encontrada." });
});

// Middleware para tratamento de erros no servidor
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err.message);
  res.status(500).send({ error: "Erro interno do servidor." });
});

// Função para iniciar o servidor
const startServer = () => {
  app.listen(8800, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
  });
};

// Função para testar a conexão com o banco de dados antes de iniciar o servidor
const testConnection = async () => {
  try {
    console.log("Tentando obter conexão com o banco de dados...");
    const connection = await db.getConnection();
    await connection.query("SELECT 1"); // Comando simples para testar a conexão
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    connection.release(); // Libera a conexão para o pool
    console.log("Conexão liberada!");
    startServer(); // Inicia o servidor após validar a conexão
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  }
};

// Testa a conexão e inicia o servidor
testConnection();
