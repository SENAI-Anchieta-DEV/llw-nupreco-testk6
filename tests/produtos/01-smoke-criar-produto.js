import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';
import { produtoPayload } from '../../helpers/payloads.js';
import {
  validarStatus,
  validarApiResponse
} from '../../helpers/checks.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000']
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

  const response = http.post(
    `${BASE_URL}/produtos`,
    JSON.stringify(produtoPayload()),
    params
  );

  validarStatus(response, 201);
  validarApiResponse(response);

  sleep(1);
}