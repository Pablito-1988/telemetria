import { NextRequest, NextResponse } from "next/server";
import { getDriverPositions } from "@/services/openf1/positions";

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

    const positions = await getDriverPositions(
      Number(sessionKey),
      Number(driverNumber)
    );

    return NextResponse.json(positions);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron obtener las posiciones" },
      { status: 500 }
    );
  }
}