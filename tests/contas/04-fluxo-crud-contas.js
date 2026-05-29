import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';

import {
  contaPayload,
  contaAtualizadaPayload
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
  return {
    token: login()
  };
}

export default function(data) {
  const params = authHeaders(data.token);

  const criarResponse = http.post(
    `${BASE_URL}/contas`,
    JSON.stringify(contaPayload()),
    params
  );

  validarStatus(criarResponse, 201);
  validarApiResponse(criarResponse);

  const contaId = criarResponse.json('data.id');

  const listarResponse = http.get(
    `${BASE_URL}/contas`,
    params
  );

  validarStatus(listarResponse, 200);
  validarApiResponse(listarResponse);
  validarLista(listarResponse);

  const buscarResponse = http.get(
    `${BASE_URL}/contas/${contaId}`,
    params
  );

  validarStatus(buscarResponse, 200);
  validarApiResponse(buscarResponse);

  const atualizarResponse = http.put(
    `${BASE_URL}/contas/${contaId}`,
    JSON.stringify(contaAtualizadaPayload()),
    params
  );

  validarStatus(atualizarResponse, 200);
  validarApiResponse(atualizarResponse);

  const deletarResponse = http.del(
    `${BASE_URL}/contas/${contaId}`,
    null,
    params
  );

  validarStatus(deletarResponse, 204);

  sleep(1);
}