# Registro de Interações com IA

Modelo: Claude (Anthropic)

## Interação 1
Ferramenta: Claude <br>
Objetivo: definir design da tela de detalhe do paciente com mesmo design da tela de listagem <br>
Decisão: adotada — mockup com tokens/CSS reais do projeto <br>
Validei: comparei com o design da tela de listagem

## Interação 2
Ferramenta: Claude <br>
Objetivo: organizar arquivos JS da tela de paciente <br>
Decisão: adotada — pasta `js/patient/` com state/render/app próprios <br>
Validei: apliquei e conferir a árvore de pastas

## Interação 3
Ferramenta: Claude <br>
Objetivo: navegação do card do paciente até o detalhe <br>
Decisão: adotada — link `Ver detalhes →` com `?id=` <br>
Validei: testei clique no navegador

## Interação 4
Ferramenta: Claude <br>
Objetivo: tela presa em "carregando" <br>
Decisão: adotada — separei container de status dos de heading/fields <br>
Validei: testei fluxo loading → sucesso

## Interação 5
Ferramenta: Claude <br>
Objetivo: status HTTP de encounters vazio <br>
Decisão: adotada — 200 + array vazio, 404 só se paciente não existe <br>
Validei: percebi a melhoria no frontend pois poderia mostrar uma mensagem mais leve do que a de erro. Também testei via `requests.http`

## Interação 6
Ferramenta: Claude <br>
Objetivo: botão "Nova consulta" abrindo formulário <br>
Decisão: adotada — modal Bootstrap via CDN <br>
Validei: testei abrir/cancelar/enviar

## Interação 7
Ferramenta: Claude <br>
Objetivo: salvar novo atendimento sem reload <br>
Decisão: adotada — `preventDefault` + `FormData` + refetch da lista <br>
Validei: testei criação e atualização automática

## Interação 8
Ferramenta: Claude <br>
Objetivo: estados de loading e erro diferenciados visualmente <br>
Decisão: adotada — spinner no loading, `.empty-state--error` no erro <br>
Validei: testei os três cenários no navegador
