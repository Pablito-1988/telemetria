import { NextRequest, NextResponse } from "next/server";
import { getDriverLaps } from "@/services/openf1/laps";

export async function GET(request: NextRequest) {
  try {
    const sessionKey = request.nextUrl.searchParams.get("session_key");
    const driverNumber = request.nextUrl.searchParams.get("driver_number");

    if (!sessionKey) {
      return NextResponse.json(
        { error: "Falta el parámetro session_key" },
        { status: 400 }
      );
    }

    if (!driverNumber) {
      return NextResponse.json(
        { error: "Falta el parámetro driver_number" },
        { status: 400 }
      );
    }

    const laps = await getDriverLaps(Number(sessionKey), Number(driverNumber));

    return NextResponse.json(laps);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron obtener las vueltas" },
      { status: 500 }
    );
  }
}
