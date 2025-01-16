import db from "../db.js";

// Função para criar uma transferência
export const criarTransferencia = async (req, res) => {
  const { maquininhaId, clienteDestino, clienteOrigem, data } = req.body;

  // Validação de dados
  if (!maquininhaId || !clienteDestino || !clienteOrigem || !data) {
    return res.status(400).json({ error: "Dados incompletos para criar a transferência" });
  }

  const connection = await db.getConnection(); // Obter conexão para a transação

  try {
    await connection.beginTransaction();

    // Desativar a maquininha no cliente de origem
    const [result1] = await connection.query(
      "UPDATE cliente_info SET status = 'desativado' WHERE numeroserie = ? AND status = 'ativado'",
      [maquininhaId]
    );
    if (result1.affectedRows === 0) {
      throw new Error("Maquininha não encontrada ou não está ativada");
    }

    // Registrar a transferência na tabela de transferências
    const [result2] = await connection.query(
      "INSERT INTO transferencias (maquininha_id, cliente_origem_id, cliente_destino_id, data_transferencia) VALUES (?, ?, ?, ?)",
      [maquininhaId, clienteOrigem, clienteDestino, data]
    );

    // Atualizar o status da maquininha no cliente de destino
    const [result3] = await connection.query(
      "UPDATE cliente_info SET status = 'ativado' WHERE id = ?",
      [clienteDestino]
    );
    if (result3.affectedRows === 0) {
      throw new Error("Erro ao atualizar o status do cliente de destino");
    }

    // Registrar no histórico de clientes
    await connection.query(
      "INSERT INTO historico_maquininhas (maquininha_id, cliente_id, data_transferencia) VALUES (?, ?, ?)",
      [maquininhaId, clienteOrigem, data]
    );

    // Commit da transação
    await connection.commit();
    res.status(200).json({ message: "Transferência realizada com sucesso e histórico atualizado" });
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao realizar transferência:", error.message);
    res.status(500).json({ error: "Erro ao realizar a transferência", details: error.message });
  } finally {
    connection.release(); // Liberar a conexão
  }
};
