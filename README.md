# [Obsidian-Sheets](https://github.com/metruzanca/sheets)

⚠️ Under development ⚠️

An obsidian plugin that allows you to edit `.sheet` files and supports javascript formulas. 

See a proof of concept of how the spreadsheet works at: https://sheets-nine.vercel.app

## Goals

- [ ] source/preview modes
- [ ] javascript formulas
- [ ] embeding into markdown files
- [ ] reference other sheets
- [ ] sandboxed javascript


## Development Notes

The spreadsheet evals javascript, which atm is not sandboxed, but will be in down the road.

I went for the "Obsidian" approach, with a "source" and "preview"

At the moment the .sheet files (just json) store just the source, however I might store the preview as well so that previewing doesn't require computing unless a value gets changed. 

### [mgmeyers/obsidian-kanban](https://github.com/mgmeyers/obsidian-kanban)
Shows that its possible to reference other documents and get `[[]]` suggestions and embed documents into the kanban view.

### [cooklang/cooklang-obsidian](https://github.com/cooklang/cooklang-obsidian)
Is a good example for source/preview modes with a custom file format.

### [Running sandboxed javascript by figma](https://www.figma.com/blog/how-we-built-the-figma-plugin-system/)

### Apps using Solidjs
- [mokeyish/obsidian-enhancing-export](https://github.com/mokeyish/obsidian-enhancing-export)
- [Canna71/obsidian-sets](https://github.com/Canna71/obsidian-sets)
