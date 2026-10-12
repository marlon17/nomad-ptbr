# Referência da API

O NOMAD oferece uma API REST para todas as operações. Todos os endpoints ficam em `/api/` e retornam JSON.

---

## Referência interativa

A referência completa e sempre atualizada dos endpoints é gerada diretamente das rotas e validadores
da aplicação e servida numa interface interativa do [Scalar](https://scalar.com):

- **[/reference](/reference)** — navegue por todos os endpoints, esquemas de requisição/resposta e teste chamadas ao vivo
- **[/api/openapi.json](/api/openapi.json)** — o documento OpenAPI 3.1 bruto (importe no Postman, Insomnia, geradores de código etc.)

Como ela é gerada dos mesmos validadores VineJS que a API usa, nunca fica desatualizada em relação
à implementação. Prefira-a a qualquer lista de endpoints escrita à mão.

---

## Convenções

**URL base:** `http://<seu-servidor>/api`

**Respostas:**
- Respostas de sucesso incluem `{ "success": true }` e um status HTTP 2xx
- Respostas de erro retornam o status HTTP adequado (400, 404, 409, 500) com uma mensagem de erro
- Operações demoradas (downloads, testes de desempenho, embeddings) retornam 201 ou 202 com um ID de tarefa/teste para consulta

**Padrão assíncrono:** envie uma tarefa → receba um ID → consulte um endpoint de status até concluir.
