# benderts

A Discord bot ("Bender") for a Politics & War community, written in TypeScript on
discord.js v13. Slash commands only.

Part of a three-repo system:

| | |
|---|---|
| **[farkistan-pw-client-app](https://github.com/martip23/farkistan-pw-client-app)** | React client |
| **[farkapi](https://github.com/martip23/farkapi)** | GraphQL API |
| **benderts** *(this repo)* | Discord bot |

---

## Stack

- **TypeScript** (ESM — `"type": "module"`)
- **discord.js 13** with `@discordjs/builders` and `@discordjs/rest`
- **axios**
- Docker, multi-stage build

## Architecture

Commands are data, not a switch statement. Each one satisfies a single interface, and the
registry is the only place that needs to change when a command is added.

```
src/
  Bot.ts                      client setup, login, listener registration
  Command.ts                  the Command interface — discord.js command data + a run()
  Commands.ts                 the registry: every command the bot exposes
  Commands/
    Hello.ts                  /hello     — ephemeral greeting
    GetQuote.ts               /get-quote — fetches a Bender quote from an external API
  Listeners/
    Ready.ts                  on ready, pushes the command set to Discord
    InteractionCreate.ts      routes an incoming interaction to its command
```

**Registration.** `Ready.ts` calls `client.application.commands.set(Commands)` on connect,
so Discord's registered command list is derived from the registry on every boot rather than
maintained by hand.

**Dispatch.** `InteractionCreate.ts` looks the command up by name, calls `deferReply()`
first, then runs it. Deferring matters: Discord expects a response within three seconds, and
`GetQuote` makes an outbound HTTP call before it can answer.

**Intents are empty** (`intents: []`) — deliberately. Interactions arrive over the gateway
regardless, and the bot reads no message content, so it requests no privileged intents.

---

## Running it

```bash
npm install
npm run dev     # ts-node
```

Or with Docker:

```bash
docker compose up --build
```

### Environment

A `.env` in the project root:

```
BOT_TOKEN=your-discord-bot-token
```

---

## Adding a command

1. Create `src/Commands/YourCommand.ts` exporting a `Command`.
2. Add it to the array in `src/Commands.ts`.

It registers itself with Discord on the next boot.

---

## Known limitations

A 2022 side project for a small community:

- **No tests** — the `test` script is still the npm default that exits 1.
- **No error handling around the outbound call** in `GetQuote`; if the quote API is down the
  interaction is left deferred.
- Commands are registered **globally** rather than per-guild, so changes take up to an hour
  to propagate. Guild-scoped registration is instant and is the better choice during
  development.
- discord.js 13 is several major versions behind.
