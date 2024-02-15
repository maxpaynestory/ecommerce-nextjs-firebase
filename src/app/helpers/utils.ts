export const displayMoneyInPKR = (n: number) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  });
  return format.format(n);
};
