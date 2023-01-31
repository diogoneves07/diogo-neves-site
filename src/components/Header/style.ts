import { css } from "./Header";

css`
  color: #ededed;

  header {
    padding: 10vh 0;
  }
  header > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-left: 20px;
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
    padding: 15px;
  }
  header > div > div > strong {
    font-size: 20px;
    cursor: help;
  }

  @keyframes anime-blockquote {
    0% {
      right: -300px;
    }
    100% {
      right: -0px;
    }
  }

  header > div > blockquote {
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(15, 0, 13);
    background: linear-gradient(
      -190deg,
      rgba(21, 0, 19, 1) 50%,
      rgba(0, 2, 22, 1) 50%
    );
    position: relative;
    animation: anime-blockquote cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s
      forwards;
  }

  .strange-shape {
    --height: 25px;
    clip-path: polygon(50% -100%, 20% 100%, 100% 100%);
    position: relative;
    bottom: var(--height);
    background: rgb(89, 25, 81);
    background: linear-gradient(
      90deg,
      rgba(89, 25, 81, 1) 28%,
      rgba(2, 10, 88, 1) 76%
    );
    height: var(--height);
    width: 100%;
  }
`;
