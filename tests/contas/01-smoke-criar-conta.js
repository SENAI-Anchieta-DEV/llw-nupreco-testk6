import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';
import { contaPayload } from '../../helpers/payloads.js';
import {
  validarStatus,
  validarApiResponse
} from '../../helpers/checks.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<5000']
  }
};

export function setup() {
  return {
    token: login()
  };
}

export default function (data) {
  const params = authHeaders(data.token);

  const response = http.post(
    `${BASE_URL}/contas`,
    JSON.stringify(contaPayload()),
    params
  );

  console.log(`POST /contas STATUS: ${response.status}`);

  if (response.status >= 400) {
    console.log(`POST /contas BODY: ${response.body}`);
  }

  validarStatus(response, 201);
  validarApiResponse(response);

  sleep(1);
}