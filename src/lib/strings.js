export function capitalize(text) {
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function createBlendString(blend) {
  return blend
    ? `${blend.bottleCount} x (${blend.blend
        .map(({ flavor, shots }) => `${shots} ${flavor}`)
        .join(" - ")})`
    : "";
}

export function createPromoBlendString(blend) {
  return blend
    ? blend
        .map(
          ({ flavor, shots }) =>
            `${blend.length === 3 ? "" : `${shots} `}${flavor}`
        )
        .join(" - ")
    : "";
}
