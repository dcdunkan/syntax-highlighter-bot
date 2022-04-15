<h1 align="center">🖍️ Syntax Highlighter Bot</h1>

Kind of a _copy_; highly inspired from
[Piterden/syntax-highlighter-bot](https://github.com/Piterden/syntax-highlighter-bot) -
Telegram Bot [here]()

Minimal syntax highlighting bot. Use it private chat or add to group chats. Send
text inside three backticks, or any message containing `pre` entities, and the
bot will reply you with syntax highlighted images of that piece of code. Useful
in Development groups.

### Try the running bot here: [Syntax Highlighter Bot](https://telegram.me/syntaxybot) 🚀

Written in [TypeScript](https://typescriptlang.org) and
[grammY](https://grammy.dev/) and runs on [Deno](https://deno.land/).

- [Built Using](#built-using)
- [Features](#features)
- [Setup › Running Locally](#running-locally)
- [Setup › Deploy to Heroku](#deploy-to-heroku)
- [Setup › Environment Variables](#environment-variables)

## Built Using

Thanks to these tools and libraries.

1. [Highlight.js][hljs] — Syntax highlighting for the Web. Behind-the-scenes of
   this bot.
2. [Puppeteer](https://pptr.dev) — Puppeteer is a library which provides a
   high-level API to control Chrome, Chromium, or Firefox Nightly over the
   DevTools Protocol. Also a core part of this bot, used for generating syntax
   highlighted images.
3. [grammY](https://grammy.dev) — The Telegram Bot Framework.
4. [Deta.sh Base](https://deta.sh) — Free and unlimited Cloud Database service.

## Features

- 🖍️ · **Syntax Highlighting** for almost 197 languages with automatic language
  detection - power of [highlight.js][hljs]!
- 🎨 · **Custom theming** for the images. Use the <ins><samp>/theme</samp></ins>
  command to set any theme from
  [this list](https://telegra.ph/Themes---Syntax-Highlighter-Bot-04-14). See
  themes in action [here](https://highlightjs.org/static/demo/).
- 🗛 · **Multiple fonts** support. See the <ins><samp>/font</samp></ins> command
  in chat for the list of available fonts.
- 🗎 · **Send images as documents**. Sometimes long code might make the image
  blurry due to the default Telegram image compression. Sending them as
  documents fixes the issue.
- 👀 · **Language Detection**: Tries to detect and use the language for more
  accurate results.
  - `bot.ts <code>` - Detects <samp>ts</samp>.
  - `ts <code>` - Detects <samp>ts</samp>.
  - `<code>` - Auto detection by [highlight.js][hljs].

  > NOTE: The `<code>` should be a <samp>pre</samp> formatted code block.
- Not a very useful feature, use <ins><samp>/stats</samp></ins> command to find
  how many times the bot has sent syntax highlighted images for you.

### "Maybe" features that I'd like to add if possible.

- <b>Forced <ins><samp>/highlight</samp></ins>ing</b> by replying to a message -
  if the message contains pre code blocks, highlight them in the usual way. If
  not, highlight the whole message.
- Highlight only if the code block contains more than <b><samp>x</samp> number
  of characters</b>. It would be a mess if someone use three backticks instead
  of one backtick, even for a single monospace word.
- <b>Automatically toggle "Send as Document" _mode_</b> if there is more than
  <samp>x</samp> number of characters.

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
  deno run --allow-net --allow-env --allow-read --allow-write --allow-run --unstable mod.ts
  ```

  **Required permissions**
  - <samp>--allow-net</samp> - To communicate with Telegram servers and receive
    updates.
  - <samp>--allow-env</samp> - To access environment variables.
  - <samp>--allow-read</samp> - To read [translations](locales),
    [styles](src/styles/) and
    <samp>.env</samp> file.
  - <samp>--allow-write</samp> - Required by puppeteer for writing temp files.
  - <samp>--allow-run</samp> - To run launch Google Chrome (via puppeteer)

If everything is done correct, you should see "(Username) started" in your
console.

### Deploy to Heroku

The working bot, [@syntaxybot](https://telegram.me/syntaxybot) is currently
deployed on **[Heroku](https://heroku.com)** free web dynos. It's pretty easy to
setup.

Click the button to deploy to [Heroku](https://heroku.com).

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dcdunkan/syntax-highlighter-bot)

<sub>Or
<a href="https://heroku.com/deploy?template=https://github.com/dcdunkan/syntax-highlighter-bot">click
here</a></sub>

After deploying you will get a link to your application, in the format
`https://<appname>.herokuapp.com/`.

Open browser and go to the link down below.

- Replace the `<BOT_TOKEN>` with your `BOT_TOKEN`.
- Replace `<APP_URL>` with the link to your application.

`https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<APP_URL>`

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

---

<p align="center"><samp>Made with ❤️ and ☕</samp></p>

[hljs]: https://highlightjs.org
