export function produtoPayload() {
  const timestamp = Date.now();

  return {
    id: `789${timestamp}`,
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