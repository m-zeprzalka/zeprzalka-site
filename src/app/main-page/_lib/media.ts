/**
 * `sizes` obrazów według siatki: kolumna treści (`--container-column`: 40 / 44 / 48 rem
 * od 1440 i 1680 px) i jej połowa (dwie kolumny galerii i kart). Przeglądarka nie
 * pobiera wtedy wersji szerszej niż kadr.
 */
export const COLUMN_SIZES =
  "(min-width: 105rem) 48rem, (min-width: 90rem) 44rem, (min-width: 48rem) 40rem, calc(100vw - 2.5rem)"

export const HALF_COLUMN_SIZES =
  "(min-width: 105rem) 24rem, (min-width: 90rem) 22rem, (min-width: 40rem) 20rem, 100vw"
