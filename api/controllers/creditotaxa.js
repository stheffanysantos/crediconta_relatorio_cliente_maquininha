import db from "../db.js";

// Função para buscar as taxas ativas
export const gethistoricocredito = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM historicocredito WHERE active = ?", [true]);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar taxas:", error);
    res.status(500).json({ error: "Erro ao buscar taxas" });
  }
};

// Função para adicionar uma nova taxa
export const addhistoricocredito = async (req, res) => {
  const { tipo, bandeira, percentage, active } = req.body;

  // Validação de dados
  if (!tipo || !bandeira || percentage === undefined) {
    return res.status(400).json({ error: "Tipo, bandeira e porcentagem são obrigatórios" });
  }

  try {
    // Verifica se já existe uma taxa ativa para a mesma bandeira e tipo
    const [existing] = await db.query(
      "SELECT * FROM historicocredito WHERE bandeira = ? AND tipo = ? AND active = ?",
      [bandeira, tipo, true]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: `Já existe uma taxa ativa para a bandeira ${bandeira} e tipo ${tipo}` });
    }

    const [result] = await db.query(
      "INSERT INTO historicocredito (tipo, bandeira, percentage, active, created_at) VALUES (?, ?, ?, ?, NOW())",
      [tipo, bandeira, percentage, active ?? true]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Erro ao adicionar a taxa:", error);
    res.status(500).json({ error: "Erro ao adicionar a taxa" });
  }
};

// Função para atualizar uma taxa
export const updatehistoricocredito = async (req, res) => {
  const { id } = req.params; // Captura o parâmetro :id da URL
  const { tipo, percentage, active } = req.body;

  // Verificação de dados obrigatórios
  if (!tipo || !percentage || active === undefined) {
    return res.status(400).json({ error: "Dados incompletos para atualização" });
  }

  try {
    // Atualiza a taxa no banco
    const [result] = await db.query(
      "UPDATE historicocredito SET tipo = ?, percentage = ?, active = ? WHERE rate_id = ?",
      [tipo, percentage, active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Taxa não encontrada" });
    }

    res.json({ message: "Taxa atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar a taxa:", error);
    res.status(500).json({ error: "Erro ao atualizar a taxa" });
  }
};

// Função para excluir uma taxa (remoção definitiva)
export const deletehistoricocredito = async (req, res) => {
  const { id } = req.params;

  // Verificação do ID
  if (!id || isNaN(id)) {
    console.log(`ID inválido ou ausente: ${id}`);
    return res.status(400).json({ error: "ID inválido ou ausente" });
  }

  try {
    console.log(`Tentando excluir a taxa com ID: ${id}`);

    // Remove a taxa do banco de dados
    const [result] = await db.query("DELETE FROM historicocredito WHERE rate_id = ?", [id]);

    if (result.affectedRows === 0) {
      console.log("Taxa não encontrada");
      return res.status(404).json({ error: "Taxa não encontrada" });
    }

    return res.json({ message: "Taxa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir a taxa:", error);
    return res.status(500).json({ error: "Erro ao excluir a taxa" });
  }
};
