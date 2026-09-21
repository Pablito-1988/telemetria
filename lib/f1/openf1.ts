const OPENF1_BASE_URL = "https://api.openf1.org/v1";

export type OpenF1QueryParams = Record<string, string | number | undefined | null>;

export async function fetchOpenF1<T>(
  endpoint: string,
  params: OpenF1QueryParams = {}
): Promise<T> {
  const url = new URL(`${OPENF1_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `OpenF1 request failed for ${endpoint}: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}
