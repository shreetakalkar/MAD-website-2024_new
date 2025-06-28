export function listOfPassNum(rangeString: string): string[] {
  const match = rangeString.match(/^([A-Z] )?(\d+)-([A-Z] )?(\d+)$/);

  if (!match) {
    throw new Error("Invalid range string");
  }

  const prefixStart = match[1] || "";
  const startStr = match[2];
  const prefixEnd = match[3] || "";
  const endStr = match[4];

  if (prefixStart !== prefixEnd) {
    throw new Error("Prefixes in the range string do not match");
  }

  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);

  if (isNaN(start) || isNaN(end) || start > end) {
    throw new Error("Invalid numeric range");
  }

  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(`${prefixStart}${i.toString().padStart(startStr.length, "0")}`);
  }

  return result;
}
