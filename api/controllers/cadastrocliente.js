import db from "../db.js";


export const getClientes = (_, res) => {
  const q = "SELECT * FROM cliente_info"; 

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};


export const addCliente = (req, res) => {
  const q = "INSERT INTO cliente_info (`cliente`, `status`, `numeroserie`, `datainicial`, `datafinal`) VALUES (?)";
  const values = [
    req.body.cliente,
    req.body.status,
    req.body.numeroserie,
    req.body.datainicial,
    req.body.datafinal,
  ];

  db.query(q, [values], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar cliente:', err);
      return res.status(500).json({ fatal: true, message: 'Erro ao adicionar cliente', error: err.message });
    }

    const novoCliente = {
      id: result.insertId,
      ...req.body 
    };

    return res.status(200).json(novoCliente); 
  });
};


export const updateCliente = (req, res) => {
  const q = "UPDATE cliente_info SET `cliente` = ?, `status` = ?, `numeroserie` = ?, `datainicial` = ?, `datafinal` = ? WHERE `id` = ?";
  
  const values = [
    req.body.cliente,
    req.body.status,
    req.body.numeroserie,
    req.body.datainicial,
    req.body.datafinal,
  ];

  db.query(q, [...values, req.params.id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar cliente:', err);
      return res.status(500).json({ message: "Erro ao atualizar cliente", error: err.message });
    }

    return res.status(200).json({ message: "Cliente atualizado com sucesso" });
  });
};

// Deletar um cliente
export const deleteCliente = (req, res) => {
  const q = "DELETE FROM cliente_info WHERE `id` = ?";

  db.query(q, [req.params.id], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Cliente deletado com sucesso.");
  });
};
