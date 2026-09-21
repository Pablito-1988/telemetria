import { Session } from "@/types/openf1";
import { fetchOpenF1 } from "@/lib/f1/openf1";

export async function getQualifyingSessions(
  year?: number,
  country?: string
): Promise<Session[]> {
  return fetchOpenF1<Session[]>("/sessions", {
    year,
    country_name: country,
    session_name: "Qualifying",
  });
}

export async function getQualifyingSession(
  year: number,
  country: string
): Promise<Session | null> {
  const sessions = await getQualifyingSessions(year, country);

  return sessions[0] ?? null;
}
