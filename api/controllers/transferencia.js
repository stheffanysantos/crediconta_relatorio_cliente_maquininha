import db from "../db.js";

// Criar uma transferência
export const criarTransferencia = (req, res) => {
  const { maquininhaId, clienteDestino, clienteOrigem, data } = req.body;

  // Iniciar a transação para garantir a atomicidade da operação
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao iniciar a transação", error: err.message });
    }

    // Desativar a maquininha no cliente de origem
    const q1 = "UPDATE cliente_info SET status = 'desativado' WHERE numeroserie = ? AND status = 'ativado'";
    db.query(q1, [maquininhaId], (err, result) => {
      if (err) {
        db.rollback(() => {
          return res.status(500).json({ message: "Erro ao desativar maquininha", error: err.message });
        });
      }
      
      if (result.affectedRows === 0) {
        db.rollback(() => {
          return res.status(400).json({ message: "Maquininha não encontrada ou não está ativada" });
        });
      }

      // Registrar a transferência na tabela de transferências
      const q2 = "INSERT INTO transferencias (maquininha_id, cliente_origem_id, cliente_destino_id, data_transferencia) VALUES (?)";
      const values = [maquininhaId, clienteOrigem, clienteDestino, data];

      db.query(q2, [values], (err, result) => {
        if (err) {
          db.rollback(() => {
            return res.status(500).json({ message: "Erro ao registrar a transferência", error: err.message });
          });
        }

        // Atualizar o status da maquininha no cliente de destino
        const q3 = "UPDATE cliente_info SET status = 'ativado' WHERE id = ?";
        db.query(q3, [clienteDestino], (err, result) => {
          if (err) {
            db.rollback(() => {
              return res.status(500).json({ message: "Erro ao atualizar cliente de destino", error: err.message });
            });
          }

          // Commit da transação
          db.commit((err) => {
            if (err) {
              db.rollback(() => {
                return res.status(500).json({ message: "Erro ao realizar o commit", error: err.message });
              });
            }

            return res.status(200).json({ message: "Transferência realizada com sucesso" });
          });
        });
      });
    });
  });
};
