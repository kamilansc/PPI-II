# PPI-II

Este repositório reúne as atividades e projetos de prática desenvolvidos na disciplina **Programação para Internet II**, do IFPI.

## Estrutura

```
01-projeto-base/            # Mini-Prontuário — cadastro e detalhe de pacientes
01-projeto-base-medicacao/  # extensão do projeto base — prescrições/medicações
```

Cada entrega da disciplina fica isolada em sua própria pasta na raiz do repositório, numerada na ordem em que foi proposta. Isso mantém o histórico de cada atividade independente das demais, mesmo quando um projeto é uma extensão direta de outro (como é o caso da pasta de medicação em relação ao projeto base).

## Stack por atividade

Como as atividades vão sendo propostas ao longo do semestre, cada uma pode envolver ferramentas e tecnologias diferentes, de acordo com o que for pedido em cada enunciado. A tabela abaixo resume o que foi utilizado em cada projeto:

| Pasta | Frontend | Backend | Outros |
|---|---|---|---|
| `01-projeto-base` | HTML, CSS (tokens + BEM), JavaScript (ES Modules puro) | Express, better-sqlite3, TypeScript (via tsx) | Bootstrap 5.3 via CDN |
| `01-projeto-base-medicacao` | HTML, CSS (tokens + BEM), JavaScript (ES Modules puro) | Express, better-sqlite3, TypeScript (via tsx) | Bootstrap 5.3 via CDN |

## Como rodar

Para executar qualquer uma das atividades, é preciso entrar na pasta correspondente e instalar as dependências antes de iniciar o servidor:

```bash
npm install
npm run dev
```

Informações específicas de cada entrega — como o que foi implementado, o nível alcançado na atividade e eventuais pendências — estão documentadas no `README.md` ou `PROGRESSO.md` de cada pasta individual.
