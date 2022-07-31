<h1 align="center">🖍️ Syntax Highlighter Bot</h1>

> Source code of [@syntaxybot](https://telegram.me/syntaxybot).

Kind of a _copy_; highly inspired from
[Piterden/syntax-highlighter-bot](https://github.com/Piterden/syntax-highlighter-bot) -
Telegram Bot [here](https://telegram.me/cris_highlight_bot).

Minimal syntax highlighting bot for Telegram. Use it in private chats or add to
group chats. Send text inside three backticks, or any message containing `pre`
or multiline `code` entities, and the bot will reply you with syntax highlighted
images of that piece of code. Useful in Development groups.

### Try the running bot here: [Syntax Highlighter Bot](https://telegram.me/syntaxybot) 🚀

Written in [TypeScript](https://typescriptlang.org) and
[grammY](https://grammy.dev/) and runs on [Deno](https://deno.land/).

- [Built Using](#built-using)
- [Features (and usage)](#features)
- [Setup › Running Locally](#running-locally)
- [Setup › Deploy to Deno Deploy](#deploy-to-deno-deploy)
- [Setup › Environment Variables](#environment-variables)

## Built Using

Thanks to these tools and libraries.

1. [highlight.js][hljs] — Syntax highlighting for the Web. Behind-the-scenes of
   this bot.
2. [svg2png-wasm](https://github.com/ssssota/svg2png-wasm) — Used for generating
   PNG images from custom made SVG.
3. [grammY](https://grammy.dev) — The Telegram Bot Framework.
4. [Deta.sh Base](https://deta.sh) — Free and unlimited Cloud Database service.

> puppeteer had a great place in the history of syntax highlighter bots
> including this one. So, thank you. (Since v0.5.0 we don't use it anymore).
>
> - ~~[Puppeteer](https://pptr.dev) — Puppeteer is a library which provides a
  > high-level API to control Chrome, Chromium, or Firefox Nightly over the
  > DevTools Protocol. Also a core part of this bot, used for generating syntax
  > highlighted images.~~

## Features

(and usage)

- <a id="syntax-highlighting" href="#syntax-highlighting">🖍️</a> · **Syntax
  Highlighting** for almost 200 languages with automatic language detection -
  power of [highlight.js][hljs]!

- <a id="custom-theming" href="#custom-theming">🎨</a> · **Custom theming** for
  the images. Use the <ins><samp>/theme</samp></ins> command to set any theme
  from [this list](https://telegra.ph/Themes---Syntax-Highlighter-Bot-04-14).
  See themes in action [here](https://highlightjs.org/static/demo/).

- <a id="multiple-fonts" href="#multiple-fonts">🗛</a> · **Multiple fonts**
  support. See the <ins><samp>/font</samp></ins> command in chat for the list of
  available fonts.

- <a id="as-documents" href="#as-documents">🗎</a> · **Send images as
  documents**. Sometimes long code might make the image blurry due to the
  default Telegram image compression. Sending them as documents fixes the issue.
  Use either <ins><samp>/as_doc</samp></ins> or
  <ins><samp>/as_document</samp></ins> command.

- <a id="language-detection" href="#language-detection">👀</a> · **Language
  Detection**: Tries to detect and use the language for more accurate results.
  - `bot.ts <code>` - Detects <samp>ts</samp>.
  - `ts <code>` - Detects <samp>ts</samp>.
  - `<code>` - Auto detection by [highlight.js][hljs].

  NOTE: The `<code>` ~~should be a <samp>pre</samp> formatted code block~~ could
  be a <samp>pre</samp> entity formatted code block, or a multiline
  <samp>code</samp> entity.

- <a id="forced-highlighting" href="#forced-highlighting">🖌️</a> · **Forced
  Highlighting**: Replying
  <ins><samp>/highlight</samp></ins> or
  <ins><samp>/hl</samp></ins> to a message containing text or caption, will
  - check for `pre` and `code` (multiline) entities and if there is any, only
    highlights those as it normally do. Useful if the original message was
    edited later.
  - If no `pre` or `code` (multiline) entities were found, highlights the whole
    message. Useful if you forgot to format them before sending.

  <h3 id="forced-highlighting-optional-args" href="#forced-highlighting-optional-args">Optional Arguments</h3>

  You can optionally pass arguments separated by commas or white spaces. The
  accepted arguments are integers corresponding to the position of the
  `pre`/`code` entity in the message. Starting from 1. See the example below.

  - Passing `w` or `no-wrap`, or `nw` will highlight the text without wrapping
    it. The image will scale to the maximum content length. It is useful when
    highlighting some terminal logs, etc.

    > Introduced in <kbd>v0.4.0</kbd>

  - you can also pass any of `0`, `full`, `f` to get the whole message
    highlighted. (why?: If you ever need to highlight the full message which
    contains `pre`/`code` entities).

    Take this message as an example:
    ```
    Lorem ipsum <code (inline)> dolor sit amet.

    <code (multi line)>

    Nunc in ligula vehicula quam efficitur vehicula at lacinia erat.

    <pre>
    ```

    Now, replying,

    > **NOTE**: <ins><samp>/hl</samp></ins> is the same as
    > <ins><samp>/highlight</samp></ins>. It's just a short form.

    - `/hl` will highlight `<code (multi line)>` and `<pre>` (Default).
    - `/hl 1` will only highlight the `<code (inline)>`.
    - `/hl 2` will only highlight the `<code (multi line)>`.
    - `/hl 3` will only highlight the `<pre>`.
    - `/hl 1 3` will highlight both `<code (inline)>` and `<pre>`.
    - `/hl 0` or `/hl f` or `/hl full` will highlight the whole message.

    **NOTE**: `/hl 0 1` only highlights the full message; not both full message
    and 1st `pre`/`code` entity.

- <a id="toggle-auto-shl" href="#toggle-auto-shl">🚫</a> · **Toggle Automatic
  Syntax Highlighting**: You can disable auto syntax highlighting by using the
  <ins><samp>/toggle_auto_hl</samp></ins> command. (Use the same command to
  re-enable it). You don't always need the bot to highlight even the small
  codeblocks. So, when you need the highlighting, you can force it to highlight
  the message/code blocks. Checkout the
  ["Forced Highlighting"](#forced-highlighting) feature.

  <kbd>v0.3.0</kbd> • See [gmy#57178](https://t.me/grammyjs/57178).

- <a id="stats" href="#stats">📊</a> **Stats**: Not a very useful feature; use
  <ins><samp>/stats</samp></ins> command to find how many times the bot has sent
  syntax highlighted images for you.

### "Maybe" features that I'd like to add if possible.

- [x] <b>Forced <ins><samp>/highlight</samp></ins>ing</b> by replying to a
      message - if the message contains pre code blocks, highlight them in the
      usual way. If not, highlight the whole message.
- [ ] Highlight only if the code block contains more than <b><samp>x</samp>
      number of characters</b>. It would be a mess if someone use three
      backticks instead of one backtick, even for a single monospace word.
- [ ] <b>Automatically toggle "Send as Document" _mode_</b> if there is more
      than <samp>x</samp> number of characters.
- [x] <b>No puppeteer.</b> Highlighting without using puppeteer. (The most
      wanted feature). This was done in v0.5.0 by using an implementation which
      creates a SVG and transform it into PNG... blah blah.

## Setup

### Running Locally

Make sure you have installed [Deno](https://deno.land/).

- Clone the repository.
  ```bash
  git clone https://github.com/dcdunkan/syntax-highlighter-bot.git
  ```
- Change directory (`cd`) to the cloned repository.
- Create a `.env` file and set [environment variables](#environment-variables)
  like in <samp> [example.env](example.env)</samp>.
- Run the bot using the command below.
  ```bash
  deno run --allow-net --allow-env --allow-read local.ts
  ```

  **Required permissions**
  - <samp>--allow-net</samp> - To communicate with Telegram servers and receive
    updates.
  - <samp>--allow-env</samp> - To access environment variables.
  - <samp>--allow-read</samp> - To read [translations](locales),
    [styles](assets/styles/), [fonts](assets/fonts/) and
    <samp>.env</samp> file.

If everything is done correct, you should see "(Username) started" in your
console.

### Deploy to Deno Deploy

The working bot, [@syntaxybot](https://telegram.me/syntaxybot) is currently
deployed on [Deno Deploy](https://deno.com/deploy) free account. It's pretty
easy to setup.

Click
[here](https://dash.deno.com/new?url=https://raw.githubusercontent.com/dcdunkan/syntax-highlighter-bot/main/mod.ts&env=BOT_TOKEN,DETA_KEY)
to deploy to Deno Deploy.

After deploying you will get a link to your application, in the format
`https://<appname>.deno.dev/`.

Open browser and go to the link down below.

- Replace the `<BOT_TOKEN>` with your `BOT_TOKEN`.
- Replace `<APP_URL>` with the link to your application.

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<APP_URL>
```

This will set the bot's webhook to the deployed application, so Telegram will
send updates there and it will be able to handle them there.

### Environment Variables

| Variable    | Required? | Description                                                                      |
| ----------- | --------- | -------------------------------------------------------------------------------- |
| `BOT_TOKEN` | **Yes.**  | The API token of the Bot. Chat with https://t.me/BotFather to get one.           |
| `DETA_KEY`  | **Yes.**  | Project Key of Deta.sh Project. Sign up and create a project at https://deta.sh. |

## License

[MIT License](LICENSE). Copyright (c) 2022 dcdunkan (Dunkan)

## Contributing

Feel free to contribute! And if you are having issues or if you want suggest
something, please open an issue here:
[dcdunkan/syntax-highlighter-bot/issues](https://github.com/dcdunkan/syntax-highlighter-bot/issues).
Or, open a [PQ](https://telegram.me/grammyjs/34358)!

### Translating

If you like to translate this bot into your language, please follow
[the English translation file](locales/en.ftl). This project uses
[Fluent](https://projectfluent.org) for localization.

---

<p align="center"><samp>Made with ❤️ and ☕</samp></p>

[hljs]: https://highlightjs.org
