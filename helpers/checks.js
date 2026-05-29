import { check } from 'k6';

export function validarStatus(response, statusEsperado) {
  check(response, {
    [`status ${statusEsperado}`]: (r) => r.status === statusEsperado
  });
}

export function validarApiResponse(response) {
  check(response, {
    'resposta possui status interno': (r) => r.json('status') !== undefined,
    'resposta possui mensagem': (r) => r.json('message') !== undefined,
    'resposta possui data': (r) => r.json('data') !== undefined
  });
}

export function validarLista(response) {
  check(response, {
    'data é uma lista': (r) => Array.isArray(r.json('data'))
  });
}