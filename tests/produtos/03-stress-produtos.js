import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';
import {
  validarStatus,
  validarApiResponse,
  validarLista
} from '../../helpers/checks.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 30 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000']
  }
};

export function setup() {
  const token = login();

  return {
    token
  };
}

export default function (data) {
  const params = authHeaders(data.token);

  const response = http.get(`${BASE_URL}/produtos`, params);

  validarStatus(response, 200);
  validarApiResponse(response);
  validarLista(response);

  sleep(1);
}