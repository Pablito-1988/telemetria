import { Lap } from "@/types/openf1";
import { fetchOpenF1 } from "@/lib/f1/openf1";

export async function getDriverLaps(
  sessionKey: number,
  driverNumber: number
): Promise<Lap[]> {
  return fetchOpenF1<Lap[]>("/laps", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
}
