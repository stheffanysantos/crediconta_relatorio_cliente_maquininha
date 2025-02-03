import db from "../config/db.js";

// Criar nova movimentação
export const createMovement = async (req, res) => {
  const { cliente_id, cliente_nome, movimento, valor_liquido } = req.body;

  if (!cliente_id || !cliente_nome || !movimento || !valor_liquido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    console.log('Buscando saldo do cliente...');

    // Buscar o saldo atual do cliente (última movimentação)
    const [lastMovement] = await db.execute(
      'SELECT saldo_atual FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC LIMIT 1',
      [cliente_id]
    );

    let saldo_atual = lastMovement.length ? lastMovement[0].saldo_atual : 0;

    // Calcular novo saldo com base no tipo de movimento (entrada ou saída)
    if (movimento === 'entrada') {
      saldo_atual += valor_liquido;
    } else if (movimento === 'saida') {
      if (saldo_atual < valor_liquido) {
        return res.status(400).json({ error: 'Saldo insuficiente!' });
      }
      saldo_atual -= valor_liquido;
    } else {
      return res.status(400).json({ error: 'Movimento inválido!' });
    }

    // Inserir nova movimentação no banco de dados
    const [result] = await db.execute(
      `INSERT INTO visualizaoperador (cliente_id, cliente_nome, movimento, valor_liquido, saldo_atual, data_movimentacao) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [cliente_id, cliente_nome, movimento, valor_liquido, saldo_atual]
    );

    // Retornar a resposta com os dados da movimentação
    res.json({ 
      id: result.insertId, 
      cliente_id, 
      cliente_nome, 
      movimento, 
      valor_liquido, 
      saldo_atual 
    });
  } catch (err) {
    console.error('Erro ao processar a movimentação:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar todas as movimentações de um cliente
export const getMovementsByClient = async (req, res) => {
  const { cliente_id } = req.params;

  try {
    const [result] = await db.execute(
      'SELECT * FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC',
      [cliente_id]
    );
    res.json(result); // Retorna as movimentações ordenadas pela data
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: err.message });
  }
};
