# ☕ Código e Café — Portfolio Studio

Bem-vindo ao projeto **Código e Café**, um portfolio profissional construído com **React 18** e **Vite**.
Este projeto foi criado com fins educativos, demonstrando os principais conceitos do React moderno.

---

## 🚀 Requisitos

- **Node.js** v18 ou superior
- **npm** v9 ou superior

---

## 📦 Como instalar e correr

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento (abre em http://localhost:5173)
npm run dev

# 3. (Opcional) Criar build de produção na pasta dist/
npm run build

# 4. (Opcional) Pré-visualizar o build de produção
npm run preview
```

---

## 📂 Estrutura de pastas

```
codigo-e-cafe/
├── package.json              # Dependências e scripts
├── vite.config.js            # Configuração do Vite
├── index.html                # HTML raiz (carrega fontes e main.jsx)
└── src/
    ├── main.jsx              # Ponto de entrada React
    ├── App.jsx               # Componente raiz com todas as secções
    ├── index.css             # Reset, variáveis CSS e animações globais
    ├── hooks/
    │   └── useScrollReveal.js  # Custom hook (IntersectionObserver)
    └── components/
        ├── Navbar/           # Navegação sticky com menu hamburger
        ├── Hero/             # Secção principal em ecrã inteiro
        ├── Services/         # Cards de serviços
        ├── Portfolio/        # Grelha de projetos
        ├── Stats/            # Estatísticas com contador animado
        ├── Testimonials/     # Testemunhos de clientes
        └── Contact/          # Formulário e dados de contacto
```

---

## 🧠 Conceitos React utilizados

| Conceito             | Onde é usado                                                         |
|----------------------|----------------------------------------------------------------------|
| Componentes          | Cada secção é um componente isolado em `src/components/`             |
| Props                | Passagem de dados para componentes (ex.: `services`, `projects`)     |
| `useState`           | Estado de menus, formulários e flags                                 |
| `useEffect`          | Listeners de scroll, observers e cleanup                             |
| `useRef`             | Referências DOM para scroll suave e observers                        |
| Custom Hooks         | `useScrollReveal` é reutilizável em qualquer secção                   |
| `.map()`             | Renderização de listas (serviços, projetos, testemunhos)             |
| Event handling       | `onClick`, `onChange`, `onSubmit`                                    |
| IntersectionObserver | Animações on-scroll nativas — sem bibliotecas externas               |
| CSS Variables        | Theming centralizado em `:root` (muda tudo com 1 ficheiro)           |

---

## 🎨 Personalizar

- **Cores:** edita as variáveis em `src/index.css` (bloco `:root`)
- **Conteúdo:** os dados estão como arrays no topo de `src/App.jsx`
- **Fontes:** troca os links do Google Fonts em `index.html`

---

Feito com ☕ e React. Bom estudo!
