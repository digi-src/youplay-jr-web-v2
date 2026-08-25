Codec Pro is a commercial font and isn't bundled here. `--font-primary`
(src/styles/tokens.css) currently falls back to Sora.

To switch to the real font once you have licensed `.woff2` files:

1. Drop the files in this folder (e.g. `codec-pro-regular.woff2`, `codec-pro-bold.woff2`).
2. Add the `@font-face` rules to `src/index.css`:

```css
@font-face {
  font-family: 'Codec Pro';
  src: url('./assets/fonts/codec-pro/codec-pro-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Codec Pro';
  src: url('./assets/fonts/codec-pro/codec-pro-bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

No other changes needed — `--font-primary` already lists `'Codec Pro'` first.
