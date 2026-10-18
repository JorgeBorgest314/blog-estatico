const ID_PATTERN = /^[\w-]{11}$/;

/** Accepts a plain id, a youtu.be link or a youtube.com watch/embed URL. */
export function getYouTubeId(input: string): string | undefined {
  const value = input.trim();
  if (ID_PATTERN.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.endsWith("youtu.be")) {
      const id = url.pathname.slice(1);
      return ID_PATTERN.test(id) ? id : undefined;
    }
    if (url.hostname.endsWith("youtube.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && ID_PATTERN.test(fromQuery)) return fromQuery;
      const fromPath = url.pathname.split("/").pop() ?? "";
      return ID_PATTERN.test(fromPath) ? fromPath : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/** Reads the start time from a YouTube URL (`?t=10636s`, `?start=90`, `?t=1h2m3s`). */
export function getYouTubeStart(input: string): number | undefined {
  try {
    const url = new URL(input.trim());
    const raw = url.searchParams.get("t") ?? url.searchParams.get("start");
    if (!raw) return undefined;

    if (/^\d+s?$/.test(raw)) return Number.parseInt(raw, 10);

    const parts = raw.match(/(\d+)([hms])/g);
    if (!parts) return undefined;

    const unit = { h: 3600, m: 60, s: 1 } as const;
    return parts.reduce((total, part) => {
      const value = Number.parseInt(part, 10);
      const suffix = part.slice(-1) as keyof typeof unit;
      return total + value * unit[suffix];
    }, 0);
  } catch {
    return undefined;
  }
}

/** Accepts seconds or a `H:MM:SS` / `MM:SS` timestamp. */
export function toSeconds(value: string | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === "number") return Math.max(0, Math.floor(value));

  const parts = value.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;

  return parts.reduce((total, part) => total * 60 + part, 0);
}
