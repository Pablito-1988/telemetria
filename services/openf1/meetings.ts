import { Meeting } from "@/types/openf1";
import { fetchOpenF1 } from "@/lib/f1/openf1";

export async function getMeetings(
  year?: number,
  country?: string
): Promise<Meeting[]> {
  return fetchOpenF1<Meeting[]>("/meetings", {
    year,
    country_name: country,
  });
}
