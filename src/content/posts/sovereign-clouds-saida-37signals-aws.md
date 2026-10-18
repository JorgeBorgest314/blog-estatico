---
title: "Sovereign Clouds: como a 37signals saiu da AWS"
subtitle: "8 petabytes para tirar do lugar, 20 servidores comprados à vista e um contrato de quatro anos que segurou a saída até 2025"
description: "O DHH documentou a saída da AWS em 16 posts, de outubro de 2022 a março de 2025. Reconstruí a linha do tempo: as saídas avaliadas, o hardware, o contrato e o retorno real da migração."
pubDatetime: 2026-10-18T09:00:00-03:00
category: computacao
tags:
  - aws
  - s3
  - cloud
  - on-premise
  - custos
  - compliance
series: Sovereign Clouds
seriesOrder: 1
versions:
  - version: 1
    date: 2026-10-18
    note: "Primeira versão, a partir da palestra no Guru-SP"
timeline:
  title: "Os 16 posts, de 19/10/2022 a 26/03/2025"
  caption: "Os quatro marcos numerados são os posts que estruturam a história. O aperto no começo de 2023 é real: cinco posts em nove semanas."
  events:
    - date: 2022-10-19
      title: "Por que estamos saindo da nuvem"
      url: "https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0"
      highlight: true
    - date: 2023-01-10
      title: "A única coisa pior que o preço da nuvem são as alternativas empresariais"
      url: "https://world.hey.com/dhh/the-only-thing-worse-than-cloud-pricing-is-the-enterprisey-alternatives-854e98f3"
    - date: 2023-02-21
      title: "Podemos economizar US$ 7 milhões em cinco anos com a saída da nuvem"
      url: "https://world.hey.com/dhh/we-stand-to-save-7m-over-five-years-from-our-cloud-exit-53996caa"
      highlight: true
    - date: 2023-02-22
      title: "Cinco valores que guiam nossa saída da nuvem"
      url: "https://world.hey.com/dhh/five-values-guiding-our-cloud-exit-638add47"
    - date: 2023-02-27
      title: "Não se deixe enganar pelo serverless"
      url: "https://world.hey.com/dhh/don-t-be-fooled-by-serverless-776cd730"
    - date: 2023-03-23
      title: "Corte a nuvem antes da folha de pagamento"
      url: "https://world.hey.com/dhh/cut-cloud-before-payroll-a4530ebd"
    - date: 2023-04-06
      title: "O hardware de que precisávamos para a saída da nuvem chegou"
      url: "https://world.hey.com/dhh/the-hardware-we-need-for-our-cloud-exit-has-arrived-99d66966"
      highlight: true
    - date: 2023-05-02
      title: "A saída da nuvem também compensa em desempenho"
      url: "https://world.hey.com/dhh/cloud-exit-pays-off-in-performance-too-4c53b697"
    - date: 2023-05-03
      title: "Sovereign clouds"
      url: "https://world.hey.com/dhh/sovereign-clouds-661eb5e4"
    - date: 2023-06-23
      title: "Nós saímos da nuvem"
      url: "https://world.hey.com/dhh/we-have-left-the-cloud-251760fb"
    - date: 2023-09-15
      title: "A saída da nuvem já rendeu US$ 1 milhão por ano"
      url: "https://world.hey.com/dhh/our-cloud-exit-has-already-yielded-1m-year-in-savings-db358dea"
    - date: 2023-12-19
      title: "Perguntas frequentes sobre a saída da nuvem"
      url: "https://world.hey.com/dhh/the-big-cloud-exit-faq-20274010"
    - date: 2024-01-07
      title: "Mantendo as luzes acesas enquanto saímos da nuvem"
      url: "https://world.hey.com/dhh/keeping-the-lights-on-while-leaving-the-cloud-be7c2d67"
    - date: 2024-10-17
      title: "Nossa economia com a saída da nuvem vai passar de dez milhões em cinco anos"
      url: "https://world.hey.com/dhh/our-cloud-exit-savings-will-now-top-ten-million-over-five-years-c7d9b5bd"
    - date: 2025-02-07
      title: "Servidores podem durar muito tempo"
      url: "https://world.hey.com/dhh/servers-can-last-a-long-time-165c955c"
    - date: 2025-03-26
      title: "São cinco mil dólares por dia para perder a saída do S3"
      url: "https://world.hey.com/dhh/it-s-five-grand-a-day-to-miss-our-s3-exit-b8293563"
      highlight: true
video:
  youtube: "https://youtu.be/AREZ8MfABpY?t=11155"
  title: "A palestra no 71º encontro do Guru-SP (set/2025)"
draft: false
wip: true
featured: true
---

Em 1º de abril de 2008, Mark Imbriaco publicou no Signal v. Noise um post curto sobre a conta da AWS da 37signals. Quando ele entrou na empresa, em outubro de 2006, todas as aplicações juntas ocupavam menos de 1,5 TB, e redundância e backup já estavam virando dor de cabeça. Resolveram testar o S3 no Campfire e, nas palavras dele, viraram crentes rapidinho. A última fatura tinha vindo em **US$ 2.004,12**.

Dezessete anos depois, em julho de 2025, David Heinemeier Hansson publicou um gráfico de custo diário do S3 despencando até zero, com a legenda: _"What a beautiful cliff"_.

Entre esses dois pontos há 8 petabytes de arquivos replicados em várias regiões, um pico de US$ 3,7 milhões por ano de nuvem, 20 servidores Dell comprados à vista, um contrato de quatro anos que funcionou como coleira e — pelas contas do próprio DHH — mais de dez milhões de dólares desperdiçados no caminho.

Este post é a reconstrução dessa linha do tempo, a conta refeita, o erro que eu cometi ao refazê-la, e a parte da história que não é sobre dinheiro.

## O ponto de partida: eu não acreditei

Trabalho com AWS há pouco mais de um ano. S3 é a base de tudo: qualquer serviço que você usa na AWS acaba encostando nele. E o custo do S3, se você deixar passar, cresce sem avisar.

Então quando li que alguém tinha zerado a conta do S3 em questão de dias, achei que era marketing. Fui atrás dos posts para entender o truque. Não havia truque — havia três anos de processo documentado em 16 posts, de outubro de 2022 a março de 2025.

Juntei esses 16 posts, mais 13 blogs, 3 podcasts e um punhado de especificações de hardware. Deu 430 KB de anotações em 14 dias. Vale o aviso: a fonte primária é o DHH, e o DHH tem lado. Ele chama a nuvem de _"a farm from the big tech cloud lords"_. Os comentários no LinkedIn e no X, e as respostas que ele teve que dar, mostram que o debate é bem menos limpo que os posts sugerem.

<div data-timeline></div>

## As três saídas

Quando uma conta de nuvem fica grande demais, existem três caminhos. A história inteira da 37signals é a história dos três, em ordem.

### Saída 1 — Otimizar

É o primeiro reflexo, e é legítimo. Na AWS, o mesmo resultado tem N caminhos com N preços diferentes.

O exemplo mais direto é região. Trabalho bastante com AWS Glue, o serviço de processamento de dados em Python sobre arquivos do S3. Em São Paulo, o DPU-hora custa US$ 0,69. Na Virgínia do Norte, US$ 0,44 — **25% a menos pelo mesmo processamento**, só mudando o data center. Quando a rotina roda por horas, isso vira dinheiro de verdade.

No S3 a lógica se repete nas classes de armazenamento. Arquivo que ninguém lê há seis meses não precisa estar em Standard. Mas se você não sabe que a classe existe, paga o preço cheio por anos.

Vale registrar uma coisa que descobri visitando a comunidade da AWS na Equinix, no centro de São Paulo: a AWS não é dona dos data centers que usa aqui. Ela opera em instalações de terceiros. Em termos práticos, a nuvem é também um marketplace de data centers com uma plataforma em cima.

A 37signals otimizou. Estava na nuvem desde 2008 — tinha maturidade para isso. Não foi suficiente.

### Saída 2 — Assinar um contrato longo

A AWS oferece compromissos de 3 ou 4 anos com descontos que chegam a 70%. É um desconto real, e é por isso que a armadilha funciona.

A 37signals assinou em 2021 um contrato de quatro anos para o S3, válido até 2025. Baratearam muito o armazenamento dos 8 petabytes. E, com isso, amarraram a própria saída: quando decidiram deixar a nuvem, em 2022, **todos os outros serviços podiam migrar, o S3 não**. O contrato ia até 2025, e até 2025 o S3 ficou lá, gerando custo.

Esse é o detalhe que normalmente some das manchetes: a saída da nuvem terminou em 2023 para quase tudo, e só em julho de 2025 para o armazenamento — por contrato, não por dificuldade técnica. Em fevereiro de 2023 o próprio DHH escrevia que resolveria o S3 "em 2024". Escorregou um ano e meio.

E não saiu barato. Em outubro de 2025, olhando para trás, ele quantificou a espera: além dos mais de dez milhões gastos com nuvem entre 2018 e 2023, foram **"alguns milhões a mais enquanto esperávamos o compromisso de quatro anos do S3 expirar"**. O desconto de 70% foi cobrado com juros.

### Saída 3 — Sair

Foi a escolhida. E aqui começam os números.

## A conta

A curva de gasto tem um ponto de inflexão claro, e ele é anterior à história que normalmente se conta. Em 2018 a 37signals decidiu ir com tudo para a nuvem — nas palavras do DHH, _"back when we still believed the marketing that it was going to be easier and cheaper to do"_. O gasto **atingiu o pico em 2021: US$ 3,7 milhões**. Quando o primeiro post sobre a saída foi publicado, em 2022, a conta já estava descendo — US$ 3,2 milhões.

O ponto de partida público é o post de 19 de outubro de 2022, [_Why we're leaving the cloud_](https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0). O argumento central:

> "Renting computers is (mostly) a bad deal for medium-sized companies like ours with stable growth."

E a analogia que ficou:

> "It's like paying a quarter of your house's value for earthquake insurance when you don't live anywhere near a fault line."

O DHH reconhece dois cenários em que a nuvem é a resposta certa: aplicação pequena começando do zero, sem clientes; e carga muito irregular — o e-commerce que precisa escalar na Black Friday e fica ocioso em março. Fora disso, o argumento dele é que você está pagando um seguro contra um terremoto que não acontece na sua região.

O gasto de 2022, aberto por serviço:

| Item                                 | Valor (2022)       |
| ------------------------------------ | ------------------ |
| S3                                   | ~US$ 0,9 Mi        |
| Demais serviços (EC2, RDS, ES, EKS…) | ~US$ 2,3 Mi        |
| **Total**                            | **US$ 3,2 Mi/ano** |

Só RDS e Elasticsearch somavam meio milhão de dólares por ano. E o S3, que é "só guardar arquivo", representava 28% da conta — justamente a parte presa no contrato.

Para calibrar a escala do outro lado do balcão: no trimestre em que esse post saiu, a AWS faturou US$ 18 bilhões. No segundo trimestre de 2025, US$ 30,9 bilhões.

## O que foi comprado

Em 6 de abril de 2023, o hardware chegou: **20 servidores Dell PowerEdge R7625, US$ 600 mil no total** — escolhidos depois de muito benchmark, pelos chips AMD Zen 4 combinados com NVMe Gen 4.

| Especificação | Total                                   |
| ------------- | --------------------------------------- |
| Processadores | 2 por servidor, 48 cores cada, 2,75 GHz |
| vCPU          | ~3.840                                  |
| RAM           | 7.680 GB                                |
| Armazenamento | 384 TB NVMe Gen 4                       |

Duas observações que mudam a leitura desse número.

A primeira é que **US$ 600 mil em máquina física é menos do que a empresa pagava por ano em serviço alugado** — e a máquina alugada nunca foi dela.

A segunda é que ninguém compra um data center. Essa pergunta apareceu tanto que virou item do FAQ, e o DHH respondeu com visível irritação. Você aluga espaço em rack num data center de terceiros e contrata uma empresa de _white glove_ para instalar. No caso, a Deft — hoje Summit. Os servidores foram instalados em dois data centers, Chicago e Virgínia, e a equipe da 37signals nunca precisou pôr o pé lá: o hardware sobe, responde ping, e a configuração é remota.

Esse serviço custa **US$ 720 mil por ano** — US$ 60 mil por mês por oito racks dedicados entre os dois data centers. É a linha que some quando alguém compara "nuvem versus servidor próprio" olhando só o preço da máquina.

Aqui vale um detalhe que muda a conta e que raramente é citado: **esses racks já existiam e já eram pagos**. A 37signals tinha superdimensionado o espaço de propósito, então os 20 servidores novos couberam na estrutura existente, sem contratar mais espaço nem mais energia. O custo de colocation não subiu por causa da migração.

Os US$ 600 mil de hardware também não entram de uma vez: são amortizados em cinco anos, US$ 120 mil por ano. E o DHH observa que tinha máquinas rodando havia sete anos — amortizar em cinco é conservador.

Somando: **US$ 840 mil por ano** com tudo — máquinas amortizadas, energia e banda — contra US$ 2,3 milhões de nuvem. Com mais cores, NVMe muito mais barato e espaço para crescer. E, segundo ele, **sem aumentar o time de operações**.

## A conta refeita

Somando ano a ano o que deixou de ser gasto:

| Ano                 | Economia          |
| ------------------- | ----------------- |
| 2023                | US$ 1,458 Mi      |
| 2024                | US$ 1,458 Mi      |
| 2025                | US$ 1,909 Mi      |
| 2026                | US$ 2,360 Mi      |
| 2027                | US$ 2,360 Mi      |
| **Total em 5 anos** | **US$ 9.545.000** |

O salto de 2025 é a saída do S3 em julho, quando o contrato finalmente venceu: meio ano a menos de armazenamento alugado, US$ 451 mil.

O título do post de fevereiro de 2023 era _We stand to save $7m over five years_. **Minha projeção deu US$ 9,5 milhões.** Fiz a primeira leitura sem olhar com atenção para os custos e só encontrei essa diferença na segunda passada, montando a tabela.

E a diferença parecia ter respaldo: em 17 de outubro de 2024, o post seguinte do DHH se chamava _Our cloud-exit savings will now top ten million over five years_. Minha conta ficava confortavelmente entre os 7 milhões anunciados e os 10 revisados.

Só que projeção não é resultado.

## O que aconteceu de verdade

Em **15 de abril de 2026**, com a migração concluída e a poeira assentada, o DHH publicou no LinkedIn o fechamento — e é o número que importa:

> "In 2023, we spent $3,934,099 on AWS + other hosting. In 2026, our hosting + support bill is down to ~$1m/year due to the cloud exit. Even including all the hardware buying, we will already have saved ~$4m by the end of this year. And going forward, it's ~$3m/yr in savings."

Três coisas saltam dessa frase.

**O gasto de 2023 foi US$ 3,93 milhões, não US$ 3,2 milhões.** Maior que o de 2022. Durante a transição se paga pelos dois mundos ao mesmo tempo: a nuvem que ainda não foi desligada e o hardware que acabou de chegar. Nenhuma das projeções, nem a dele nem a minha, tinha esse pico.

**A conta hoje é de ~US$ 1 milhão por ano.** De quase 4 milhões para 1 milhão, com mais cores e armazenamento mais rápido.

**A economia acumulada até o fim de 2026 é de ~US$ 4 milhões**, com um ritmo de ~US$ 3 milhões por ano daqui em diante.

Fazendo a conta na mesma janela de cinco anos que todo mundo usou: ~US$ 4 milhões até 2026, mais ~US$ 3 milhões em 2027, dá **cerca de US$ 7 milhões** — exatamente o número que ele tinha anunciado em fevereiro de 2023, antes de comprar o primeiro servidor.

Ou seja: **a projeção original estava certa, a revisão de 2024 estava otimista, e a minha também.** Eu somei economias anuais sem descontar o custo de conviver com as duas infraestruturas durante a transição. O DHH acertou na primeira tentativa e errou quando ficou animado.

Fica a lição, que vale para qualquer migração: o ano da transição é o ano mais caro, e é o que some das planilhas.

## O S3 e os US$ 5 mil por dia

O último ato foi o mais apertado. Em março de 2025, o post _It's five grand a day to miss our S3 exit_ explicava a corrida: ainda faltavam quase 6 petabytes para mover, e a AWS havia aberto uma janela de **60 dias de transferência de saída gratuita**.

Historicamente, tirar dados da AWS custava centenas de milhares de dólares — o famoso custo de egress, que é o que transforma armazenamento barato em fidelidade cara. A gratuidade para quem está saindo virou política em 2024, por pressão regulatória. Mas a janela tem prazo. Perder o prazo significava voltar a pagar — daí os US$ 5 mil por dia do título.

O destino foi a Pure Storage: **US$ 1,5 milhão em equipamento**, mais manutenção anual. Parece caro perto dos US$ 600 mil de servidores, e é — porque S3 nunca foi só disco. Os 8 petabytes estavam replicados em várias regiões, e o que você compra junto é disponibilidade, durabilidade, versionamento e ciclo de vida. Quando sai, descobre que pagava software junto com o armazenamento.

## Um detalhe de bastidor

Vale ler os comentários do post de fevereiro de 2023 no LinkedIn — são 728. Entre eles, um de **Michael Dell**, fundador e CEO da Dell, concordando publicamente e aproveitando para vender a arquitetura PowerFlex e o Apex Cloud da própria empresa. Quatrocentas e onze reações. A Dell, convém lembrar, é quem vendeu os 20 servidores e patrocina o Rails World.

E no mesmo post há a frase que explica o nascimento de uma ferramenta: _"after a brief detour down a blind alley with an enterprise Kubernetes provider, we found our stride building our own tools"_. O beco sem saída com Kubernetes é o que deu origem ao Kamal — hoje a ferramenta de deploy padrão do Rails 8.

## O termo

Em 3 de maio de 2023, o DHH publicou _Sovereign clouds_, o post que dá nome a tudo isso. O argumento é de vocabulário, e é melhor do que parece.

Ele reconhece que chamar o movimento de "cloud exit" afasta uma geração inteira de profissionais que se identifica como _cloud native_. E desarma a objeção técnica com um número:

> "80-90% do que você precisa saber para rodar seu próprio hardware hoje é o mesmo que você precisa saber para operar nas nuvens alugadas."

Containers, load balancers, monitoramento, análise de performance — a stack é literalmente a mesma. A diferença real que ele admite é FinOps: quando o hardware é seu, você não precisa ser um perito forense para entender a própria fatura. Em compensação, de vez em quando chega um alerta de disco com defeito.

A proposta dele é abandonar a oposição público versus privado:

> "A distinção-chave aqui não é público versus privado, é possuir versus alugar."

E o fecho, que é onde ele é mais DHH do que nunca: _sovereign clouds_ como alternativa a **alugar uma fazenda dos senhores feudais da big tech**.

## O número que dói

Há um último post, de 21 de outubro de 2025, que é o mais honesto de todos. Nele o DHH soma a conta inteira, não a economia:

> "Squandered well over ten million dollars between [2018] and when we pulled the big plug in 2023. And a few millions more while we waited for the 4-year commit on S3 to expire. Painful!"

**Mais de dez milhões de dólares desperdiçados em cinco anos** — e ele usa a palavra _squandered_, desperdiçado, não _spent_. Mais alguns milhões presos no contrato do S3.

É um enquadramento diferente do que domina a discussão. O debate público ficou em torno dos 7, 9 ou 10 milhões economizados _depois_ da decisão. O número que realmente importa é o que foi gasto _antes_ dela — e esse ninguém publica, porque exige admitir que se acreditou no marketing.

A conclusão dele, no mesmo post, é a frase mais útil de quatro anos de textos:

> "Don't just believe the cloud hype. Do your own math. Consider owning your gear once the business is solid enough and the cost is significant."

Note o que a frase não diz. Não diz "saia da nuvem". Diz: faça a sua própria conta, e considere possuir _quando o negócio estiver sólido o bastante e o custo for significativo_. As duas condições importam.

## A parte que não é sobre dinheiro

Aqui eu saio do roteiro dele.

Trabalho como desenvolvedor na área de compliance regulatório de um gateway de pagamento. Pix, boleto, integração com a infraestrutura do Banco Central. Nesse mundo, a pergunta "onde ficam os seus dados" não é filosófica nem financeira — é jurídica, e a resposta errada fecha empresa.

O DHH tangencia isso em _European Digital Sovereignty_, de dezembro de 2022, quando fala do GDPR e de como a Europa cedeu a própria soberania digital em troca de conveniência americana. Mas ele trata o assunto como princípio. Aqui é operação.

Um servidor em São Paulo e um servidor na Virgínia estão sob legislações diferentes, com regimes de proteção de dados diferentes e autoridades diferentes olhando para eles. E quando você está na nuvem, seus dados estão _em algum lugar_: a redundância entre zonas é justamente o que barateia o serviço, e é justamente o que você não controla.

Na prática, parte da nossa infraestrutura é on-premise **por obrigação regulatória** — precisamos de servidores conectados diretamente ao Banco Central. Não é escolha de arquitetura nem de custo.

O exemplo mais concreto é recente. Muitas fintechs usam certificados de intermediadoras para falar com o Banco Central via Pix. Saiu uma resolução determinando que a comunicação fosse direta, sem intermediadora. Não há negociação nem prazo confortável: ou você resolve, ou toma multa. Conseguimos fazer a transição rápido porque já tínhamos a estrutura on-premise ligada ao BCB.

É esse o ponto que eu levaria de volta para a mesa do DHH. **Soberania digital, para quem opera sob regulação financeira no Brasil, já é requisito antes de ser escolha.** O debate dele é sobre possuir em vez de alugar por razões econômicas. Aqui a pergunta chega pelo outro lado: em alguns casos você simplesmente não tem permissão para alugar.

## O que eu faria na segunda-feira

Não é um chamado para sair da nuvem. Para a maioria das empresas isso é caro, arriscado e provavelmente desnecessário — o próprio DHH diz que começar na nuvem continua sendo a decisão certa.

O que eu tiro de quatro anos de posts e uma planilha que eu mesmo errei:

**Orce o ano da transição separado.** É o ano em que você paga a nuvem que ainda não desligou e o hardware que acabou de chegar. Na 37signals, 2023 custou mais caro que 2022 — e nenhuma das projeções previa isso.

**Saiba abrir a própria fatura.** A 37signals só conseguiu decidir porque tinha o gasto aberto por serviço. Sem isso, não existe conversa sobre otimizar, contratar ou sair — existe palpite.

**Trate contrato longo como dívida, não como desconto.** 70% de economia é real. Quatro anos de impossibilidade de sair também. A 37signals terminou a migração em 2023 e ficou presa ao S3 até julho de 2025.

**Custo é decisão de engenharia.** Trocar região, classificar armazenamento e revisar backup são decisões que um time toma sozinho, e que aparecem direto no resultado. Separar isso como "coisa de DevOps" é como separar performance: funciona até a conta chegar.

**Pergunte onde os dados estão antes de o regulador perguntar.** Se o seu setor tem autoridade em cima, a geografia do seu dado é requisito de produto.

E a última, que é sobre ler números em geral: entre a projeção de fevereiro de 2023 e o fechamento de abril de 2026 há três anos, duas revisões para cima e um resultado que voltou ao ponto de partida. Quando a conta é sobre o futuro, desconfie do número mais animado — inclusive do seu.

---

## Referências

**Posts do DHH (world.hey.com/dhh)**

| Data       | Post                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 19/10/2022 | [Why we're leaving the cloud](https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0)                                                                                         |
| 09/12/2022 | European Digital Sovereignty                                                                                                                                                          |
| 10/01/2023 | [The only thing worse than cloud pricing is the enterprisey alternatives](https://world.hey.com/dhh/the-only-thing-worse-than-cloud-pricing-is-the-enterprisey-alternatives-854e98f3) |
| 21/02/2023 | [We stand to save $7m over five years from our cloud exit](https://world.hey.com/dhh/we-stand-to-save-7m-over-five-years-from-our-cloud-exit-53996caa)                                |
| 22/02/2023 | [Five values guiding our cloud exit](https://world.hey.com/dhh/five-values-guiding-our-cloud-exit-638add47)                                                                           |
| 27/02/2023 | [Don't be fooled by serverless](https://world.hey.com/dhh/don-t-be-fooled-by-serverless-776cd730)                                                                                     |
| 23/03/2023 | [Cut cloud before payroll](https://world.hey.com/dhh/cut-cloud-before-payroll-a4530ebd)                                                                                               |
| 06/04/2023 | [The hardware we need for our cloud exit has arrived](https://world.hey.com/dhh/the-hardware-we-need-for-our-cloud-exit-has-arrived-99d66966)                                         |
| 02/05/2023 | [Cloud exit pays off in performance too](https://world.hey.com/dhh/cloud-exit-pays-off-in-performance-too-4c53b697)                                                                   |
| 03/05/2023 | [Sovereign clouds](https://world.hey.com/dhh/sovereign-clouds-661eb5e4)                                                                                                               |
| 23/06/2023 | [We have left the cloud](https://world.hey.com/dhh/we-have-left-the-cloud-251760fb)                                                                                                   |
| 15/09/2023 | [Our cloud exit has already yielded $1m per year in savings](https://world.hey.com/dhh/our-cloud-exit-has-already-yielded-1m-year-in-savings-db358dea)                                |
| 19/12/2023 | [The Big Cloud Exit FAQ](https://world.hey.com/dhh/the-big-cloud-exit-faq-20274010)                                                                                                   |
| 07/01/2024 | [Keeping the lights on while leaving the cloud](https://world.hey.com/dhh/keeping-the-lights-on-while-leaving-the-cloud-be7c2d67)                                                     |
| 17/10/2024 | [Our cloud-exit savings will now top ten million over five years](https://world.hey.com/dhh/our-cloud-exit-savings-will-now-top-ten-million-over-five-years-c7d9b5bd)                 |
| 07/02/2025 | [Servers can last a long time](https://world.hey.com/dhh/servers-can-last-a-long-time-165c955c)                                                                                       |
| 26/03/2025 | [It's five grand a day to miss our S3 exit](https://world.hey.com/dhh/it-s-five-grand-a-day-to-miss-our-s3-exit-b8293563)                                                             |
| 21/10/2025 | [Balanço do gasto total 2018–2025 (LinkedIn)](https://www.linkedin.com/feed/update/urn:li:activity:7386523716110913536/)                                                              |
| 15/04/2026 | [Fechamento da conta (LinkedIn)](https://www.linkedin.com/feed/update/urn:li:activity:7450208904237510656/)                                                                           |

**Outras fontes**

- Mark Imbriaco, [_Fun with stats, the S3 edition_](https://signalvnoise.com/posts/947-fun-with-stats-the-s3-edition) — Signal v. Noise, 01/04/2008
- 37signals, [_Our cloud spend in 2022_](https://dev.37signals.com/our-cloud-spend-in-2022/) e [_De-cloud and de-k8s — bringing our apps back home_](https://dev.37signals.com/bringing-our-apps-back-home/)
- DataCenterDynamics, [_37signals expects to save $7m over five years after moving off of the cloud_](https://www.datacenterdynamics.com/en/news/37signals-expects-to-save-7m-over-five-years-after-moving-off-of-the-cloud/)
- The Register, [_Save $7 million on cloud by spending $600k on servers_](https://www.theregister.com/2023/02/22/cloud_repatration_savings_calculated_basecamp/)
- TechSpot, [_Basecamp decided to leave the cloud after spending $3.2 million in one year_](https://www.techspot.com/news/97300-leaving-cloud-basecamp-spent-32-million-year-rent.html)
- NetworkWorld, [_Cloud vs on-prem: SaaS vendor 37signals bails out of the public cloud_](https://www.networkworld.com/article/972064/cloud-vs-on-prem-saas-vendor-37-signals-bails-out-of-the-public-cloud.html)
- ComputerWeekly, [_AWS vs Amazon: cloud giant's revenue rises as parent company's profit falls during Q4_](https://www.computerweekly.com/news/252512961/AWS-vs-Amazon-Cloud-giants-revenue-rises-as-parent-companys-profit-falls-during-Q4)
- Duckbill Group, [_S3 Reduced Redundancy Storage is Dead_](https://www.duckbillgroup.com/blog/s3-reduced-redundancy-storage-is-dead/) e [_Figma's $300k Daily AWS Bill Isn't the Scandal You Think It Is_](https://www.duckbillgroup.com/blog/figmas-300k-daily-aws-bill-isnt-the-scandal-you-think-it-is/)
- AWS, [_Free data transfer out to internet when moving out of AWS_](https://aws.amazon.com/pt/blogs/aws/free-data-transfer-out-to-internet-when-moving-out-of-aws/) (2024)
- Especificações [Dell PowerEdge R7625](https://www.dell.com/pt-br/shop/servidores-armazenamento-rede/servidor-em-rack-poweredge-r7625/spd/poweredge-r7625) e [AMD EPYC 9454](https://www.amd.com/en/products/processors/server/epyc/4th-generation-9004-and-8004-series.html)

_Este texto é a versão escrita da palestra que apresentei no 71º encontro do Guru-SP, na iugu, em setembro de 2025._
