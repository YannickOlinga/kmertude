export function cn(
  ...inputs: Array<string | number | boolean | null | undefined>
): string {
  return inputs
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ");
}

