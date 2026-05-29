import http from 'k6/http';
import { check, fail } from 'k6';

import {
  BASE_URL,
  ADMIN_NOME,
  ADMIN_SENHA
} from '../config/environments.js';

export function login() {
  const payload = JSON.stringify({
    nome: ADMIN_NOME,
    senha: ADMIN_SENHA
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: '30s'
  };

  const response = http.post(`${BASE_URL}/auth/login`, payload, params);

  console.log(`LOGIN STATUS: ${response.status}`);
  console.log(`LOGIN BODY: ${response.body}`);

  const ok = check(response, {
    'login retornou status 200': (r) => r.status === 200,
    'login retornou data.token': (r) => !!r.json('data.token')
  });

  if (!ok) {
    fail('Falha no login. Verifique ADMIN_NOME, ADMIN_SENHA e resposta da API.');
  }

  return response.json('data.token');
}