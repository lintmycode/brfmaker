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

| Intervalo | Conteúdo | Exemplo |
|-----------|----------|---------|
| `00` | `00-index.md` | **Fixo.** Índice de todos os ficheiros. |
| `01–09` | Briefings **gerais** — identidade, língua, cultura, política, transversal a vários dias | `06-pais-basco.md` |
| `N0` | **Resumo do Dia N** — sempre o ficheiro `X0-dN.md` | `10-d1.md`, `20-d2.md`, `30-d3.md`, `40-d4.md` |
| `N1–N9` | **Temáticos do Dia N** — sem prefixo de dia no nome | `11-salto-del-nervion.md`, `21-flysch-geologia.md` |
| `90` | `90-altimetria.md` | **Fixo.** Análise de terreno + dados técnicos de todos os trekings. |
| `91–99` | **Anexos** — media, imagens, referências visuais, materiais de apoio | `91-media.md` |

**Regras de nome de ficheiro:**
- Formato: `NN-nome-curto-com-hifens.md` (lowercase, sem acentos)
- O prefixo `dN` aparece **apenas** no resumo do dia: `10-d1.md`, `20-d2.md`, etc.
- Os temáticos do dia **não** levam prefixo de dia: `11-salto-del-nervion.md` e não `11-d1-salto.md`
- Briefings gerais (01–09) não levam prefixo de dia

**Exemplo completo para viagem de 4 dias:**
```
00-index.md
01-briefing-inicial.md
02–09  → gerais (língua, cultura, ícones, política, fonética, GoT, etc.)
10-d1.md          ← resumo Dia 1
11-primeiro-tema-d1.md
12-segundo-tema-d1.md
...
20-d2.md          ← resumo Dia 2
21-primeiro-tema-d2.md
...
30-d3.md
40-d4.md
90-altimetria.md  ← fixo
91-media.md       ← anexos (imagens, referências visuais)
92–99             ← outros anexos
```

---

## Formato de Cada Ficheiro

### Cabeçalho
```
# Tema Principal | Subtítulo Descritivo
D2 · Local, Província
```
A segunda linha é o contexto de dia e local — sem prefixo `**Dia:**`, sem bold. Texto simples.

### Corpo
- Secções com `###` (nunca `##` como primeiro nível de conteúdo)
- Texto corrido por defeito — bullets apenas quando a informação é genuinamente listável
- Linguagem densa, direta, sem floreados académicos
- Tom de guia: informado, apaixonado, no terreno
- Separadores `---` entre secções

### Comprimento e ritmo — regra de bolso
Os briefs são para consulta rápida em campo, não para leitura sentado. Regras:
- **Parágrafos curtos** — máx. 3–4 linhas. Cortar impiedosamente.
- **Factos, não desenvolvimento** — datas, medidas, nomes, causa-efeito. Sem contextualização redundante.
- **Sem frases de arranque vazias** — nunca começar secção com "X é um/uma..." se o título já diz o que é.
- **Comprimento alvo por brief temático:** 250–400 palavras. Os resumos de dia (X0-dN.md) podem ir até 500.
- Se a informação couber numa linha, não ocupa um parágrafo.

### Elementos Recorrentes
- **"Para o Grupo"** ou **"Mensagem"** — caixa no final com frase para dizer em voz alta aos participantes. Em itálico ou bloco destacado.
- **"Se perguntarem"** — secção opcional, mas obrigatória em temas de história, arte, política e ciência. O guia é especialista em montanha, não em arte ou história. Esta secção dá-lhe contexto de apoio para responder a perguntas do grupo sem ser apanhado de surpresa. Formato: perguntas prováveis + resposta curta. Exemplo:
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

### Para o Grupo
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
2. **O que é esta viagem** — síntese da viagem e gestão de expectativas (o que é e o que não é); incluir meteo esperada
3. **Regras de segurança** — ver texto padrão abaixo; adaptar só se o formato da viagem for diferente
4. **Regras de protecção ambiental** — ver texto padrão abaixo; substituir portaria/lei pela do país
5. **O fio da viagem** — narrativa central, pitch de saída

Tom: caloroso mas claro. A secção da equipa é sempre um placeholder — o guia apresenta-se ao vivo.

**Texto padrão — Regras de segurança:**
```
**Durante a caminhada:**
- Mantenham-se sempre atrás do guia da frente e à frente do fecho de grupo.
- Usem bastões nas zonas de maior inclinação — avancem com calma e sem pressas.
- Em cruzamentos ou troços de difícil navegação, aguardem indicações da equipa.
- Há uma média de 1 guia por 10 pessoas — cada participante caminha ao seu ritmo.
  É natural que o grupo se divida em subgrupos.

**Emergências:**
- A equipa tem kits de primeiros socorros completos e comunicações activas.
- Em caso de mal-estar, lesão ou qualquer situação fora do normal, avisem de imediato
  o membro mais próximo da equipa.
- Se se afastarem do grupo: parem, fiquem visíveis, esperem pelo próximo monitor —
  nunca tentem reorientar-se sozinhos.
```

**Texto padrão — Regras de protecção ambiental** (Portaria 651/2009 para ES; substituir por lei local noutros países):
```
*(Portaria 651/2009)*

> "Na montanha, deixamos pegadas e levamos recordações."

- **Nada de lixo** — incluindo cascas de fruta, lenços de papel ou restos biodegradáveis.
- **Manter o trilho** — o pisoteio fora do percurso afecta a regeneração da flora e o solo.
- **Não colher plantas nem souvenirs naturais** — uma flor tirada é uma beleza perdida para os próximos.
- **Respeitar a vida selvagem** — observar com os olhos, sem perturbar nem alimentar.
```

### `01-dN.md` — Resumos Diários (ex: `01-d1.md`, `02-d2.md`)
Estrutura para mini-briefings de resumo de cada dia (um por dia de viagem):
1. **Cabeçalho técnico** — Data, dificuldade (N/5), distância (km), altitude máx (m), acumulado ascendente (m), regime alimentar, dormida
2. **O que é este dia** — Parágrafo de síntese: o que o grupo vai viver, o momento central, o porquê de este dia importar
3. **Localização** — Link Google Maps + link Meteoblue para o **local principal do dia** (o ponto mais representativo do dia — cume, cascata, praça, ermida, etc.; se o dia tiver vários locais, escolher o de maior relevância física/narrativa, não necessariamente o último visitado). Vai logo a seguir ao "O que é este dia", ainda no cabeçalho do ficheiro. Formato:
   ```
   **Localização:** [🗺️ Mapa](https://www.google.com/maps/search/?api=1&query=NOME+DO+LOCAL) · [🌦️ Meteo](URL_METEOBLUE)
   ```
   - URL Google Maps: usar sempre o formato de pesquisa acima (`query=` com o nome do local, `+` em vez de espaços, URL-encoded se tiver acentos) — não usar coordenadas a não ser que o local não tenha nome pesquisável.
   - URL Meteoblue: procurar a página existente do local (ou da povoação mais próxima, se o local exacto não tiver página própria) em `meteoblue.com/en/weather/week/NOME-LOCAL_PAIS_GEONAMEID` — confirmar sempre que o link resolve antes de o incluir.
4. **Contexto geográfico e cultural** — Onde estamos, que território, que identidade
5. **Pontos de interesse no trilho** — Lista densa de sítios, elementos naturais ou culturais com os dados essenciais
6. **Fio narrativo do dia** — Como este dia se encaixa na narrativa maior da viagem
7. **Mensagem para o grupo** — Frase para dizer em voz alta (em caixa destacada)
8. **Fontes** — Links relevantes

Estes ficheiros são numerados sequencialmente (01, 02, 03, 04...) e criados um por dia de viagem. São o esqueleto de cada etapa — os briefs temáticos expandem cada ponto.

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

### `91-media.md` — Imagens de referência
Ficheiro de imagens para mostrar ao grupo em campo. Uma secção por dia/tema, uma imagem por entrada.

Estrutura de cada entrada:
```markdown
### Nome do tema
![Alt text](URL_DIRECTO)
Legenda curta: o que se vê, dado chave, contexto.
→ `XX-ficheiro-relacionado.md`
```

**URLs de imagens — regra obrigatória:**
Usar sempre URLs directos `upload.wikimedia.org`, nunca `Special:FilePath` (redirects podem não funcionar em renderers offline).

Fórmula para construir o URL a partir do nome do ficheiro Commons:
```python
import hashlib
f = "Nome_do_ficheiro.jpg"
h = hashlib.md5(f.encode()).hexdigest()
url = f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{f}"
```

Imagens com copyright (ex: obras de arte com autor morto há menos de 70 anos): usar URL directo da Wikipedia e adicionar nota `© Autor — uso educativo`.

### `90-altimetria.md`
Estrutura fixa:
1. **Dados Gerais** — tabela por dia (distância, desnível, altitude máx, tempo)
2. **Leitura do Trilho (Fases)** — para cada dia/trekking de maior relevo: fases (início→meio→crux) com altitude, desnível, terreno, sensação psicológica do participante
3. **Metabolismo & Energia** — kcal, água, alimentação, ritmo crítico (horários)
4. **Comparação com viagens anteriores** — tabela comparando com Peña Ubiña / Pico / etc. (quando relevante)
5. **Estratégia de Grupo** — horários, paragens, comportamento no crux
6. **Atenção** — riscos específicos do terreno
7. **Pitch** — frase de arranque para o guia

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

---

## Sobre Fontes

O utilizador passa fontes em bruto (URLs, PDFs, ficheiros md, notas). Claude deve:
- Extrair factos verificáveis
- Citar a fonte no final do brief
- Incluir link direto quando disponível
- Cruzar fontes quando há conflito de datas/dados

---

## Histórico de Viagens

| Viagem | Código Borealis | Ficheiros de referência |
|--------|-----------------|------------------------|
| Peña Ubiña (Astúrias) | `TRKSAB300526` | `01-briefing-inicial.md`, `02-route-details.md`, `05-branas-cultura-pastoral.md`, `11-geologia.md`, `12-fauna.md`, `13-flora.md`, `14-tradições.md`, `15-vale-glaciar.md`, `16-mensagens-chave.md`, `99-altimetria-pico.md` |
| Montanha do Pico (Açores) | `TRKPIC020626` | `09-madalena.md`, `10-montanha-do-pico.md`, `99-altimetria-pico.md` |
| Cordilheira Cantábrica | — | `09-cordilheira-cantabrica.md`, `cantabrica-d6-lagos-de-covadonga.md` |
| **País Basco / Euskadi** | EXVBAS (2026) | `00-index.md`, `01-d1.md`, `02-d2.md`, `03-d3.md`, `04-d4.md`, `05-fonetica-euskera.md`, `99-altimetria.md` |

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
