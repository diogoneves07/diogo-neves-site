import { _ } from "bemtv";

const { template, route } = _`BlowUpX`();

route({
  title: "Diogo Neves | O meu jogo",
});

template`
article[
    h1[BlowUpX | O meu jogo]
    
    p[
        Este foi o primeiro jogo que desenvolvi e foi muito especial porque usei minha própria biblioteca de animação  a

        a[href="https://github.com/diogoneves07/wide-smile"  ~ wide-smile]

        para desenvolvê-lo, você pode jogá-lo neste link: a[href="https://blow-up-x.vercel.app/" ~ https://blow-up-x.vercel.app/], espero que goste!
    ]

    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]
        ]
    ]
]`;
