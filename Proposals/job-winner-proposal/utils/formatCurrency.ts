export default function formatCurrency(amount: number) {
  return `$${amount.toLocaleString()}`;
}
