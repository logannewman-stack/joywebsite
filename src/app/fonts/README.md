# Fonts kept in the repository

`archivo-bold-wide.woff2` is the heading typeface: Archivo at weight 700 and width 112%, the only
cut of Archivo the site uses (`.display` in `src/app/globals.css`). It was cut from the Archivo
variable font (version 2.001, from github.com/google/fonts, `ofl/archivo`) with fonttools:

```bash
python3 -m fontTools.varLib.instancer "Archivo[wdth,wght].ttf" wght=700 wdth=112 -o Archivo-700-112.ttf
```

```bash
python3 -m fontTools.subset Archivo-700-112.ttf --layout-features='*' --flavor=woff2 \
  --output-file=archivo-bold-wide.woff2 \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"
```

The character list is Google Fonts' Latin and extended Latin sets, so names with accents are
covered. A heading set at any other weight or width needs a new cut (or the variable font again,
`Archivo({ axes: ["wdth"] })` from `next/font/google` in `src/app/layout.tsx`).

Archivo is licensed under the SIL Open Font License 1.1: `archivo-OFL.txt`.

Body text (DM Sans) is loaded by `next/font/google` and needs no file here.
