import { css } from "./Header";

css`
  color: #ededed;
  padding: 5px 0;

  header > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  header > div > div {
    background: rgb(28, 1, 25);
    background: linear-gradient(
      190deg,
      rgba(28, 1, 25, 1) 78%,
      rgba(3, 6, 40, 1) 76%
    );
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
  }
  header > div > div > strong {
    font-size: 20px;
    cursor: help;
  }

  @keyframes anime-blockquote {
    0% {
      clip-path: polygon(0% -100%, 50% 100%, 100% 0%);
    }
    100% {
      clip-path: polygon(0% -100%, 20% 100%, 100% 0%);
    }
  }

  .strange-shape {
    --height: 35px;
    clip-path: polygon(0% -100%, 20% 100%, 100% 0%);
    position: relative;
    bottom: -5px;
    background: rgb(89, 25, 81);
    background: linear-gradient(
      90deg,
      rgba(89, 25, 81, 1) 28%,
      rgba(2, 10, 88, 1) 76%
    );
    height: var(--height);
    width: 100%;
    animation: anime-blockquote cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s
      forwards;
  }
`;
1;
