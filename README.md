# learning-app

A simple German sentence learner: word-by-word English glosses, tap a word to hear it, or play the full sentence.

## Run locally

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

Pronunciation uses the browser’s Web Speech API (best in Chrome or Edge with a German voice installed).

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
