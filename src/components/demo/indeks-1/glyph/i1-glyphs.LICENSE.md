# i1-glyphs — pochodzenie i licencja kroju

`i1-glyphs.woff2` (wewnętrzna nazwa kroju: „Indeks Glyphs”) to podzbiór **DejaVu Sans Mono 2.37**
(projekt DejaVu, https://dejavu-fonts.github.io/), przygotowany dla koncepcji „Indeks · I” piaskownicy
`/demo` serwisu zeprzalka.com (5.11.2026). Zawiera znaki odkodowania (`alphabet.ts`: raster, znaki
sekcji) oraz znaki sygnetu logo — te z zestawu `src/components/layout/LogoGlyph.tsx`, które ma
DejaVu Sans Mono (75 z 165). Własny krój zamiast krojów systemowych: każdy znak sygnetu ma tę samą
szerokość i metrykę (nagłówek nie drga przy podmianie znaku) i nigdy nie jest pustym prostokątem.

## Co zmieniono względem oryginału

- Zostawiono wyłącznie znaki z `FONT_CHARS` w `alphabet.ts` (101 znaków ze spacją i twardą spacją).
- Usunięto hinting i cechy OpenType, zapisano jako WOFF2.
- **Zmieniono nazwę kroju** na „Indeks Glyphs” — wymaga tego licencja Bitstream Vera dla wersji
  zmodyfikowanych (nazwa nie zawiera słów „Bitstream”, „Vera” ani „DejaVu”).
- Tabela `name` zachowuje notę copyright (ID 0) i pełny tekst licencji (ID 13) z oryginału.

## Jak odtworzyć plik

fontTools 4.x (`pip install fonttools brotli`) i źródłowy `DejaVuSansMono.ttf` 2.37:

```python
from fontTools import subset
from fontTools.ttLib import TTFont

chars = "<FONT_CHARS z alphabet.ts>"
options = subset.Options()
options.flavor = "woff2"
options.layout_features = []
options.hinting = False
options.notdef_outline = True
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
font = TTFont("DejaVuSansMono.ttf")
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=[ord(c) for c in chars])
subsetter.subset(font)
for record in font["name"].names:
    if record.nameID in (1, 16):
        record.string = "Indeks Glyphs"
    elif record.nameID == 4:
        record.string = "Indeks Glyphs"
    elif record.nameID == 6:
        record.string = "IndeksGlyphs-Regular"
    # ID 0: oryginalna nota copyright + dopisek o pochodnej, ID 3: identyfikator z nową nazwą
font.flavor = "woff2"
font.save("glif-symbols.woff2")
```

## Licencja

Fonts are (c) Bitstream (see below). DejaVu changes are in public domain.

### Bitstream Vera Fonts Copyright

Copyright (c) 2003 by Bitstream, Inc. All Rights Reserved. Bitstream Vera is
a trademark of Bitstream, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of the fonts accompanying this license ("Fonts") and associated
documentation files (the "Font Software"), to reproduce and distribute the
Font Software, including without limitation the rights to use, copy, merge,
publish, distribute, and/or sell copies of the Font Software, and to permit
persons to whom the Font Software is furnished to do so, subject to the
following conditions:

The above copyright and trademark notices and this permission notice shall
be included in all copies of one or more of the Font Software typefaces.

The Font Software may be modified, altered, or added to, and in particular
the designs of glyphs or characters in the Fonts may be modified and
additional glyphs or characters may be added to the Fonts, only if the fonts
are renamed to names not containing either the words "Bitstream" or the word
"Vera".

This License becomes null and void to the extent applicable to Fonts or Font
Software that has been modified and is distributed under the "Bitstream
Vera" names.

The Font Software may be sold as part of a larger software package but no
copy of one or more of the Font Software typefaces may be sold by itself.

THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT,
TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL BITSTREAM OR THE GNOME
FOUNDATION BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING
ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE
FONT SOFTWARE.

Except as contained in this notice, the names of Gnome, the Gnome
Foundation, and Bitstream Inc., shall not be used in advertising or
otherwise to promote the sale, use or other dealings in this Font Software
without prior written authorization from the Gnome Foundation or Bitstream
Inc., respectively. For further information, contact: fonts at gnome dot
org.
