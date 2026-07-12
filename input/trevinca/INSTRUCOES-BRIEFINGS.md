# Instruções | Geração de Mini-Briefings de Viagem

## Contexto

**Guia:** NM (código de identificação interno — usar no cabeçalho do `00-index.md`)

Este sistema produz **mini-briefings modulares** para guias de expedições de trekking e viagens culturais. Cada briefing é um ficheiro markdown autónomo, focado num tema, escrito em **português europeu**, com o tom de um guia experiente a falar — denso mas não académico.

Os briefings são usados em campo por guias da Borealis (ou operador equivalente) para contextualizar etapas, locais e temas junto aos participantes.

---

## Workflow

1. **O utilizador passa fontes** — URLs, ficheiros md, PDFs, notas brutas
2. **O utilizador pede briefs por assunto** — um tema de cada vez ou vários
3. **Claude gera um `.md` por assunto** no formato definido abaixo
4. **Numeração** pelo utilizador (ver regras abaixo)
5. Em qualquer momento pode ser pedido um `00-index.md` atualizado

---

## Regras de Numeração

**Importante:** todo o conteúdo transversal à viagem (índice, briefing inicial, route details, gerais, altimetria, anexos) vive no bloco `0X` — isto liberta por completo o `10` em diante para dias de viagem, sem limite de quantos dias a viagem tiver.

| Número | Conteúdo | Exemplo |
|-----------|----------|---------|
| `00` | `00-index.md` | **Fixo.** Índice de todos os ficheiros. |
| `01` | `01-briefing-inicial.md` | **Fixo.** |
| `02` | `02-route-details.md` | **Fixo.** |
| `03–09` | **Pool sequencial** — gerais (identidade, língua, cultura, política...), depois `altimetria.md` e `media.md`. Sem número fixo: cada ficheiro leva o próximo número livre, pela ordem em que é criado. | `03-fonetica-euskera.md`, `04-altimetria.md`, `05-media.md` — ou `03-altimetria.md`, `04-media.md` se a viagem não tiver gerais |
| `N0` | **Resumo do Dia N** — sempre o ficheiro `X0-dN.md`, onde `X0 = N × 10` | `10-d1.md`, `20-d2.md`, `30-d3.md` ... `90-d9.md`, `100-d10.md`, `110-d11.md`... |
| `N1–N9` | **Temáticos do Dia N** — sem prefixo de dia no nome | `11-salto-del-nervion.md`, `21-flysch-geologia.md`, `101-tema-d10.md` |

**Regras de nome de ficheiro:**
- Formato: `NN-nome-curto-com-hifens.md` (lowercase, sem acentos). A partir do dia 10, o número passa a 3 dígitos naturalmente (`100`, `110`...) — não há necessidade de zero-padding especial.
- O prefixo `dN` aparece **apenas** no resumo do dia: `10-d1.md`, `20-d2.md`, `100-d10.md`, etc.
- Os temáticos do dia **não** levam prefixo de dia: `11-salto-del-nervion.md` e não `11-d1-salto.md`
- Ficheiros do bloco `03–09` não levam prefixo de dia
- `altimetria.md` e `media.md` **não têm número fixo** — são só o próximo número livre depois dos gerais que a viagem tiver. Normalmente ficam para o fim do bloco `0X`, mas nada obriga a 08/09 especificamente.
- Como o bloco `0X` está reservado a este conteúdo transversal, **nenhum dia de viagem pode colidir com ele**, desde que o total de ficheiros em `0X` não passe de 10 (00 a 09) — o esquema aguenta viagens de qualquer duração.

**Exemplo completo para viagem de 4 dias (com 2 gerais):**
```
00-index.md
01-briefing-inicial.md
02-route-details.md
03-fonetica-basco.md   → geral
04-cultura-vasca.md    → geral
05-altimetria.md       → próximo número livre
06-media.md            → próximo número livre
10-d1.md          ← resumo Dia 1
11-primeiro-tema-d1.md
12-segundo-tema-d1.md
...
20-d2.md          ← resumo Dia 2
21-primeiro-tema-d2.md
...
30-d3.md
40-d4.md
```

**Exemplo para viagem de 1 dia, sem gerais (caso Serra d'Arga):**
```
00-index.md
01-briefing-inicial.md
02-route-details.md
03-altimetria.md   ← próximo número livre (não há gerais)
04-media.md        ← próximo número livre
10-d1.md
11–18 temáticos
```

---

## Formato de Cada Ficheiro

### Cabeçalho
```
# Tema Principal | Subtítulo Descritivo
```

**Breadcrumb do dia + maps/meteo** — obrigatório em qualquer ficheiro temático (`N1–N9`) que pertença a um dia específico. Linha própria, logo a seguir ao título, sem espaço em branco (sem linha em branco) entre as duas, seguida da linha de links. **A linha do breadcrumb termina com quebra de linha markdown (dois espaços no fim)**, para que a linha de links renderize sempre numa linha nova própria e nunca colada ao breadcrumb no mesmo parágrafo:
```
# Tema Principal | Subtítulo Descritivo
DN · contexto curto  
[Mapa](URL) · [Meteo](URL)
```
Os dois links (Mapa e Meteo) ficam sempre inline entre si, separados por ` · `, mas a linha inteira fica sempre isolada numa linha própria — nunca fundida com o breadcrumb acima.

**Sem emojis** — nem nesta linha de links, nem em mais nenhum sítio do brief. `[Mapa](URL)`, não `📍 [Mapa](URL)`.

**O "contexto curto" é localização geográfica por defeito** (`D2 · Costa Basca, Gipuzkoa`) — **nunca dados técnicos de trekking.**

**Dados técnicos (distância, dificuldade, altitude máxima, ascendente acumulado) só podem aparecer em dois sítios:**
1. No resumo do dia (`N0-dN.md`), nos "Dados técnicos" do cabeçalho.
2. Num temático que seja especificamente **sobre o próprio trilho/percurso enquanto trajeto** — não sobre um local, tema ou espécie que aconteça ao longo dele. Exemplo válido: um ficheiro chamado `Trilho Deba–Zumaia`, cujo assunto é o próprio caminho. Exemplo inválido: um ficheiro sobre geologia, fauna, história ou botânica de um ponto do trilho — mesmo que esse ponto fique a meio de uma subida exigente, o contexto continua a ser localização geográfica, não a ficha técnica do dia.

Nesse caso excecional (temático sobre o próprio trajeto), o contexto passa a ser a altimetria desse troço: `D2 · 10 km · Dif. médio baixo · Alt. máx. 224 m · Asc. 401 m`.

**Todos os outros temáticos** — geologia, história, fauna, botânica, cultura, etnografia, etc. — **usam sempre localização geográfica**, nunca a ficha técnica do dia. Não é preciso nos ficheiros do bloco `0X` (gerais, altimetria, media), que são transversais a vários dias, não específicos de um dia.

Os links de Maps/Meteo de **cada temático apontam para o local específico desse tema** (a cascata, o miradouro, o troço do trilho) — diferente do link do resumo do dia (`N0`), que aponta para a dormida ou para o local do evento (ver regra abaixo). É normal e esperado que vários temáticos do mesmo dia apontem para locais diferentes entre si.

### Corpo
- Secções com `###` (nunca `##` como primeiro nível de conteúdo)
- Texto corrido por defeito — bullets apenas quando a informação é genuinamente listável
- Linguagem densa, direta, sem floreados académicos
- Tom de guia: informado, apaixonado, no terreno
- Separadores `---` entre secções
- **Títulos e cabeçalhos (`#`, `###`) em sentence case** — só a primeira palavra e nomes próprios levam maiúscula. `O que é este dia`, `Txindoki e a Serra de Aralar` — certo. `O Que É Este Dia` — nunca. Aplica-se a `#`, `###` e a qualquer label recorrente (`Para o grupo`, não `Para o Grupo`).
- **Se a viagem/dia é de um dia único, isso é o default — não comentar.** Nunca escrever frases como "o único dia da viagem é também o seu todo" ou equivalente. Trata o dia como trataria qualquer outro, sem meta-comentário sobre a sua duração.

### Comprimento e ritmo — regra de bolso
Os briefs são para consulta rápida em campo, não para leitura sentado. Regras:
- **Parágrafos curtos** — máx. 3–4 linhas. Cortar impiedosamente.
- **Factos, não desenvolvimento** — datas, medidas, nomes, causa-efeito. Sem contextualização redundante.
- **Sem frases de arranque vazias** — nunca começar secção com "X é um/uma..." se o título já diz o que é.
- **Comprimento alvo por brief temático:** 250–400 palavras. Os resumos de dia (X0-dN.md) podem ir até 500.
- Se a informação couber numa linha, não ocupa um parágrafo.

### Elementos Recorrentes
- **"Para o grupo"** ou **"Mensagem"** — caixa no final com frase para dizer em voz alta aos participantes. Em itálico ou bloco destacado.
- **"Se perguntarem"** — secção opcional, mas obrigatória em temas de história, arte, política e ciência. O guia é especialista em montanha, não em arte ou história. Esta secção dá-lhe contexto de apoio para responder a perguntas do grupo sem ser apanhado de surpresa. Formato: perguntas prováveis + resposta curta, **uma por linha — cada linha termina com quebra de linha markdown (dois espaços no fim) para nunca fundir com a seguinte no mesmo parágrafo**. Exemplo:
  ```
  ### Se perguntarem
  **"Mas isto foi na Segunda Guerra?"** — Não. Guerra Civil Espanhola, 1936–39. A WWII começa em 1939.  
  **"O quadro ainda está em Guernica?"** — Não, está em Madrid, no Reina Sofía.  
  ```
- **"Fontes"** — sempre no fim, com links quando existem

### Exemplo de estrutura temática
```
# Geologia | Nome do Local

### O que veem
...

### Porquê importa
...

### Para o grupo
"Mensagem em voz direta."

---
**Fontes:**
- [Título](URL)
```

---

## Ficheiros com Estrutura Específica

### `00-index.md`
Cabeçalho padrão com código do guia:
```markdown
# Índice | Mini-briefings Nome da Viagem
**Viagem:** CÓDIGO — DD a DD Mês Ano  
**Base:** Cidade (N noites)  
**Guia:** NM  
**Programa:** [url]
```
Seguido de tabela por dia com colunas Ficheiro | Tema | Estado (✅ / —).

### `01-briefing-inicial.md`
Estrutura fixa:
1. **A equipa** — placeholder `[Apresentação da equipa]` (referência em campo, não conteúdo fixo)
2. **O que é esta viagem** — síntese da viagem e gestão de expectativas (o que é e o que não é)
3. **Regras de segurança** — trilho, emergências, o que esperar
4. **Regras de proteção ambiental** — com portaria/lei relevante do país/região
5. **O fio da viagem** — narrativa central, pitch de saída

Tom: caloroso mas claro. A secção da equipa é sempre um placeholder — o guia apresenta-se ao vivo.

### `02-route-details.md`
- Ficha técnica por dia: partida, distância, dificuldade (escala 1–5), altitude máxima, acumulado ascendente, tempo esperado
- Descrição do terreno e pontos críticos por dia
- Tabela comparativa no final
- Fonte: programa Borealis

### `X0-dN.md` — Resumos Diários (ex: `10-d1.md`, `20-d2.md`)
Estrutura para mini-briefings de resumo de cada dia (um por dia de viagem). Segue sempre a regra de numeração da secção acima: resumo do dia N = `N0-dN.md` (10, 20, 30...); os temáticos desse dia ocupam `N1-N9`.

1. **Cabeçalho** — sem resumo/frase de abertura, só título + dados técnicos + links, por esta ordem:
   1. Título: `# Dia N | Nome do(s) local(is) — subtítulo`
   2. **Dados técnicos**, labels a bold, agrupados em linhas (usar quebra de linha markdown — dois espaços no fim de cada linha):
      - `**Data:** DD Mês AAAA` (linha própria)
      - `**Dificuldade:** nível (N/5)` (linha própria) — só se o dia incluir trekking
      - `**Distância:** X km · **Alt. máx.:** X m · **Asc. acumulada:** X m` (linha própria, agrupada) — só se o dia incluir trekking
      - `**Dormida:** local · **Regime:** alimentação` (linha própria, agrupada) — **se a viagem for de um dia único (sem pernoita), omitir "Dormida" e ficar só `**Regime:** alimentação`**
   3. **Links**: `[Mapa](URL) · [Meteo](URL)` — depois dos dados técnicos, nunca antes, sempre numa linha própria (separada por linha em branco do bloco de dados técnicos acima). Local: dormida da noite (viagem de vários dias) ou local do evento (dia único, sem pernoita). Ver nota abaixo.

   Exemplo real (País Basco, Dia 3 — viagem de vários dias):
   ```markdown
   # Dia 3 | Txindoki e a Serra de Aralar

   **Data:** 27 Junho 2026  
   **Dificuldade:** Médio (3/5)  
   **Distância:** 11 km · **Alt. máx.:** 1.292 m · **Asc. acumulada:** 1.233 m  
   **Dormida:** Bilbau · **Regime:** PA incluído

   [Mapa](URL) · [Meteo](URL)
   ```

   Exemplo para viagem de um dia único (sem "Dormida"):
   ```markdown
   # Dia 1 | Workshop de sobrevivência na Serra d'Arga

   **Data:** 26 Julho 2026  
   **Dificuldade:** Médio-baixo (2/5)  
   **Distância:** 9 km · **Alt. máx.:** 317 m · **Asc. acumulada:** 321 m  
   **Regime:** almoço volante (não incluído)

   [Mapa](URL) · [Meteo](URL)
   ```
2. **O que é este dia** — Parágrafo de síntese: o que o grupo vai viver, o momento central, o porquê de este dia importar
3. **Contexto geográfico e cultural** — Onde estamos, que território, que identidade
4. **Pontos de interesse no trilho** — Lista densa de sítios, elementos naturais ou culturais com os dados essenciais
5. **Fio narrativo do dia** — Como este dia se encaixa na narrativa maior da viagem
6. **Mensagem para o grupo** — Frase para dizer em voz alta (em caixa destacada)
7. **Fontes** — Links relevantes

Um ficheiro `N0-dN.md` por dia de viagem. São o esqueleto de cada etapa — os briefs temáticos expandem cada ponto. **Os dados técnicos do cabeçalho (distância, dificuldade, altitude, ascendente) vivem só aqui e, excecionalmente, nos temáticos sobre o próprio trilho — não se repetem nos temáticos de tema (geologia, história, fauna, etc.), que usam localização geográfica no lugar (ver secção "Formato de Cada Ficheiro" acima).**

**Nota sobre os links de localização do resumo do dia (N0):**
- **Viagem de vários dias:** o local principal é a **dormida** dessa noite (cidade/base onde o grupo dorme). É o ponto estável do dia inteiro — os temáticos desse mesmo dia é que levam os seus próprios links para os locais específicos (cascata, trilho, miradouro).
- **Evento de um único dia, sem pernoita:** não há dormida — o local principal do N0 coincide com o **local do próprio evento** (ponto de encontro, ou a zona do trekking se o dia for uma caminhada).
- Em qualquer dos casos, escolher um único ponto ou zona, não uma lista.

### `XX-fonetica-DESTINO.md` — Fonética Local
Ficheiro de pronúncia para guias — criado uma vez por destino com língua local distinta. Estrutura:
1. **Regras da língua** — As 4–6 regras fonéticas que mais afetam a pronúncia (sons inexistentes em PT)
2. **Glossário fonético** — Tabela: Termo | Língua | Pronúncia original | Aproximação PT | Notas
3. **Dicas de campo** — Os 5–8 termos que mais falham e como treinar

Formato da tabela:
```
| Termo | Língua | Pronúncia original | Aproximação PT | Notas |
```

Inclui: topónimos, termos culturais, gastronomia, figuras históricas, artistas, termos geológicos/científicos usados nos briefs.

### `altimetria.md` (número = próximo livre no bloco `0X`)
Estrutura fixa:
1. **Dados Gerais** — tabela por dia (distância, desnível, altitude máx, tempo)
2. **Leitura do Trilho (Fases)** — para cada dia/trekking de maior relevo: fases (início→meio→crux) com altitude, desnível, terreno, sensação psicológica do participante
3. **Metabolismo & Energia** — kcal, água, alimentação, ritmo crítico (horários)
4. **Comparação com viagens anteriores** — tabela comparando com Peña Ubiña / Pico / etc. (quando relevante)
5. **Estratégia de Grupo** — horários, paragens, comportamento no crux
6. **Atenção** — riscos específicos do terreno
7. **Pitch** — frase de arranque para o guia

### `media.md` (número = próximo livre no bloco `0X`; se precisar de mais do que um, cada um leva o seu próprio número sequencial — ex: `06-media.md`, `07-media-video.md`)
Galeria de imagens de referência — para o guia mostrar ao grupo antes ou durante cada tema, não é lida em voz alta. Estrutura real (usada no País Basco, `EXVBAS`):

```markdown
# Média | Imagens de referência
**Uso:** mostrar ao grupo antes ou durante cada tema · brief de referência indicado em cada entrada

---

## [Nome do grupo temático ou "Dia N — nome do dia"]

### Nome do item
![Alt text](URL da imagem — Wikimedia Commons Special:FilePath de preferência)
Legenda curta: o essencial em 1–2 frases (o que é, porque importa, dado concreto).
→ `NN-ficheiro-relacionado.md`

---
```

Regras:
- Uma entrada por imagem: título, imagem embutida, legenda de 1–2 frases, e uma seta `→` a apontar para o(s) brief(s) temático(s) a que a imagem serve de apoio.
- Agrupar por dia (`## Dia N — Nome`) ou por tema transversal (`## Identidade e Símbolos`, etc.), consoante o que fizer mais sentido para a viagem.
- Preferir imagens do Wikimedia Commons (licença CC ou domínio público) via `Special:FilePath/Nome_do_Ficheiro.jpg` — mais estável do que linkar a página de outros sites.
- Fechar sempre com uma nota de fontes/licenças no fim: `*Fontes: Wikimedia Commons (licença CC ou domínio público). Verificar licença individual antes de reprodução impressa.*`
- Este ficheiro **não é opcional** — se a viagem tem media de apoio (o que é o caso normal), o `media.md` deve ser criado juntamente com os outros ficheiros do bloco `0X`, não deixado para depois.

---

## Tipos de Briefs Temáticos (exemplos do que já existe)

| Tipo | Exemplos de temas |
|------|-------------------|
| **Cultural/histórico** | Lendas, figuras históricas, batalhas, fundações, arquitetura |
| **Etnográfico** | Brañas, transumância, pastoreio, ofícios tradicionais |
| **Natural** | Geologia, fauna, flora, vales glaciares, clima |
| **Operacional** | Briefing inicial, route details, avisos, altimetria |
| **Narrativo** | Mensagens-chave, síntese, fio condutor da viagem |

Cada brief deve ser **autónomo** — um guia pode lê-lo sem ler os outros.

---

## Fio Narrativo

Cada viagem tem uma **mensagem central** que atravessa todos os briefs. Deve ser identificada logo no `01-briefing-inicial.md` e ecoada nas "Mensagens para o Grupo" dos briefs temáticos.

Exemplos passados:
- **Peña Ubiña:** "Montanha que os locais respeitam — cada passo é camada de civilização"
- **Pico (Açores):** "8,4 km em vulcão — saem às 07:00, regressam antes do almoço"
- **Covadonga/Cantábrica:** densidade histórico-religiosa + natureza glaciar

---

## Língua e Estilo

- **Português europeu** (não brasileiro)
- Sem tutear excessivo — "vocês" por defeito, "vós" quando o registo sobe
- Frases curtas. Parágrafos de 3–5 linhas.
- Dados precisos: datas, altitudes, distâncias, nomes próprios verificados
- Fontes com link sempre que possível — credibilidade do guia depende disso
- Nunca inventar dados — se incerto, assinalar com `[verificar]`
- **Sem emojis, em lado nenhum do brief** — nem nos títulos, nem no corpo, nem nas linhas de links (Mapa/Meteo). Texto e markdown simples só.

---

## Sobre Fontes

O utilizador passa fontes em bruto (URLs, PDFs, ficheiros md, notas). Claude deve:
- Extrair factos verificáveis
- Citar a fonte no final do brief
- Incluir link direto quando disponível
- Cruzar fontes quando há conflito de datas/dados

---

## Histórico de Viagens

**Nota:** os nomes de ficheiro abaixo (`01-d1.md`, `99-altimetria.md`, etc.) são anteriores à convenção de numeração atual (secção "Regras de Numeração") e **não devem ser copiados**. Servem só de registo histórico de que viagens já foram feitas. Uma viagem nova segue sempre as regras de numeração de cima, mesmo que seja parecida com uma destas.

| Viagem | Código Borealis | Ficheiros de referência |
|--------|-----------------|------------------------|
| Peña Ubiña (Astúrias) | `TRKSAB300526` | `01-briefing-inicial.md`, `02-route-details.md`, `05-branas-cultura-pastoral.md`, `11-geologia.md`, `12-fauna.md`, `13-flora.md`, `14-tradições.md`, `15-vale-glaciar.md`, `16-mensagens-chave.md`, `99-altimetria-pico.md` |
| Montanha do Pico (Açores) | `TRKPIC020626` | `09-madalena.md`, `10-montanha-do-pico.md`, `99-altimetria-pico.md` |
| Cordilheira Cantábrica | — | `09-cordilheira-cantabrica.md`, `cantabrica-d6-lagos-de-covadonga.md` |
| **País Basco / Euskadi** | EXVBAS (2026) | `00-index.md`, `01-d1.md`, `02-d2.md`, `03-d3.md`, `04-d4.md`, `05-fonetica-euskera.md`, `99-altimetria.md` |
| **Cumes Ibéricos / Trevinca** | EXVTEI2301 (2026) | `00-index.md`, `01-briefing-inicial.md`, `02-route-details.md`, `03-altimetria.md`, `04-media.md`, `05-fonetica-galego-castelhano.md`, `10-d1.md`, `11-geologia-montes-trevinca.md`, `12-mina-valborraz.md`, `13-fauna-alta-montanha.md`, `20-d2.md`, `21-botanica-teixo.md`, `22-historia-teixadal.md`, `23-identidade-cultura-galega.md` |

---

## Viagem em Curso: País Basco · Euskadi

**Datas:** 25–28 Junho 2026  
**Base:** Bilbau (3 noites)  
**Programa:** [borealis.travel/viagens/pais-basco-euskadi](https://borealis.travel/viagens/pais-basco-euskadi/)  
**Fontes base:** PDFs EXVBAS2301 (4 dias, edição 2023) + website Borealis (dados 2026)

**Etapas:**
- D1 — Salto del Nervión (13km, médio baixo, 926m alt, 833m asc)
- D2 — Costa Flysch Deba–Zumaia + Guernica + San Juan de Gaztelugatxe (10km, médio baixo, 224m, 401m asc)
- D3 — Monte Txindoki / Serra de Aralar (11km, médio, 1292m, 1233m asc)
- D4 — City trekking Bilbau + Guggenheim + pintxos + regresso

**Fio narrativo:** O Nervión nasce no planalto (D1), o povo que vive entre montanha e oceano (D2–D3), a cidade que se reinventou com arte (D4).

**Ficheiros criados:**
- `00-index.md` — índice completo com todos os tópicos identificados
- `01-d1.md` a `04-d4.md` — resumos diários
- `05-fonetica-euskera.md` — pronúncia de todos os termos locais
- `99-altimetria.md` — a criar

**Nota:** Quando há conflito entre dados do PDF (edição 2023) e website (edição 2026), usar **sempre o website** para dados técnicos (distância, altitudes, dificuldade).
