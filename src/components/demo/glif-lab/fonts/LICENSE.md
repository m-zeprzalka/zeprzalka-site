# Kroje „Glif Lab” — pochodzenie i licencje

Trzy podzbiory przygotowane dla koncepcji „Glif · laboratorium” w piaskownicy `/demo`
serwisu zeprzalka.com (2026). Służą wyłącznie do rysowania glifów (atlas canvasu/WebGL
i dekodowanie liter) — każdy znak ma zawsze ten sam kształt, bez pustych prostokątów
i bez kolorowych emoji z systemu.

| Plik | Źródło | Zawartość | Licencja |
| --- | --- | --- | --- |
| `gll-mono.woff2` („Glif Lab Mono”) | DejaVu Sans Mono 2.37 | ASCII 0x20–0x7E, bloki U+2580–259F, linie ─│╱╲╳, symbole sygnetu (z kroju „Glif Symbols”) | Bitstream Vera (niżej) |
| `gll-braille.woff2` („Glif Lab Braille”) | DejaVu Sans 2.37 | wzory Braille’a U+2800–28FF | Bitstream Vera (niżej) |
| `gll-kana.woff2` („Glif Lab Kana”) | M PLUS 1 Code 1.100 (wariant wght 700) | katakana U+30A1–30FA i ー | SIL Open Font License 1.1 (niżej) |

## Co zmieniono względem oryginałów

- Zostawiono wyłącznie znaki z tabeli (narzędzie do podzbioru może dołożyć znaki dzielące kształt).
- Usunięto hinting i cechy OpenType, zapisano jako WOFF2; M PLUS 1 Code przypięto do grubości 700.
- **Zmieniono nazwy krojów** na „Glif Lab Mono / Braille / Kana” — licencja Bitstream Vera wymaga tego
  dla wersji zmodyfikowanych (nazwa bez słów „Bitstream” i „Vera”); OFL dopuszcza zmiany pod
  dowolną nazwą (M PLUS 1 Code nie ma zastrzeżonej nazwy).
- Tabela `name` zachowuje noty copyright (ID 0), tekst licencji (ID 13) i jej adres (ID 14).

## Jak odtworzyć pliki

fontTools 4.x (`pip install fonttools brotli`), `DejaVuSansMono.ttf` i `DejaVuSans.ttf` 2.37,
`MPLUS1Code[wght].ttf` z https://github.com/google/fonts/tree/main/ofl/mplus1code:

```python
"""Podzbiory krojów dla koncepcji „Glif · laboratorium” (gll)."""
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = sys.argv[1]
KANA_SRC = sys.argv[2]

GLIF = "  ·∶⋆∼∴∵∸∗⍣∷∹∻⋍⨯✕⊢⊣⧺⎈∺⎉○◇⊤⊥⎋⊙⊘⊖⊜⌀⎊⊡⊟⌘◎⊕⊗⊚◈⍟❖⊛◆⍫⧻⊞⊠◍◉●⧫"
ASCII = "".join(chr(c) for c in range(0x20, 0x7F))
BLOCKS = "".join(chr(c) for c in range(0x2580, 0x25A0))
LINES = "─│╱╲╳"
MONO = sorted(set(ASCII + GLIF + BLOCKS + LINES))
BRAILLE = "  " + "".join(chr(c) for c in range(0x2800, 0x2900))
KANA = "  " + "".join(chr(c) for c in range(0x30A1, 0x30FB)) + "ー"


def build(src, chars, name, out, inst=None):
    font = TTFont(src)
    if inst:
        font = instancer.instantiateVariableFont(font, inst)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = []
    options.hinting = False
    options.notdef_outline = True
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    sub = subset.Subsetter(options)
    sub.populate(unicodes=[ord(c) for c in chars])
    sub.subset(font)
    for record in font["name"].names:
        if record.nameID in (1, 16):
            record.string = name
        elif record.nameID == 4:
            record.string = name
        elif record.nameID == 6:
            record.string = name.replace(" ", "")
        elif record.nameID == 3:
            record.string = f"{name}; gll 2026"
        elif record.nameID == 2:
            record.string = "Regular"
    font.flavor = "woff2"
    font.save(out)
    cmap = font.getBestCmap()
    missing = [c for c in chars if ord(c) not in cmap]
    print(out, len(cmap), "missing:", "".join(missing))


build("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", MONO, "Glif Lab Mono", f"{OUT}/gll-mono.woff2")
build("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", BRAILLE, "Glif Lab Braille", f"{OUT}/gll-braille.woff2")
build(KANA_SRC, KANA, "Glif Lab Kana", f"{OUT}/gll-kana.woff2", inst={"wght": 700})
```

Uruchomienie: `python build.py <katalog wyjściowy> MPLUS1Code[wght].ttf`.

## Licencja DejaVu / Bitstream Vera (gll-mono, gll-braille)


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

## Licencja M PLUS 1 Code (gll-kana)

Copyright 2021 The M+ FONTS Project Authors (https://github.com/coz-m/MPLUS_FONTS)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
https://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
