# Kroje „Glif” — pochodzenie i licencja

Cztery podzbiory dla wspólnego silnika glifów piaskownicy `/demo` serwisu zeprzalka.com (2026).
Służą wyłącznie do rysowania glifów (atlas canvasu/WebGL, dekodowanie liter, sygnet logo) —
każdy znak ma zawsze ten sam kształt i tę samą metrykę, bez pustych prostokątów i emoji z systemu.

| Plik | Źródło | Zawartość |
| --- | --- | --- |
| `gx-mono.woff2` („Glif Mono”) | DejaVu Sans Mono 2.37 | ASCII 0x20–0x7E, bloki U+2580–259F, linie ─│╱╲╳, znaki obecnego logo i rampy „sygnet”/„kropki”, które ten krój ma |
| `gx-symbols.woff2` („Glif Symbols”) | DejaVu Sans 2.37 | znaki logo i ramp, których DejaVu Sans Mono nie ma (stoi za „Glif Mono” w `font-family`) |
| `gx-braille.woff2` („Glif Braille”) | DejaVu Sans 2.37 | wzory Braille’a U+2800–28FF |
| `gx-math.woff2` („Glif Math”) | STIX Two Math 2.12 | znaki logo, których nie ma w DejaVu: ⍻⍼⍾⍿⎄⎅⎆⎌⎍⎎⎏, ⧬–⧹, ⧼–⧿, ⨃–⨋, ⨝⨞⨟ (stoi trzecia w `font-family`) |

Razem cztery kroje niosą **pełny zestaw znaków obecnego logo** (`src/components/layout/LogoGlyph.tsx`,
165 znaków, ze startowym „⨝”).

## Co zmieniono względem oryginałów

- Zostawiono wyłącznie znaki z listy w skrypcie niżej; usunięto hinting i cechy OpenType; WOFF2.
- **Zmieniono nazwy krojów** na „Glif Mono / Glif Symbols / Glif Braille / Glif Math” — licencja
  Bitstream Vera wymaga tego dla wersji zmodyfikowanych (bez słów „Bitstream” i „Vera”), a OFL
  zabrania zmodyfikowanym wersjom zastrzeżonej nazwy STIX („TM Math”).
- Tabela `name` zachowuje noty copyright (ID 0), tekst licencji (ID 13) i jej adres (ID 14).

## Jak odtworzyć pliki

fontTools 4.x (`pip install fonttools brotli`), DejaVu Sans Mono i DejaVu Sans 2.37
(`/usr/share/fonts/truetype/dejavu/`), `STIXTwoMath-Regular.ttf` z
https://github.com/google/fonts/tree/main/ofl/stixtwomath. Uruchomienie:
`python build.py <katalog wyjściowy> STIXTwoMath-Regular.ttf`.

```python
"""Podzbiory krojów wspólnego silnika glifów (gx) — DejaVu 2.37 (Bitstream Vera)."""
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

OUT = sys.argv[1]
# STIX Two Math 2.x (OFL 1.1) — znaki logo, których nie ma w DejaVu.
STIX_SRC = sys.argv[2]
MONO_SRC = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
SANS_SRC = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# Znaki obecnego logo serwisu (src/components/layout/LogoGlyph.tsx).
LOGO = "⍤⍨⍫⍮⍯⍰⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎈⎇⎋⎌⎍⎎⎏⎄⎅⎆⎊⎉⎂⎃⎀⎁⋇⋉⋊⋋⋌⋍⋎⋏⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿⌀⍂⍙⍚⍛⍜⍝⍞⍠⍡⍢⍣⍦⍧⍩⍪⍬⍭⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟"
# Rampy zestawów „sygnet” i „kropki” oraz znaki dekodowania tekstu.
EXTRA = "·∶⋆∴∗∷○◇⊙◎⊚⊕⊗◈◉●⌘⎈⎉⎊⎋⊞⊠⊡⊟⊛❖◆⍟⌀⊜✕⨯"
ASCII = "".join(chr(c) for c in range(0x20, 0x7F))
BLOCKS = "".join(chr(c) for c in range(0x2580, 0x25A0))
LINES = "─│╱╲╳"
BRAILLE = "  " + "".join(chr(c) for c in range(0x2800, 0x2900))

mono_cmap = TTFont(MONO_SRC).getBestCmap()
sans_cmap = TTFont(SANS_SRC).getBestCmap()
symbols = sorted(set(LOGO + EXTRA))
in_mono = [c for c in symbols if ord(c) in mono_cmap]
in_sans = [c for c in symbols if ord(c) not in mono_cmap and ord(c) in sans_cmap]
nowhere = [c for c in symbols if ord(c) not in mono_cmap and ord(c) not in sans_cmap]


def build(src, chars, name, out):
    font = TTFont(src)
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
        if record.nameID in (1, 4, 16):
            record.string = name
        elif record.nameID == 6:
            record.string = name.replace(" ", "")
        elif record.nameID == 3:
            record.string = f"{name}; gx 2026"
        elif record.nameID == 2:
            record.string = "Regular"
    font.flavor = "woff2"
    font.save(out)
    cmap = font.getBestCmap()
    print(out, len(cmap), "missing:", "".join(c for c in chars if ord(c) not in cmap))


build(MONO_SRC, sorted(set(ASCII + BLOCKS + LINES + "".join(in_mono))), "Glif Mono", f"{OUT}/gx-mono.woff2")
build(SANS_SRC, " " + "".join(in_sans), "Glif Symbols", f"{OUT}/gx-symbols.woff2")
build(SANS_SRC, BRAILLE, "Glif Braille", f"{OUT}/gx-braille.woff2")
# Reszta znaków logo z STIX Two Math (OFL: wersja zmodyfikowana — bez zastrzeżonej nazwy „TM Math”).
build(STIX_SRC, " " + "".join(nowhere), "Glif Math", f"{OUT}/gx-math.woff2")
```

## Licencja DejaVu / Bitstream Vera


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

## Licencja STIX Two Math (gx-math) — SIL Open Font License 1.1

```text
Copyright 2001-2021 The STIX Fonts Project Authors (https://github.com/stipub/stixfonts), with Reserved Font Name "TM Math". STIX Fonts™ is a trademark of The Institute of Electrical and Electronics Engineers, Inc.

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL

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
```
