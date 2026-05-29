export function produtoPayload() {
  const timestamp = Date.now();

  return {
    id: `789${timestamp}`.slice(0, 13),
    nome: `Produto Teste K6 ${timestamp}`,
    custoProduto: 10.50,
    tipoPrecificacao: 'PERCENTUAL',
    margemLucro: 30.0,
    lucroValor: null
  };
}

export function produtoAtualizadoPayload(id) {
  return {
    id,
    nome: `Produto Teste K6 Atualizado ${Date.now()}`,
    custoProduto: 12.00,
    tipoPrecificacao: 'PERCENTUAL',
    margemLucro: 35.0,
    lucroValor: null
  };
}

export function contaPayload() {
  const timestamp = Date.now();

  return {
    nome: `Conta Teste K6 ${timestamp}`,
    descricao: `Descrição Conta ${timestamp}`,
    valor: 1500.50,
    dataVencimento: '2026-12-31'
  };
}

export function contaAtualizadaPayload() {
  const timestamp = Date.now();

  return {
    nome: `Conta Atualizada ${timestamp}`,
    descricao: `Descrição Atualizada ${timestamp}`,
    valor: 2000.75,
    dataVencimento: '2026-12-31'
  };
}