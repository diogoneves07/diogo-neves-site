import { _ } from "bemtv";

const { template, route } = _`BomLinguagemFavorita`();

route({
  title: "Diogo Neves | O quão bom você é na sua linguagem favorita?",
});

template`
article[
    h1[O quão bom você é na sua linguagem favorita?]
    
    p[
      Nos últimos anos aprofundei meus conhecimentos em JavaScript e recentemente me surgiu uma dúvida: Como saber se sou realmente bom em JavaScript? 
    ]

    p[
      A questão não é se sou um bom desenvolvedor ou programador, mas até onde cheguei em uma determinada linguagem.
    ]

    h2[A resposta...]

    p[A resposta para isso é “depende”, depende do seu parâmetro de comparação, porque ele vai determinar o que você considera “bom”.]

    p[No entanto, podemos usar uma analogia e comparar o aprendizado de uma linguagem de programação com o aprendizado de uma idioma falado.]

    p[O sonho de todo estudante de idiomas é pronunciar e conhecer as palavras de um determinado idioma como os falantes nativos, no entanto, nem mesmo os falantes nativos conhecem todas as palavras ou todas as maneiras pelas quais uma frase pode ser montada.] 

    p[Mas na maioria das vezes que um falante nativo ouve ou lê palavras em seu idioma, ele as reconhece rapidamente, mesmo sem saber o que elas realmente significam.]

    p[Voltando ao mundo das linguagens de programação, acredito que um programador alcançou um bom nível ou “nativo” em uma determinada linguagem sempre que, ao ver algo novo nessa linguagem, não se sente “confuso” ou “perdido”, ou seja, mesmo que não saiba exatamente o que está acontecendo, você deve ter uma noção básica e se sentir confortável.]

    h2[Conclusão]

    p[Atualmente, gosto de pensar assim porque simplesmente não é necessário definir níveis.] 

    p[Nós podemos testar esse raciocínio ao olhar para um bloco de código em uma linguagem desconhecida e depois olhar para outro na nossa linguagem favorita, obviamente suas habilidades podem fazer você compreender os dois códigos, mas ao olhar para um bloco de código em uma linguagem desconhecida parecerá que você não está falando em seu idioma nativo, mas sim em um outro idioma.]


    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]
        ]
    ]
]`;
