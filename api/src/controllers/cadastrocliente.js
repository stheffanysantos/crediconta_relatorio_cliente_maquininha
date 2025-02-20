import db from "../config/db.js";

// Função para buscar clientes
export const getCliente = async (_, res) => {
  const q = "SELECT * FROM movements"; 

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
  const q = "INSERT INTO movements (`idzeus`,`Cliente`, `Maquineta`, `Status`, `numeroserie`,`numeroserie2`, `datainicial`, `datafinal`) VALUES (?)";
  const values = [
    req.body.idzeus,
    req.body.Cliente,
    req.body.Maquineta,
    req.body.Status,
    req.body.numeroserie,
    req.body.numeroserie2,
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
  const q = "UPDATE movements SET `Cliente` = ?,`Maquineta` = ?, `Status` = ?, `numeroserie` = ?,`numeroserie2` = ?, `datainicial` = ?, `datafinal` = ?, `TotalPorcentage` = ? WHERE `idzeus` = ?";
  
  const values = [
    req.body.Cliente,
    req.body.Maquineta,
    req.body.Status,
    req.body.numeroserie,
    req.body.numeroserie2,
    req.body.datainicial,
    req.body.datafinal ,
    req.body.TotalPorcentage,
    req.body.idzeus,
  ];
  console.log("Dados recebidos para atualização:", req.body);


  try {
    const [result] = await db.query(q, [...values, req.params.idzeus]);

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
  const q = "DELETE FROM movements WHERE `idzeus` = ?";

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

// Função para desativar cliente
export const deactivateCliente = async (req, res) => {
  const q = "UPDATE movements SET `Status` = 'Desativado' WHERE `idzeus` = ?";

  try {
    const [result] = await db.query(q, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    return res.status(200).json({ message: "Cliente desativado com sucesso." });
  } catch (err) {
    console.error('Erro ao desativar cliente:', err.message);
    return res.status(500).json({ message: "Erro ao desativar cliente", error: err.message });
  }
};


