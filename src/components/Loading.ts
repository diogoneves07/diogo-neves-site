import { _ } from "bemtv";

const firstMessage = "Por favor, aguarde...";

const { css, onMount, $, keepInst, template } = _`Loading`({
  message: firstMessage,
});

onMount(() => {
  setTimeout(
    keepInst(() => {
      $.message =
        "O carregamento está demorando muito, recarregue a página ou verifique sua conexão.";
      setTimeout(
        keepInst(() => {
          $.message = firstMessage;
        }),
        5000
      );
    }),
    30000
  );
});

css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 20px;
`;

template`div[strong[$message]]`;
