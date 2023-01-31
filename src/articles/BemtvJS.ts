import { _ } from "bemtv";

const { template, route } = _`BemtvJS`();

route({
  title: "Diogo Neves | BemtvJS",
});

template`
article[
    h1[BemtvJS]
    
    p[
        Bemtv é o meu maior e mais recente projeto até agora, você pode acessar o repositório do projeto através deste link:
        
        a[href="https://github.com/diogoneves07/bemtvjs"  ~ https://github.com/diogoneves07/bemtvjs], espero que goste!

    ]

    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]
        ]
    ]
]`;
