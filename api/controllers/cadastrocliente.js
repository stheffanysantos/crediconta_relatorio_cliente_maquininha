import db from "../db.js";

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
  const q = "INSERT INTO movements (`Cliente`, `Maquineta`, `Status`, `NumeroSerie`, `DataInicial`, `DataFinal`, `Total`) VALUES (?)";
  const values = [
    req.body.Cliente,
    req.body.Maquineta,
    req.body.Status,
    req.body.NumeroSerie,
    req.body.DataInicial,
    req.body.DataFinal,
    req.body.Total,
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
  const q = "UPDATE movements SET `Cliente` = ?,`Maquineta` = ?, `Status` = ?, `NumeroSerie` = ?, `DataInicial` = ?, `DataFinal` = ?, `Total` = ? WHERE `id` = ?";
  
  const values = [
    req.body.Cliente,
    req.body.Maquineta,
    req.body.Status,
    req.body.NumeroSerie,
    req.body.DataInicial,
    req.body.DataFinal,
    req.body.Total,
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
  const q = "DELETE FROM movements WHERE `id` = ?";

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

export const getMaquininhasComMovements = async (_, res) => {
  const q = `
    SELECT 
      t.id AS transactions_id, t.numeroserie,
      m.id AS movements_id, m.NumeroSerie
    FROM transactions t
    INNER JOIN movements m ON t.numeroserie = m.NumeroSerie
  `;

  try {
    const [data] = await db.query(q);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar maquininhas e movimentos:", err.message);
    return res.status(500).json({ message: "Erro ao buscar dados", error: err.message });
  }
};

// Função que roda a atualização do Total
export const updateTotalValorBruto = async (_, res) => {
  const q = `
    UPDATE movements m
    INNER JOIN (
        SELECT 
            t.numeroserie,
            SUM(t.valorbruto) AS total_valorbruto
        FROM transactions t
        GROUP BY t.numeroserie
    ) subquery ON m.NumeroSerie = subquery.numeroserie
    SET m.Total = subquery.total_valorbruto;
  `;

  try {
    console.log("Executando atualização de valores totais...");

    const [result] = await db.query(q);

    console.log(`Linhas afetadas: ${result.affectedRows}`);

    return res.status(200).json({ 
      message: "Valores totais atualizados com sucesso!", 
      affectedRows: result.affectedRows 
    });

  } catch (err) {
    console.error("Erro ao atualizar valores totais:", err);
    return res.status(500).json({ 
      message: "Erro ao atualizar valores totais", 
      error: err.message 
    });
  }
};


export const truncateAndUpdateTotals = async (_, res) => {
  try {
    await db.query("TRUNCATE TABLE transactions");
    await updateTotalValorBruto(_, res);  // Atualiza o total após o TRUNCATE
    return res.status(200).json({ message: "Tabela truncada e totais atualizados com sucesso!" });
  } catch (err) {
    console.error("Erro ao truncar a tabela e atualizar os totais:", err.message);
    return res.status(500).json({ message: "Erro ao truncar a tabela e atualizar os totais", error: err.message });
  }
};
