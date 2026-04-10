export function formatMalawiCurrency(amount: number): string {
  return `MK ${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-MW');
}
