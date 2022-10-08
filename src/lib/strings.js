export function capitalize(text) {
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function createBlendString(mix) {
  return mix
    ? `${mix.bottleCount} x ${
        mix.nicotine != null ? `${mix.nicotine}mg ` : ""
      }${mix.name ? `${mix.name} ` : ""}(${mix.blend
        .map(({ flavor, shots }) => `${shots} ${flavor}`)
        .join(" - ")})`
    : "";
}

export function createDisplayBlendString(blend) {
  return blend
    ? blend
        .map(
          ({ flavor, shots }) =>
            `${blend.length === 3 ? "" : `${shots} `}${flavor}`
        )
        .join(" - ")
    : "";
}
