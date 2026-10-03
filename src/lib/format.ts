const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatMoney(value: number) {
  return euro.format(value);
}
