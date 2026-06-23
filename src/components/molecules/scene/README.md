# Cena 3D do hero (`scene/`)

Animação WebGL (Three.js) de fundo da landing: um bote à noite, com um remador
programando, sobre o mar enluarado e um céu estrelado com meteoros. É puramente
decorativa — montada no cliente e **pulada sob `navigator.webdriver`** (por isso
os testes de visual-regression não a renderizam).

## Como tudo se conecta

`mountPortfolioScene` (em `index.ts`) é o **compositor**: cria renderer, cena e
câmera, instancia cada elemento, e roda o loop de animação (`requestAnimationFrame`).
Cada elemento é um módulo isolado que devolve `{ object, update, dispose }`.

```
index.ts ............ compositor: renderer + cena + câmera + loop + cleanup
  quality.ts ........ detecta o "tier" do device → resolução, nº de estrelas, pós-processamento
  director.ts ....... câmera: scroll suave (Lenis) + keyframes + balanço ocioso
  post.ts ........... pós-processamento (bloom + vinheta); ignorado no tier baixo
  waves.ts .......... FONTE ÚNICA do campo de ondas (GLSL p/ a água + JS p/ o barco)
  water.ts .......... plano de água: shader com ondas, reflexo do céu e luar
  boat.ts ........... bote: boia/inclina seguindo as ondas reais de waves.ts
    hullGeometry.ts . malha paramétrica do casco e do assoalho
    person.ts ....... remador (ossos + juntas) com notebook que emite luz
  moon.ts ........... Lua procedural (relevo via shader) + halo + luz direcional
  starfield.ts ...... estrelas (pontos) com cintilação
  meteors.ts ........ estrelas cadentes (pool reaproveitado)
  thoughtBubble.ts .. balão "programando..." (sprite com canvas)
```

Regra de ouro: o barco precisa seguir **exatamente** a mesma água que o shader
desenha. Por isso `waves.ts` define o campo de ondas uma vez; o shader usa o
GLSL exportado e o barco usa o espelho em JS (`sampleWaveHeight`). Ao mexer numa
onda, ajuste os **dois lados** (são duas linguagens, não dá para compartilhar código).

## Padrão de cada módulo

Toda função `create*` devolve um objeto com:
- `object` / `mesh` — o que entra na cena (`scene.add(...)`).
- `update(time)` — chamado a cada frame (anima); alguns módulos estáticos não têm.
- `dispose()` — libera geometrias/materiais/texturas ao desmontar.

## Glossário (termos que aparecem no código)

**Three.js / 3D**
- **Uniform** — valor enviado do JS para o shader (ex.: `uTime`). O prefixo `u`
  sinaliza "vem do JS". A chave no dict `uniforms` precisa ter o mesmo nome do
  `uniform` declarado no GLSL.
- **Shader (vertex / fragment)** — programinha que roda na GPU. O *vertex* roda
  por vértice (posiciona); o *fragment* roda por pixel (calcula a cor).
- **Varying** — valor que o vertex shader passa para o fragment (interpolado).
- **Normal** — vetor perpendicular à superfície; define como a luz reflete.
- **Geometry / Material / Mesh** — forma + aparência + (forma+aparência) na cena.
- **Sprite** — imagem 2D que sempre encara a câmera (usado no balão e no halo).
- **PRNG com seed** — gerador pseudo-aleatório determinístico: mesmo céu a cada load.

**Efeitos**
- **Bloom** — brilho que "vaza" de áreas claras (tela do notebook, Lua, estrelas).
- **Fresnel** — superfícies refletem mais quando vistas de raspão (água rasante
  reflete o céu; a pino mostra a água funda).
- **Gerstner / value noise / Voronoi / fbm** — funções de ruído. Ondas = soma de
  senos (Gerstner); relevo da Lua = ruído fractal (fbm) + crateras (Voronoi).

**Náutico (barco)**
- **Hull (casco)** / **sole (assoalho)** — corpo externo / piso interno do bote.
- **Beam** — largura. **Bow/stern** — proa/popa. **Port/starboard** — bombordo/boreste.
- **Freeboard (borda livre)** — quanto a borda fica acima da linha de água.
- **Sheer** — a borda sobe nas pontas (proa/popa mais altas que o meio).
- **Heading** — para onde o barco aponta (aqui 60°, para a vista em 3/4).
