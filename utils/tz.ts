import BigNumber from "bignumber.js";
import bs58check from "bs58check";
import dayjs from "dayjs";

export function checkAddress(address: string) {
  if (address === undefined && address == null) return false;
  if (typeof address !== "string") return false;
  if (address.length !== 36 && !address.startsWith("KT")) return false;
  try {
    if (bs58check.decode(address) === undefined) return false;
  } catch (e) {
    return false;
  }
  return true;
}

export function checkOperation(operation: string) {
  if (operation === undefined && operation == null) return false;
  if (typeof operation !== "string") return false;
  if (operation.length != 51 && !operation.startsWith("o")) return false;
  if (bs58check.decode(operation) === undefined) return false;
  return true;
}

export function checkKeyHash(keyhash: string) {
  if (keyhash === undefined && keyhash == null) return false;
  if (typeof keyhash !== "string") return false;
  if (keyhash.length != 54 && !keyhash.startsWith("expr")) return false;
  if (bs58check.decode(keyhash) === undefined) return false;
  return true;
}

export function shortcut(value: string, tail = 4) {
  if (!value) return "";

  let head = 0;
  if (value.startsWith("tz") || value.startsWith("KT")) {
    head = 3;
  } else if (value.startsWith("o")) {
    head = 1;
  } else if (value.startsWith("expr")) {
    head = 4;
  } else {
    return value;
  }
  return (
    `<span class="font-weight-light">${value.slice(0, head)}</span>` +
    `${value.slice(head, head + tail)}` +
    `<i class="v-icon notranslate mdi mdi-dots-horizontal" style="font-size: 16px;"></i>` +
    `${value.slice(value.length - tail)}`
  );
}

export function shortcutOnly(value: string, tail = 4) {
  if (!value) return "";

  let head = 0;
  if (value.startsWith("tz") || value.startsWith("KT")) {
    head = 7;
  } else if (value.startsWith("o")) {
    head = 1;
  } else if (value.startsWith("expr")) {
    head = 4;
  } else {
    return value;
  }
  return `${value.slice(0, head)}...${value.slice(-1 * tail)}`;
}

export function formatDatetime(
  timestamp: string | number | Date | dayjs.Dayjs | null | undefined,
  minDate = { val: 1, unit: "day" }
) {
  let d: any = dayjs(timestamp);
  if (timestamp) {
    if (d.year() < dayjs().year()) return d.format("D MMM'YY HH:mm");
    if (d.add(minDate.val, minDate.unit).isBefore(dayjs()))
      return d.format("D MMM'YY HH:mm");
    return d.fromNow();
  }
}

export function formatDate(
  timestamp: string | number | Date | dayjs.Dayjs | null | undefined
) {
  let d: any = dayjs(timestamp);
  if (timestamp) {
    if (d.year() < dayjs().year()) return d.format("D MMM'YY");
    if (d.add(1, "days").isBefore(dayjs())) return d.format("D MMM");
    return d.fromNow();
  }
}

export function plural(count: number, noun: any, suffix = "s") {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}

export function urlExtractBase58(url: string) {
  const matches = url.match(/\b(tz|KT|o|expr)[1-9A-HJ-NP-Za-km-z]{34,}\b/);
  if (matches && matches.length > 0) {
    return matches[0];
  }
}

export function numberToLocalizeString(
  number: BigNumber.Value,
  maximumFractionDigits: number
) {
  if (maximumFractionDigits >= 0 && maximumFractionDigits <= 20) {
    return number.toLocaleString(undefined, {
      maximumFractionDigits,
    });
  } else {
    const stringed = String(number);
    const intPart = stringed.substring(0, stringed.indexOf("."));
    if (maximumFractionDigits === 0) {
      return intPart;
    }
    return new BigNumber(number).precision(
      intPart.length + maximumFractionDigits
    );
  }
}

export function round(value: number, decimals: number) {
  if (decimals > 20) {
    return parseFloat(new BigNumber(value).toFixed(decimals));
  }
  return parseFloat((value / 10 ** decimals).toFixed(decimals));
}

export function isKT1Address(val: string) {
  return /^(KT)[1-9A-HJ-NP-Za-km-z]{34}$/.test(val);
}

export function isTzAddress(val: string) {
  return /^(tz)[1-9A-HJ-NP-Za-km-z]{34}$/.test(val);
}

export function isOperationHash(val: string) {
  return /^o[1-9A-HJ-NP-Za-km-z]{50}$/.test(val);
}

export function validateNat(value: string) {
  if (value.length == 0) {
    return "Nat field is required";
  }
  let nat = parseInt(value);
  if (nat < 0) {
    return "Nat must be positive";
  }
  if (value.length > 1 && value[0] === "0") {
    return "Nat can't starts from zero";
  }
  return true;
}

export let validationRules = {
  contract: [
    (v: string | any[]) =>
      (v && v.length == 36) ||
      "The length of the contract address is 36 characters",
    (v: any) =>
      isKT1Address(v) ||
      "In this field you should write the address of the contract. It begins with KT.",
  ],
  nat: [
    (v: string) => /^\d+$/.test(v) || "Only digits are allowed",
    (v: any) => validateNat(v),
  ],
  bytes: [
    (v: string | any[]) =>
      v.length % 2 == 0 || "The length of the byte string must be even",
    (v: string) => /^[0-9a-fA-F]*$/.test(v) || "Only 0-9 and a-f are allowed",
  ],
  address: [
    (v: string | any[]) =>
      (v && v.length == 36) || "The length of the address is 36 characters",
    (v: any) =>
      isTzAddress(v) ||
      isKT1Address(v) ||
      "In this field you should write the address",
  ],
};
