export function formatNumber(num) {
  let num2;

  if (typeof num === "string") {
    num2 = parseInt(num.replace(/,/g, ""), 10);
  } else {
    num2 = num;
  }

  if (num2 < 1000) {
    return num2.toString();
  } else if (num2 < 1_000_000) {
    return (num2 / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (num2 < 1_000_000_000) {
    return (num2 / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
}
