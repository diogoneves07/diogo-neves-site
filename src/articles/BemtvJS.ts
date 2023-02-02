import { _ } from "bemtv";

const { template, route } = _`BemtvJS`();

route({
  title: "Diogo Neves | BemtvJS",
});

template`
article[
    h1[BemtvJS]
    
    p[
        A BemtvJS é o meu projeto mais importante e recente. Foi um trabalho de longos meses e, sem dúvida, um projeto de altíssima dificuldade. Durante a construção da biblioteca, tive que tomar decisões de design para tornar a API do Bemtv fácil de usar. 
    ]

    p[Durante o processo de desenvolvimento, precisei criar: um algoritmo de reconciliação, um roteador SPA, uma linguagem de marcação própria (semelhante ao HTML), uma forma de usar CSS-IN-JS de forma integrada, lidar com eventos do DOM, e criar a documentação da API em português e inglês. Posso continuar listando várias outras coisas porque, sem dúvida, foi meu projeto mais desafiador e estou muito feliz com o resultado atual.]

    p[Acesse a Bemtv JS: a[href="https://github.com/diogoneves07/bemtvjs"  ~ https://github.com/diogoneves07/bemtvjs]]

    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]
        ]
    ]
]`;
