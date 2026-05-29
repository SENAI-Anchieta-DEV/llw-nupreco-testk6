import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';

import {
  estoquePayload,
  estoqueRemocaoPayload
} from '../../helpers/payloads.js';

import {
  validarStatus,
  validarApiResponse
} from '../../helpers/checks.js';

export const options = {
  vus: 1,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500']
  }
};

export function setup() {
  return {
    token: login()
  };
}

function logResposta(etapa, response) {
  console.log(`${etapa} STATUS: ${response.status}`);

  if (response.status !== 200) {
    console.log(`${etapa} BODY: ${response.body}`);
  }
}

export default function(data) {
  const params = authHeaders(data.token);

  const listarInicial = http.get(
    `${BASE_URL}/estoque`,
    params
  );

  logResposta('GET /estoque inicial', listarInicial);
  validarStatus(listarInicial, 200);
  validarApiResponse(listarInicial);

  const adicionar = http.patch(
    `${BASE_URL}/estoque/adicionar`,
    JSON.stringify(estoquePayload()),
    params
  );

  logResposta('PATCH /estoque/adicionar', adicionar);
  validarStatus(adicionar, 200);
  validarApiResponse(adicionar);

  const remover = http.patch(
    `${BASE_URL}/estoque/remover`,
    JSON.stringify(estoqueRemocaoPayload()),
    params
  );

  logResposta('PATCH /estoque/remover', remover);
  validarStatus(remover, 200);
  validarApiResponse(remover);

  const listarFinal = http.get(
    `${BASE_URL}/estoque`,
    params
  );

  logResposta('GET /estoque final', listarFinal);
  validarStatus(listarFinal, 200);
  validarApiResponse(listarFinal);

  sleep(1);
}