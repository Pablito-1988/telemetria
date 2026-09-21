import { Driver } from "@/types/openf1";
import { fetchOpenF1 } from "@/lib/f1/openf1";

export async function getDrivers(
  sessionKey: number
): Promise<Driver[]> {
  return fetchOpenF1<Driver[]>("/drivers", {
    session_key: sessionKey,
  });
}
