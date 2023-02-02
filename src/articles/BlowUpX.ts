import { _ } from "bemtv";

const { template, route } = _`BlowUpX`();

route({
  title: "Diogo Neves | O meu jogo",
});

template`
article[
    h1[BlowUpX | O meu jogo]
    
    p[

        BlowUpX foi o meu primeiro jogo e, durante sua construção, eu utilizei minha própria biblioteca de animações(a[href="https://github.com/diogoneves07/wide-smile"  ~ wide-smile]), tornando-o especial. Ao longo do processo de desenvolvimento, eu aprendi a montar regras para a dinâmica do jogo, trabalhar com animações após eventos específicos do usuário, e lidar com a responsividade para tornar o jogo jogável em qualquer dispositivo. Esse projeto também exigiu que eu mostrasse minha criatividade, pois queria fazer algo simples, mas inovador. Fiquei feliz com o resultado.
    ]

    p[
        Você pode jogá-lo neste link: a[href="https://blow-up-x.vercel.app/" ~ https://blow-up-x.vercel.app/], espero que goste!
    ]

    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]
        ]
    ]
]`;
