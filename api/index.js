import express from "express";
import cors from "cors";
import cadastroClienteRoutes from "./routes/cadastrocliente.js";  // Rota de clientes
import transferenciaRoutes from "./routes/transferencia.js";  // Rota de transferências
import db from './db.js'; // Conexão com o banco de dados

const app = express();

app.use(express.json());
app.use(cors());

// Rota principal
app.get("/", (req, res) => {
  res.status(200).send("Servidor funcionando!");
});

// Usando as rotas
app.use("/api/cadastrocliente", cadastroClienteRoutes);
app.use("/api/transferencia", transferenciaRoutes);

// Verificação de conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  } else {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    app.listen(8800, () => {
      console.log("Servidor rodando na porta 8800...");
    });
  }
});

export default db;
