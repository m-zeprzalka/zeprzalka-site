# ixn-glyphs — pochodzenie i licencja kroju

`ixn-glyphs.woff2` to niezmieniona kopia pliku `glif-symbols.woff2` z koncepcji „Glif”
(`src/components/demo/glif/`), skopiowana do „Indeksu · nowego” pod własną nazwą pliku,
żeby koncepcje nie zależały od siebie nawzajem. Wewnętrzna nazwa kroju to nadal
„Glif Symbols”. Sam krój jest podzbiorem **DejaVu Sans Mono 2.37** (projekt DejaVu,
https://dejavu-fonts.github.io/), przygotowanym dla piaskownicy `/demo` serwisu zeprzalka.com.

Znaki używane w tej koncepcji (raster odkodowania, sygnet) są wypisane w `alphabet.ts`;
cyfry binarne kodu rysuje Geist Mono, który piaskownica ładuje i tak.

## Co zmieniono względem oryginału

- Zostawiono wyłącznie znaki z listy `FONT_CHARS` w `alphabet.ts` (52 symbole
  matematyczne i APL oraz spację i twardą spację). Narzędzie do podzbioru dołożyło
  automatycznie dwa znaki dzielące kształt z wybranymi (∽, ≃).
- Usunięto hinting i cechy OpenType, zapisano jako WOFF2.
- **Zmieniono nazwę kroju** na „Glif Symbols” — wymaga tego licencja Bitstream Vera
  dla wersji zmodyfikowanych (nazwa nie zawiera słów „Bitstream” ani „Vera”).
- Tabela `name` zachowuje notę copyright (ID 0), pełny tekst licencji (ID 13)
  i jej adres (ID 14) z oryginału.

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
        record.string = "Glif Symbols"
    elif record.nameID == 4:
        record.string = "Glif Symbols Regular"
    elif record.nameID == 6:
        record.string = "GlifSymbols-Regular"
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
