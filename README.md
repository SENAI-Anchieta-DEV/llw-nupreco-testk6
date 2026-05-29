# NuPreço — Testes de Performance com k6

Este projeto contém scripts k6 para testar performance, carga e stress da API do NuPreço.

## Estrutura

```txt
nupreco-k6-tests/
├── config/
│   └── environments.js
├── helpers/
│   ├── auth.js
│   ├── checks.js
│   ├── headers.js
│   ├── payloads.js
│   └── response.js
└── tests/
    ├── auth/
    ├── produtos/
    ├── contas/
    ├── estoque/
    └── fluxos/
```

## Autenticação correta do NuPreço

O backend do NuPreço faz login com:

```json
{
  "nome": "admin",
  "senha": "123456"
}
```

Endpoint:

```txt
POST /auth/login
```

A resposta da API vem no padrão:

```json
{
  "status": 200,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "...",
    "id": "...",
    "nome": "...",
    "role": "GESTOR"
  }
}
```

## Executar usando API local

```bash
k6 run -e BASE_URL=http://localhost:8080 -e ADMIN_NOME=admin -e ADMIN_SENHA=123456 tests/auth/01-smoke-login.js
```

## Executar usando Render

```bash
k6 run -e BASE_URL=https://llw-nupreco-backend-api.onrender.com -e ADMIN_NOME=admin -e ADMIN_SENHA=123456 tests/produtos/04-fluxo-crud-produtos.js
```

## Observação importante

Para testar Contas, o usuário usado no login precisa ter perfil `GESTOR`, pois o backend protege os endpoints de contas com permissão de gestor.
