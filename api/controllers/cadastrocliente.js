import db from "../db.js";

// Função para buscar clientes
export const getCliente = async (_, res) => {
  const q = "SELECT * FROM cliente_info"; 

  try {
    const [data] = await db.query(q); // Usando Promise com async/await
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err.message); // Erro detalhado
    return res.status(500).json({ message: "Erro ao buscar clientes", error: err.message });
  }
};

// Função para adicionar cliente
export const addCliente = async (req, res) => {
  const q = "INSERT INTO cliente_info (`cliente`, `status`, `numeroserie`, `datainicial`, `datafinal`) VALUES (?)";
  const values = [
    req.body.cliente,
    req.body.status,
    req.body.numeroserie,
    req.body.datainicial,
    req.body.datafinal,
  ];

  try {
    const [result] = await db.query(q, [values]);
    const novoCliente = {
      id: result.insertId,
      ...req.body
    };
    return res.status(201).json(novoCliente); // Código 201 para sucesso de criação
  } catch (err) {
    console.error('Erro ao adicionar cliente:', err.message); // Erro detalhado
    return res.status(500).json({ message: 'Erro ao adicionar cliente', error: err.message });
  }
};

// Função para atualizar cliente
export const updateCliente = async (req, res) => {
  const q = "UPDATE cliente_info SET `cliente` = ?, `status` = ?, `numeroserie` = ?, `datainicial` = ?, `datafinal` = ? WHERE `id` = ?";
  
  const values = [
    req.body.cliente,
    req.body.status,
    req.body.numeroserie,
    req.body.datainicial,
    req.body.datafinal,
  ];

  try {
    const [result] = await db.query(q, [...values, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" }); // Caso o cliente não seja encontrado
    }

    return res.status(200).json({ message: "Cliente atualizado com sucesso" });
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err.message); // Erro detalhado
    return res.status(500).json({ message: "Erro ao atualizar cliente", error: err.message });
  }
};

// Função para deletar cliente
export const deleteCliente = async (req, res) => {
  const q = "DELETE FROM cliente_info WHERE `id` = ?";

  try {
    const [result] = await db.query(q, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" }); // Caso o cliente não seja encontrado
    }

    return res.status(200).json({ message: "Cliente deletado com sucesso." });
  } catch (err) {
    console.error('Erro ao deletar cliente:', err.message); // Erro detalhado
    return res.status(500).json({ message: "Erro ao deletar cliente", error: err.message });
  }
};
