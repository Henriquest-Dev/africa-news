# 04 — Your Keys Were Safe. Your Address Wasn't.

Vídeo para **Damian Dupont (@DamianDupozjcr)**, no **estilo das referências** (registo "diorama fotográfico cinematográfico",
o do vídeo do Nolan, com técnicas dos outros dois). Imagens geradas no **servidor MCP da Pollinations** (modelo z-image).
9:16, 1080×1920, 60 fps, 38,6 s, em inglês, áudio a ≈ −14 LUFS. Pesquisa feita a 27 out. 2026.

## 1. Tema: fuga de dados da Keystone (em alta esta semana)

A Keystone, fabricante de carteiras de hardware, confirmou que a sua loja online (Shopify) foi invadida.
- Detetado a 20 out., roubo de dados confirmado a 23 out.
- **Expostos:** nomes, contactos, moradas de entrega, histórico de encomendas.
- **Não expostos (segundo a Keystone):** seed phrases, chaves privadas, passwords das carteiras, dados de cartão.
- A Keystone diz que apaga os dados 180 dias após a encomenda. **Clientes no X dizem que encomendas mais antigas também vazaram.**
- A própria Keystone avisa para **emails falsos de reembolso ou substituição**.
- Não há provas de ataques físicos depois desta fuga (o vídeo não afirma que houve).

Fontes: [The Block](https://www.theblock.co/news/business/2026-10-25-keystone-customers-say-breach-exposed-data-the-hardware-wallet-maker-promised-to-delete-431613) ·
[The Defiant](https://thedefiant.io/news/security/keystone-website-breach-exposes-customer-addresses-and-order-details) ·
[crypto.news](https://crypto.news/keystone-wallet-hack-customer-addresses-exposed/) ·
[Crypto Briefing](https://cryptobriefing.com/keystone-data-breach-exposed-2026/)

**Porquê este tema:** toca diretamente quem tem cripto (a tua audiência) e é útil (gera guardar e partilhar).
O medo é um gancho forte e o tema dá-se a cenas cinematográficas. Alternativa considerada: a fusão SpaceX/Tesla com
~30.000 BTC ([CoinDesk](https://www.coindesk.com/markets/2026/10/21/crypto-rises-with-asian-tech-stocks-zcash-extends-gain-after-setting-upgrade-date)).
Foi rejeitada porque exigiria recriar o Musk com IA.

## 2. Roteiro e ganchos (início, meio e fim)

```
[GANCHO 0–3 s]   Did you buy a hardware wallet online? Someone might now know where you live.
[CONTEXTO]       Keystone just confirmed hackers broke into its online store.
                 Your name. Your contact details. Your home address. Your order history.
[ALÍVIO]         Your seed phrase is safe. Your private keys are safe too.
[RE-GANCHO]      But here's the part people are angry about.
[VIRAGEM]        Keystone says it deletes customer records after 180 days.
                 Some customers say their older orders leaked anyway.
[NOVO PERIGO]    And now, Keystone is warning about scam emails offering fake refunds.
[AÇÃO]           So never type your seed phrase. Not for a refund. Not for anyone.
[FRASE-FINAL]    Your keys were safe. Your address wasn't.
[CTA]            Follow Damian Dupont, before the next leak.
```

- **Início:** pergunta direta ("Did you buy…?") e ameaça pessoal ("where you live"). A legenda já está nítida no frame 0 e "live." passa gigante a amarelo.
- **Meio:** um open loop ("here's the part people are angry about"), o "180" gigante, os balões de reação e o carimbo FAKE.
- **Fim:** uma frase-espelho que se cita sozinha ("Your keys were safe. Your address wasn't.") e um CTA com urgência ("before the next leak").

## 3. Direção visual (das referências analisadas frame a frame)

| Técnica da referência | Onde aparece |
|---|---|
| Cada frase tem uma cena gerada por IA, com pouca profundidade de campo e figurantes desfocados à frente | 10 cenas: porta com pacote, hacker, etiquetas, carteira, pessoas na rua, arquivo, telemóvel, caneta, porta com corrente, secretária |
| Legenda serif itálica branca no centro, 1–3 palavras de cada vez | Toda a narração, sincronizada palavra a palavra (Whisper) |
| Palavra-chave a amarelo + risco desenhado à mão | "where you live.", "hackers", "safe.", "180 days.", "fake", "wasn't.", "Damian Dupont" |
| Push-in lento em cada imagem parada | Todas as cenas (~2,5 %/s) com deriva lateral |
| Blur + passagem de quente a frio nas viragens | Entre cenas; porta quente → hacker frio; carteira quente → arquivo frio |
| Palavra gigante como transição ("story.") | "live.", "180", "anyone." |
| Balões de reação ("i hate it", "shit…") | "wait…", "my address??", "not again", "180 days??", "deleted??" |
| Etiquetas azuis (Wi-Fi/Bluetooth/GPS) | NAME / CONTACT DETAILS / HOME ADDRESS / ORDER HISTORY |
| Brilhos ✦, grão, vinheta | Cena da carteira e final; grão e poeira em tudo |
| CTA com tablet em cima da secretária vista de cima | O teu perfil do X no tablet e uma barra de pesquisa a escrever "@DamianDupozjcr" |

## 4. Texto para o X

> Bought a hardware wallet online?
>
> Keystone just confirmed hackers got names, emails and home addresses from its store.
>
> Your keys were safe. Your address wasn't. 🧵

**1.ª resposta:** "Never type your seed phrase for a 'refund'. Keystone is warning about fake refund emails." + link para a The Block.

## Ficheiros

- `your-address-wasnt.mp4`: vídeo final.
- `narration/narration.wav` e `.mp3`: narração separada (Piper `en_US-ryan-high`, verificada com Whisper), com `timing.json`.
- `keystone.html`: o vídeo em código (`seek(t)`). Abre no browser para ver e percorrer a linha do tempo.
- `assets/`: as 10 cenas geradas na Pollinations e o recorte do teu perfil.
