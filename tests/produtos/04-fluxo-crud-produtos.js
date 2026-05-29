import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';
import {
  produtoAtualizadoPayload
} from '../../helpers/payloads.js';
import {
  validarStatus,
  validarApiResponse,
  validarLista
} from '../../helpers/checks.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500']
  }
};

export function setup() {
  const token = login();

  return {
    token
  };
}

function gerarProdutoUnico() {
  const unico = `${Date.now()}-${__VU}-${__ITER}`;

  return {
    id: `789${unico}`.replace(/\D/g, '').slice(0, 13),
    nome: `Produto Teste K6 ${unico}`,
    custoProduto: 10.50,
    tipoPrecificacao: 'PERCENTUAL',
    margemLucro: 30.0,
    lucroValor: null
  };
}

function logErro(etapa, response) {
  console.log(`${etapa} STATUS: ${response.status}`);

  if (response.status >= 400) {
    console.log(`${etapa} BODY: ${response.body}`);
  }
}

export default function (data) {
  const params = authHeaders(data.token);

  const novoProduto = gerarProdutoUnico();
  const produtoId = novoProduto.id;

  const criarResponse = http.post(
    `${BASE_URL}/produtos`,
    JSON.stringify(novoProduto),
    params
  );

  logErro('POST /produtos', criarResponse);
  validarStatus(criarResponse, 201);
  validarApiResponse(criarResponse);

  if (criarResponse.status !== 201) {
    return;
  }

  const listarResponse = http.get(`${BASE_URL}/produtos`, params);

  logErro('GET /produtos', listarResponse);
  validarStatus(listarResponse, 200);
  validarApiResponse(listarResponse);
  validarLista(listarResponse);

  const buscarResponse = http.get(`${BASE_URL}/produtos/${produtoId}`, params);

  logErro(`GET /produtos/${produtoId}`, buscarResponse);
  validarStatus(buscarResponse, 200);
  validarApiResponse(buscarResponse);

  const atualizarResponse = http.put(
    `${BASE_URL}/produtos/${produtoId}`,
    JSON.stringify(produtoAtualizadoPayload(produtoId)),
    params
  );

  logErro(`PUT /produtos/${produtoId}`, atualizarResponse);
  validarStatus(atualizarResponse, 200);
  validarApiResponse(atualizarResponse);

  const deletarResponse = http.del(
    `${BASE_URL}/produtos/${produtoId}`,
    null,
    params
  );

  logErro(`DELETE /produtos/${produtoId}`, deletarResponse);
  validarStatus(deletarResponse, 204);

  sleep(1);
}