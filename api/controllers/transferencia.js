import db from "../db.js";

export const criarTransferencia = (req, res) => {
  const { maquininhaId, clienteDestino, clienteOrigem, data } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao iniciar a transação", error: err.message });
    }

    // Desativar a maquininha no cliente de origem
    const q1 = "UPDATE cliente_info SET status = 'desativado' WHERE numeroserie = ? AND status = 'ativado'";
    db.query(q1, [maquininhaId], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Erro ao desativar maquininha", error: err.message });
        });
      }
      if (result.affectedRows === 0) {
        return db.rollback(() => {
          res.status(400).json({ message: "Maquininha não encontrada ou não está ativada" });
        });
      }

      // Registrar a transferência na tabela de transferências
      const q2 = "INSERT INTO transferencias (maquininha_id, cliente_origem_id, cliente_destino_id, data_transferencia) VALUES (?)";
      const valuesTransferencia = [maquininhaId, clienteOrigem, clienteDestino, data];
      db.query(q2, [valuesTransferencia], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Erro ao registrar a transferência", error: err.message });
          });
        }

        // Registrar no histórico de clientes
        const qHistorico = "INSERT INTO historico_maquininhas (maquininha_id, cliente_id, data_transferencia) VALUES (?)";
        const valuesHistorico = [maquininhaId, clienteOrigem, data];
        db.query(qHistorico, [valuesHistorico], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Erro ao salvar histórico", error: err.message });
            });
          }

          // Atualizar o status da maquininha no cliente de destino
          const q3 = "UPDATE cliente_info SET status = 'ativado' WHERE id = ?";
          db.query(q3, [clienteDestino], (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: "Erro ao atualizar cliente de destino", error: err.message });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: "Erro ao realizar o commit", error: err.message });
                });
              }

              res.status(200).json({ message: "Transferência realizada com sucesso e histórico atualizado" });
            });
          });
        });
      });
    });
  });
};
