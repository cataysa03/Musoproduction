# Mux Service Guide

Reference this file whenever a task touches video upload, playback, streaming, or analytics for the Antigravity portfolio (see [`project and design guideline.md`](../project%20and%20design%20guideline.md), Dimension 6: Video Infrastructure). It covers both the **Mux MCP Server** (for agent-driven/manual workflows, e.g. inside Claude) and the **Mux Node SDK** (for the actual production codebase).

Setup source of truth: `https://www.mux.com/prompts/onboarding.md` (official Mux agent-onboarding prompt — re-fetch it if these instructions ever seem stale).

---

## 0. Project Setup Status (last checked 2026-07-20)

- **MCP server:** registered as `mux` connector (`https://mcp.mux.com`), tools `search_docs` and `execute`.
- **`search_docs`:** verified working (no account required).
- **`execute`:** not yet authorized — no Mux account connected. Calling it throws `Could not resolve authentication method`. Once a Mux account exists, the next `execute` call triggers OAuth automatically (login + environment selection). Sign up free, no card: https://dashboard.mux.com/signup.
- **Codebase state:** no `package.json` / app code yet — project is still at the design/planning stage.

### Chosen integration pattern: **Website embed**

Decided from the three onboarding questions (video needs / public-private / who uploads):

| Question | Answer |
| :--- | :--- |
| Video functionality | Upload and playback (no live streaming) |
| Content visibility | Public — `playback_policies: ["public"]` |
| Upload source | Admin/creator-managed (studio adds portfolio reels, not end-users) |

This is the **small, curated set of videos** pattern, not the dynamic "user uploaded" pattern — no direct-upload widget, no webhook-driven DB persistence needed. Workflow:

1. Create each asset once via the CLI (`mux assets create --input-url URL --wait --json`) or the SDK/MCP `execute` tool.
2. Extract the resulting `playback_ids[0].id` for each video.
3. Hardcode those playback IDs directly in code, or collect them in a small JSON config file (e.g. `videos.json`) keyed by project/slug.
4. Embed each with Mux Player (`@mux/mux-player-react` or `<mux-player>`).

If requirements change later (e.g. clients start uploading their own reels, or private/gated case studies are needed), revisit this section — that shifts to the "user uploaded" pattern in §8 below and signed playback in §5.

---

## 1. What Mux Is For Here

Mux is the dedicated video API/CDN backing the site's cinematic video hero, portfolio grid, and any embedded case-study reels. It replaces self-hosted video files with adaptive bitrate (HLS) delivery, so playback stays fast and buffer-free regardless of the visitor's connection — required to hit the LCP < 2.5s target from the design guideline.

Two ways to work with Mux in this project:

- **Mux MCP Server** — used by an AI agent (Claude Desktop, Claude Code, Cursor, etc.) to create/inspect assets, live streams, uploads, and analytics via natural-language prompts. Good for one-off operational tasks (checking a video's status, generating a playback URL, pulling analytics) without writing code.
- **Mux Node SDK (`@mux/mux-node`)** — used in actual application code (upload flows, webhook handlers, playback pages).

---

## 2. Using the Mux MCP Server

### How it works — "Code Mode"

The Mux MCP server does not expose one tool per endpoint. It exposes exactly two tools:

- **`search_docs`** — searches SDK documentation for methods, parameters, and usage examples. Takes a `language` param (`typescript`, `javascript`, `python`, `go`, `ruby`, `java`, `kotlin`, `terraform`, `http`) — always match it to the target project's language.
- **`execute`** — runs TypeScript against `@mux/mux-node` in an isolated sandbox (no web/filesystem access outside the SDK client). Define an async `run(client)` function; whatever it returns or logs comes back as the result. Variables do **not** persist between calls.

This lets an agent perform multi-step tasks (e.g. "find the most recent asset and give me its playback URL") deterministically, using the real SDK surface — assets, direct uploads, playback IDs, tracks, live streams, delivery usage, Mux Data metrics/dimensions/filters/exports, signing keys, `whoami`, and webhook verification.

**Important:** Code Mode does **not** special-case destructive operations (asset deletion, etc.). What the agent can actually do is governed entirely by the access token/environment it's authorized with. If write/delete access should be restricted, authorize a read-only or scoped token, or run the server locally with method restrictions.

**Always use `search_docs` before writing Mux code, even if the pattern seems familiar** — the MCP server is the current source of truth; training data on Mux SDK usage may be outdated. Prefer `execute` for actually performing operations (creating assets, uploads, live streams, querying analytics) over hand-writing raw API calls.

### Setup (remote server — preferred)

- Hosted at `https://mcp.mux.com`.
- Claude Code: `claude mcp add mux --url https://mcp.mux.com?client=claude-code`
- Codex: `codex mcp add mux --url https://mcp.mux.com` then `codex mcp login mux`
- Cursor (`.cursor/mcp.json`): `"mux": { "url": "https://mcp.mux.com?client=cursor" }`
- GitHub Copilot / VS Code (`.vscode/mcp.json`): `"mux": { "url": "https://mcp.mux.com" }`
- Windsurf (`~/.codeium/windsurf/mcp_config.json`, note `serverUrl` not `url`): `"mux": { "serverUrl": "https://mcp.mux.com" }`
- OpenCode (`~/.config/opencode/opencode.jsonc`): `"mux": { "type": "remote", "url": "https://mcp.mux.com", "enabled": true, "oauth": {} }`, then `opencode mcp auth mux`
- Any other agent: add `"mux": { "url": "https://mcp.mux.com" }` to its MCP config under `mcpServers`.
- Auth is OAuth-based and automatic: it triggers on first tool use, prompting login to `dashboard.mux.com` and selection of which Mux environment (e.g. test vs. production) to authorize.
- No manual Access Token copying needed for the remote server.
- In this project the server is already registered as the `claude.ai Mux` connector (available in-session as `mcp__claude_ai_Mux__search_docs` / `mcp__claude_ai_Mux__execute`) — no re-registration needed here, see §0.

### Setup (older clients without remote MCP support)

- Install the MCP server locally — this also lets you restrict which tools/SDK methods are allowed.
- Or use `mcp-remote` to bridge remote MCP support into a client that lacks it natively.

### Prompt patterns that work well

Video management:
- "List all my video assets and their current status"
- "Give me the playback URL for the most recently uploaded video"
- "Generate a subtitles track for asset ID: `ASSET_ID`"
- "Create a webpage where I can upload a video to Mux"

Analytics (Mux Data):
- "What are the top performing videos by view count?"
- "Show me video performance metrics for the last week"
- "What are the most common video errors in my account?"
- "List all available data dimensions I can filter by"

### When to prefer the MCP server over writing app code

Use MCP for exploratory/operational tasks — checking asset status, pulling one-off analytics, generating a signed playback URL, debugging a webhook payload. Use the SDK directly in the codebase for anything that needs to run as part of the actual application (upload UI, playback pages, webhook handlers).

---

## 3. Mux Node SDK — Core Operations Reference

```ts
import Mux from '@mux/mux-node';
const client = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET });
```

### Create a video asset (from URL)
```ts
const asset = await client.video.assets.create({
  inputs: [{ url: 'https://...' }],
  playback_policies: ['public'],
  video_quality: 'basic',
});
// asset.id, asset.status ('preparing' | 'ready' | 'errored'), asset.playback_ids[0].id
```
(Verified current signature via `search_docs`, 2026-07-20. Older docs/training data may show `input`/`playback_policy` singular-form aliases — both work, but prefer `inputs`/`playback_policies`.)

### Retrieve an asset
```ts
const asset = await client.video.assets.retrieve('ASSET_ID');
// asset.id, asset.status, asset.duration, asset.max_stored_resolution, asset.tracks[]
```

### List assets (paginated)
```ts
const page = await client.video.assets.list({ limit: 25 });
// page.data: Asset[], page.next_cursor
for await (const asset of client.video.assets.list()) { /* auto-paginate */ }
```

### Create a live stream
```ts
const stream = await client.video.liveStreams.create({
  playback_policy: ['public'],
  new_asset_settings: { playback_policy: ['public'] },
});
// stream.id, stream.stream_key (RTMP key), stream.status, stream.playback_ids[0].id
```

### Create a direct upload URL (recommended path for the site's upload flow)
```ts
const upload = await client.video.uploads.create({
  cors_origin: 'https://example.com',
  new_asset_settings: { playback_policy: ['public'] },
});
// upload.id, upload.url (PUT the video binary directly to this), upload.status ('waiting' | 'asset_created' | 'errored')
```

### Sign a playback ID (for private/gated content)
```ts
const token = await client.jwt.signPlaybackId('PLAYBACK_ID', { type: 'playback', expiration: '6h' });
// Returns a JWT string — append as ?token=<jwt> on the HLS/stream URL
```

### Verify a webhook
```ts
const event = client.webhooks.unwrap(rawBody, headers);
// event.type ('video.asset.ready' | 'video.live_stream.active' | ...), event.data: Asset | LiveStream | ...
```
Always verify webhook signatures with `webhooks.unwrap` rather than trsting payloads directly — this is the standard security boundary for Mux webhook consumers.

### Get delivery/bandwidth usage
```ts
const usage = await client.data.metrics.getOverallValues('requests', { timeframe: ['7:days'] });
// usage.data.overall_average, usage.data.total_row_count, usage.timeframe
```

### Add a subtitle/caption track to an asset
```ts
await client.video.assets.tracks.create('ASSET_ID', {
  url: 'https://.../captions.vtt',
  type: 'text',
  text_type: 'subtitles',
  language_code: 'en',
});
```

---

## 4. Playback in the Frontend

- Use `playback_ids[0].id` with Mux's hosted streaming domain to build an HLS URL, or use `@mux/mux-player` / `@mux/mux-player-react` for a drop-in player with adaptive bitrate handling built in.
- For the homepage hero video (per the design guideline's full-screen cinematic entry), still preload a static poster image (`<link rel="preload" as="image" fetchpriority="high">`) so paint isn't blocked on the video request — Mux thumbnails can be generated directly from a playback ID (`https://image.mux.com/{PLAYBACK_ID}/thumbnail.jpg`).
- Set explicit aspect-ratio/`min-height` on video containers to avoid CLS, consistent with Dimension 6 of the design guideline.

---

## 5. Security Considerations

- Use `playback_policies: ['signed']` (not `public`) for any unreleased or client-confidential project reels, and generate short-lived JWTs via `client.jwt.signPlaybackId`.
- Never expose `MUX_TOKEN_SECRET` client-side — asset creation, uploads-URL generation, and signing must happen server-side (API route/server action), with only the resulting upload URL or signed playback token sent to the browser.
- Scope the MCP server's authorized token/environment appropriately — use test-mode or a read-only token when the task is exploratory, and only authorize a token with write/delete access for environments where that's actually intended.
- Always verify webhook payloads with `webhooks.unwrap` before acting on them.

---

## 6. Sensible Defaults

Unless a specific need overrides them, use these when creating assets:

| Parameter | Default | Notes |
| :--- | :--- | :--- |
| `playback_policies` | `["public"]` | Use `["signed"]` only if the content needs secure/private playback |
| `video_quality` | `"basic"` | No extra encoding cost, fine for most portfolio use; `"plus"` only if higher-quality encoding is explicitly needed |
| `static_renditions` | not set | Only set if downloadable MP4/M4A files are explicitly needed |
| `max_resolution_tier` | not set (defaults to `1080p`) | Set to `"2160p"` only if 4K is explicitly requested |

## 7. Common Mistakes to Avoid

- **Don't confuse Asset IDs with Playback IDs.** Asset IDs are for API operations (`api.mux.com`). Playback IDs are for streaming (`stream.mux.com`). They're different strings, not interchangeable.
- **Don't use a playback URL before the asset is `ready`.** Check `status === "ready"` first — a `preparing` asset's playback URL won't work yet.
- **Don't construct playback URLs with the Asset ID.** Correct form: `https://stream.mux.com/{PLAYBACK_ID}.m3u8`, never `.../{ASSET_ID}.m3u8`.
- **Don't expose API keys (`MUX_TOKEN_ID`/`MUX_TOKEN_SECRET`) in client-side code** — frontend JS, mobile apps, or anything running on the user's device. All Mux API calls must originate from a trusted server.
- **Don't expose live-stream stream keys client-side** — anyone with the key can broadcast to that stream. Server-side only.
- **Don't poll more than once per second.** The API is rate-limited; prefer webhooks (`video.asset.ready`, live-stream status changes, etc.) over polling.

## 8. If Requirements Shift to "User Uploaded"

If this project later needs end-users or clients to upload their own video (not just admin-managed portfolio reels — see §0), that's a different pattern than what's chosen here, requiring:

1. **Accept uploads** — direct uploads (`client.video.uploads.create`, browser PUTs the file) for browser-based uploads, or server-side asset creation from a URL for programmatic ingestion.
2. **Listen for events** — webhooks, not polling, to know when a video is ready (`video.asset.ready`).
3. **Persist video data** — store asset ID, playback ID, status, and metadata in a database.
4. **Play videos** — Mux Player with the stored playback ID.

Relevant components at that point: **Mux Uploader** (`@mux/mux-uploader-react` or `<mux-uploader>`) for the drop-in upload widget with progress/resumability, and **Mux Robots** for AI-powered auto-captions/subtitles/moderation if it becomes a UGC-style platform.

---

## 9. Troubleshooting / Where to Look

- MCP setup issues: Model Context Protocol docs, or Claude's MCP-specific docs if using Claude clients.
- API/SDK behavior questions: the Mux API reference, or ask the Mux MCP server's docs-search tool directly.
- Account/billing: `mux.com/support`.
