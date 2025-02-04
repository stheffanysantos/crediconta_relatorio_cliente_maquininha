export const createMovement = async (req, res) => {
  const { cliente_id, cliente_nome, movimento, valor_liquido } = req.body;

  if (!cliente_id || !cliente_nome || !movimento || !valor_liquido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    console.log('Buscando saldo do cliente...');

    // Buscar o TotalPorcentage da tabela movements e garantir que o cliente existe
    const [movementsData] = await db.execute(
      'SELECT Cliente, TotalPorcentage FROM movements WHERE id = ?',
      [cliente_id]
    );

    if (!movementsData.length) {
      return res.status(404).json({ error: 'Cliente não encontrado na tabela movements' });
    }

    let saldo_atual = movementsData[0].TotalPorcentage; // Saldo inicial baseado no TotalPorcentage
    let cliente_nome_db = movementsData[0].Cliente; // Nome do cliente da tabela movements

    // Buscar o saldo atual do cliente na tabela visualizaoperador
    const [lastMovement] = await db.execute(
      'SELECT saldo_atual FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC LIMIT 1',
      [cliente_id]
    );

    // Se já existir movimentação, usa o último saldo, senão mantém o TotalPorcentage
    if (lastMovement.length) {
      saldo_atual = lastMovement[0].saldo_atual;
    }

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
      [cliente_id, cliente_nome_db, movimento, valor_liquido, saldo_atual]
    );

    // Atualizar o TotalPorcentage na tabela movements
    await db.execute(
      'UPDATE movements SET TotalPorcentage = ? WHERE id = ?',
      [saldo_atual, cliente_id]
    );

    // Retornar a resposta com os dados da movimentação
    res.json({ 
      id: result.insertId, 
      cliente_id, 
      cliente_nome: cliente_nome_db, 
      movimento, 
      valor_liquido, 
      saldo_atual 
    });
  } catch (err) {
    console.error('Erro ao processar a movimentação:', err);
    res.status(500).json({ error: err.message });
  }
};



export const getMovementsByClient = async (req, res) => {
  const { cliente_id } = req.params;

  try {
    // Buscar TotalPorcentage e Nome do Cliente na tabela movements
    const [movementsData] = await db.execute(
      'SELECT Cliente, TotalPorcentage FROM movements WHERE id = ?',
      [cliente_id]
    );

    if (!movementsData.length) {
      return res.status(404).json({ error: 'Cliente não encontrado na tabela movements' });
    }

    let cliente_nome = movementsData[0].Cliente;
    let totalPorcentage = movementsData[0].TotalPorcentage;

    // Buscar movimentações na visualizaoperador
    const [movimentacoes] = await db.execute(
      'SELECT * FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC',
      [cliente_id]
    );

    res.json({ cliente_id, cliente_nome, totalPorcentage, movimentacoes });
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: err.message });
  }
};


