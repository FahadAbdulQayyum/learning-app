# learning-app

A simple German sentence learner: word-by-word English glosses, tap a word to hear it, or play the full sentence.

## Run locally

Serve over HTTP (needed for the PWA service worker):

```bash
npx --yes serve .
```

Then open the local URL in Chrome or Edge. Use **Install app** / Add to Home Screen to install Laut as a PWA.

Pronunciation uses the browser’s Web Speech API (best in Chrome or Edge with a German voice installed).

## PWA

- `manifest.webmanifest` — app name, theme, icons
- `sw.js` — caches the app shell for offline use
- `icons/` — install icons

## Add sentences

Edit `data.js` and add objects like:

```js
{
  id: "s16",
  text: "Ich lerne Deutsch.",
  meaning: "I am learning German.",
  words: [
    { de: "Ich", en: "I" },
    { de: "lerne", en: "learn / am learning" },
    { de: "Deutsch.", en: "German." },
  ],
}
```
