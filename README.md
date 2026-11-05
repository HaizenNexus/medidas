# MATH — Grandezas e Medidas 🎮

> "A matemática está em tudo."

Jogo educativo arcade com dois minigames sobre grandezas e medidas.
Desenvolvido com HTML5, CSS3 e JavaScript puro — sem dependências externas.

---

## 🗂️ Estrutura de arquivos

```
math-game/
├── index.html              # Tela inicial
├── game1.html              # Minigame 1 — Chuva de Unidades
├── game2.html              # Minigame 2 — Corrida das Medidas
├── equipe.js               # ⚙️  Configuração da equipe (editar aqui)
│
├── css/
│   ├── main.css            # Estilos globais + tela inicial
│   ├── game1.css           # Estilos do Minigame 1
│   └── game2.css           # Estilos do Minigame 2
│
├── js/
│   ├── main.js             # Animações, modais e tela inicial
│   ├── audio.js            # Efeitos sonoros (Web Audio API)
│   ├── storage.js          # Recordes e progresso (LocalStorage)
│   ├── game1.js            # Lógica da Chuva de Unidades
│   └── game2.js            # Lógica da Corrida das Medidas
│
└── data/
    ├── questions.js        # Banco de perguntas e conversões
    └── units.js            # Unidades por categoria + missões
```

---

## ▶️ Como executar localmente

### Opção 1 — VS Code (recomendado)

1. Instale a extensão **Live Server** no VS Code.
2. Abra a pasta `math-game/` no VS Code.
3. Clique com o botão direito no `index.html` → **Open with Live Server**.
4. O jogo abrirá em `http://127.0.0.1:5500`.

### Opção 2 — Python

```bash
cd math-game
python -m http.server 8080
# Acesse: http://localhost:8080
```

### Opção 3 — Node.js (npx serve)

```bash
cd math-game
npx serve .
# Acesse a URL exibida no terminal
```

> ⚠️ **Não abra o `index.html` diretamente como arquivo** (`file://`).
> Abrir via servidor local evita restrições de CORS com os módulos JS.

---

## 🚀 Publicar na Vercel

### Método rápido (arrastar e soltar)

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. No painel, clique em **Add New → Project**.
3. Arraste a pasta `math-game/` para a área de upload.
4. Clique em **Deploy**. Pronto!

### Método via GitHub

1. Crie um repositório no GitHub e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "MATH Game inicial"
   git remote add origin https://github.com/SEU_USUARIO/math-game.git
   git push -u origin main
   ```

2. Na Vercel, importe o repositório GitHub.
3. Configurações de build:
   - **Framework Preset:** `Other`
   - **Build Command:** *(deixar em branco)*
   - **Output Directory:** `.` *(ponto — raiz do projeto)*
4. Clique em **Deploy**.

### Método via Vercel CLI

```bash
npm install -g vercel
cd math-game
vercel
# Siga as instruções no terminal
```

---

## ⚙️ Personalizar a equipe

Edite o arquivo `equipe.js` na raiz do projeto:

```js
const EQUIPE = {
  desenvolvedores: [
    { nome: "Pedro Henrique", papel: "Desenvolvedor" },
    // Adicione mais membros aqui
  ],
  orientador: {
    nome: "Prof. Maria Silva",
    titulo: "Professora de Matemática",
  },
  instituicao: {
    nome: "Escola Estadual João XXIII",
  },
  ano: "2025",
};
```

---

## ➕ Adicionar perguntas

Edite `data/questions.js`. Cada pergunta segue o formato:

```js
{
  question: "1 km equivale a quantos metros?",
  options: ["100 m", "1.000 m", "10.000 m"],  // 3 opções obrigatórias
  correct: "1.000 m",                           // deve estar em options
  category: "comprimento",
  difficulty: 1  // 1=fácil · 2=médio · 3=difícil
}
```

Categorias disponíveis: `comprimento`, `massa`, `capacidade`, `tempo`, `temperatura`, `area`, `volume`.

---

## ➕ Adicionar unidades (Minigame 1)

Edite `data/units.js`, na seção `UNITS`:

```js
comprimento: {
  label: "Comprimento",
  emoji: "📏",
  color: "#00d4ff",
  units: ["mm", "cm", "dm", "m", "dam", "hm", "km"],
},
```

---

## 🎮 Controles

| Ação | Chuva de Unidades | Corrida das Medidas |
|------|-------------------|---------------------|
| Jogar | Arrastar mouse/dedo | ← → ou swipe |
| Pausar | `P` ou `Esc` | `P` ou `Esc` |
| Mobile | Toque + arraste | Botões ◀ ▶ ou swipe |

---

## 🛠️ Tecnologias

- **HTML5 Canvas** — renderização dos jogos
- **CSS3** — animações, layout responsivo, dark mode
- **JavaScript ES6+** — lógica dos jogos (Vanilla, sem frameworks)
- **Web Audio API** — efeitos sonoros procedurais
- **LocalStorage** — persistência de recordes e estatísticas

---

## 📚 Conteúdo matemático

| Categoria | Exemplos de unidades |
|-----------|----------------------|
| Comprimento | mm, cm, m, km |
| Massa | g, kg, t |
| Capacidade | mL, L |
| Tempo | s, min, h, d |
| Temperatura | °C, °F, K |
| Área | cm², m², km² |
| Volume | cm³, m³, L |

---

*Projeto educativo · Grandezas e Medidas · Ensino Fundamental*
