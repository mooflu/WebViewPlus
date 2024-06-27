# WebViewPlus

Browser file viewer
(meant to be used with this [QuickLook plugin](https://github.com/mooflu/QuickLook.Plugin.WebViewPlus))

Demo: https://mooflu.github.io/WebViewPlus/

## Supported file formats:

### Native via iframe

html, pdf

### Scalable Vector Graphics (pan & zoom)

svg

### Images (including animated)

png, apng, jpeg, gif, bmp, webp, avif

### Markdown (with math plugins)

md

### Jupyter notebook

ipynb

### Tabular data

xlsx, xls, ods, csv, tsv

### 3D model viewer

gltf, glb, fbx, obj

### Syntax Highlighter

See list here: https://github.com/mooflu/WebViewPlus/blob/master/src/plugins/SyntaxPlugin.tsx

More file extensions can be added in settings.
Where the language doesn't match the extension, specify both separated by a colon:
E.g. "rs:rust"
Any language supported by https://prismjs.com/#supported-languages should work.

### Fonts

ttf, otf, woff2 (without font info), woff

## Develop

make dev

make build

make lint

make check
