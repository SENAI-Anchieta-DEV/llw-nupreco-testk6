import http from 'k6/http';
import { sleep } from 'k6';

import { BASE_URL } from '../../config/environments.js';
import { login } from '../../helpers/auth.js';
import { authHeaders } from '../../helpers/headers.js';
import {
  validarStatus,
  validarApiResponse
} from '../../helpers/checks.js';

export const options = {
  vus: 20,
  duration: '1m',
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

export default function(data) {

  const response = http.get(
    `${BASE_URL}/estoque`,
    authHeaders(data.token)
  );

  validarStatus(response, 200);
  validarApiResponse(response);

  sleep(1);
}