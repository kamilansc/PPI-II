```markdown
## Tarefa: Implementa camada MedicationsRepository · Trilha: ARQ · Rota: agente
- **Ferramenta/modelo:** GPT-6 Luna
- **Prompt (chat: C-P-T-R-F-A) ou tarefa (agente: 4 campos):**
## Goal
Extrair a camada repository de Medications: interface
MedicationsRepository medications.service.ts para o adapter.
## Context
@AGENTS.md @INVARIANTES.md @src/services/medications.service.ts
@src/repositories/LEIA-ME.md — padrão port & adapter da trilha.
## Constraints
Fora de escopo: encounters, patients, rotas, controllers,
public/, tests/. Sem libs novas. A tradução snake->camel vai
JUNTO com o SQL para o adapter (invariante: formato não vaza).
## Done when
npm run gate: checagens 1 e 3 verdes; npm run arch acusa UMA
violação a menos que antes; nenhum diff em tests/.
- **Plano editado?** Não houve plano formal; depois da revisão, fiz uma correção na função listByEncounter e nos parâmetros recebidos na função listMedicationsByEncounter de service.
- **Evidência de pronto:**
✔ tipos ok
  
  error controllers-nao-tocam-o-banco: src/controllers/encounters.controller.ts → src/database.ts

x 1 dependency violations (1 errors, 0 warnings). 31 modules, 69 dependencies cruised.

ℹ tests 17
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 7
ℹ todo 0
ℹ duration_ms 959.7739
✔ testes verdes

==============================================
GATE VERMELHO ✘ — 1 checagem(ns) falhando. Não entregue assim.

- **Revisão adversarial** (quando houve): A função listMedicationsByEncounter recebia o parâmetro request:{ params: Record<string, string | string[]> }. Recusei essa implementação pois a função de service iria ter muito domínio de um formato vindo de http.
- **O que EU decidi** (a parte que não foi delegada):
Decidi que a função listMedicationsByEncounter recebe apenas o id de encounter passado pela função controller de listagem de medicações, dessa forma: listMedicationsByEncounter(Number(request.params.encounterId)).
```