# Progresso — Mini-Prontuário

## Como rodar
```bash
npm install
npm run dev
```
Servidor local em `http://localhost:3000`.

## O que foi feito
- Rotas GET/POST de pacientes e de atendimentos
- Conexão com banco de dados SQLite
- Validação das rotas, com status de erro apropriado quando necessário
- Tela de detalhe do paciente (`paciente.html`), com `state`/`render`/`app`
  próprios em `js/patient/`, reaproveitando `api.js`.
- Resumo do paciente (nome, badge, nascimento, CNS, prontuário, idade
  calculada).
- Lista de atendimentos, com estado vazio próprio.
- Modal de novo atendimento (Bootstrap), erro do backend exibido, lista
  atualizada sem reload.
- Loading e erro com visual distinto (spinner vs. `.empty-state--error`).
- 404 tratado com mensagem amigável, sem tela quebrada.

## Nível alcançado
**Nível 2**
- [x] Detalhe do paciente com atendimentos (estado + render)
- [x] Formulário de novo atendimento com erro do backend
- [x] 404 tratado no frontend
- [x] `.encounter-card` em BEM, com tokens, testado em 375px
- [x] Loading e erro tratados separadamente

## Pendências
- Cadastro de pacientes via frontend
- Contador de atendimentos no cartão do paciente (dado derivado, não persistido)

## Autoavaliação
Senti dificuldades com o uso do framework Bootstrap pois não tinha utilizado anteriormente. Além disso, inicialmente,
senti uma sobrecarga para entender a arquitetura do projeto em questão, porém, decidi tentar fazer algumas partes sem 
a geração por IA e consegui me adaptar e compreender melhor a 'orquestração' dos arquivos no decorrer das tarefas. 
Achei muito proveitoso e irei concluir as tarefas listadas em Pendências.
