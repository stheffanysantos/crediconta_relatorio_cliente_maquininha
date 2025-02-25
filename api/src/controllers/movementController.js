import db from "../config/db.js";

export const createMovement = async (req, res) => {
  const { cliente_id, cliente_nome, movimento, valor_liquido, prevenda } = req.body;

  if (!cliente_id || !cliente_nome || !movimento || !valor_liquido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    console.log('Buscando saldo do cliente...');

    // Buscar o TotalPorcentage da tabela movements e garantir que o cliente existe
    const [movementsData] = await db.execute(
      'SELECT Cliente, TotalPorcentage FROM movements WHERE idzeus = ?',
      [cliente_id]
    );

    if (!movementsData.length) {
      return res.status(404).json({ error: 'Cliente não encontrado na tabela movements' });
    }

    let saldo_atual = parseFloat(movementsData[0].TotalPorcentage); // Garantir que seja um número
    let cliente_nome_db = movementsData[0].Cliente;

    // Buscar o saldo atual do cliente na tabela visualizaoperador
    const [lastMovement] = await db.execute(
      'SELECT saldo_atual FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC LIMIT 1',
      [cliente_id]
    );

    if (lastMovement.length) {
      saldo_atual = parseFloat(lastMovement[0].saldo_atual); // Converter para número
    }

    // Definir constantes para valores de entrada e saída
    let valorAdicional = 0;
    let valorSubtraido = 0;
    const valorLiquidoFloat = parseFloat(valor_liquido); // Garantir tipo numérico

    if (movimento === 'entrada') {
      valorAdicional = valorLiquidoFloat;
      saldo_atual += valorAdicional;
    } else if (movimento === 'saida') {
      if (saldo_atual < valorLiquidoFloat) {
        return res.status(400).json({ error: 'Saldo insuficiente!' });
      }
      valorSubtraido = valorLiquidoFloat;
      saldo_atual -= valorSubtraido;
    } else {
      return res.status(400).json({ error: 'Movimento inválido!' });
    }

    // Inserir movimentação no banco de dados
    const [result] = await db.execute(
      `INSERT INTO visualizaoperador 
       (cliente_id, cliente_nome, movimento, valor_liquido, saldo_atual, prevenda, valoradicional, valorsubtraido, data_movimentacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [cliente_id, cliente_nome_db, movimento, valorLiquidoFloat, saldo_atual, prevenda || '0.00', valorAdicional, valorSubtraido]
    );

 
    await db.execute(
      'UPDATE movements SET TotalPorcentage = ? WHERE idzeus = ?',
      [saldo_atual, cliente_id]
    );

 
    res.json({ 
      id: result.insertId, 
      cliente_id, 
      cliente_nome: cliente_nome_db, 
      movimento, 
      valor_liquido: valorLiquidoFloat, 
      saldo_atual, 
      prevenda: prevenda || '---',
      valoradicional: valorAdicional,
      valorsubtraido: valorSubtraido
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
      'SELECT Cliente, TotalPorcentage FROM movements WHERE idzeus = ?',
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


export const getLastModifiedClients = async (req, res) => {
  try {
    const [clientsData] = await db.execute(
      `
        SELECT v.cliente_id, v.cliente_nome, v.data_movimentacao, v.movimento, 
               v.valor_liquido, v.saldo_atual, v.prevenda  -- Adicionado o campo prevenda aqui
        FROM visualizaoperador v
        INNER JOIN (
          SELECT cliente_id, MAX(data_movimentacao) AS last_mov
          FROM visualizaoperador
          GROUP BY cliente_id
        ) AS latest
        ON v.cliente_id = latest.cliente_id AND v.data_movimentacao = latest.last_mov
        ORDER BY v.data_movimentacao DESC
      `
    );

    if (!clientsData.length) {
      return res.status(404).json({ error: 'Nenhum cliente modificado encontrado.' });
    }

    res.json({ clients: clientsData });
  } catch (err) {
    console.error('Erro ao buscar últimos clientes modificados:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllMovements = async (req, res) => {
  try {
    const [movements] = await db.execute(
      `SELECT cliente_id, cliente_nome, data_movimentacao, movimento, valor_liquido, saldo_atual, prevenda 
       FROM visualizaoperador 
       ORDER BY data_movimentacao DESC`
    );

    if (!movements || movements.length === 0) {
      return res.status(404).json({ error: 'Nenhuma movimentação encontrada.' });
    }

    res.status(200).json({ movements });
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar movimentações.' });
  }
};

export const getMovementsByClientName = async (req, res) => {
  const { cliente_nome } = req.params;

  try {
    // Buscar o cliente na tabela movements usando nome com correspondência parcial
    const [movementsData] = await db.execute(
      'SELECT idzeus, TotalPorcentage FROM movements WHERE Cliente LIKE ?',
      [`%${cliente_nome}%`]  // Aqui usamos % para busca parcial
    );

    if (!movementsData.length) {
      return res.status(404).json({ error: 'Cliente não encontrado na tabela movements' });
    }

    let cliente_id = movementsData[0].idzeus;
    let totalPorcentage = movementsData[0].TotalPorcentage;

    // Buscar movimentações na visualizaoperador
    const [movimentacoes] = await db.execute(
      'SELECT * FROM visualizaoperador WHERE cliente_id = ? ORDER BY data_movimentacao DESC',
      [cliente_id]
    );

    res.json({ cliente_id, cliente_nome, totalPorcentage, movimentacoes });
  } catch (err) {
    console.error('Erro ao buscar movimentações por nome de cliente:', err);
    res.status(500).json({ error: err.message });
  }
};


