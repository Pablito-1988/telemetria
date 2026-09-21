import { fetchOpenF1 } from "@/lib/f1/openf1";
import type { DriverPosition } from "@/types/openf1";

export async function getDriverPositions(
  sessionKey: number,
  driverNumber: number
): Promise<DriverPosition[]> {
  return fetchOpenF1<DriverPosition[]>("/position", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
}