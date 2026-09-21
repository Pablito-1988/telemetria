import { NextRequest, NextResponse } from "next/server";
import { getDrivers } from "@/services/openf1/drivers";

export async function GET(request: NextRequest) {
  try {
    const sessionKey = request.nextUrl.searchParams.get(
      "session_key"
    );

    if (!sessionKey) {
      return NextResponse.json(
        { error: "Falta session_key" },
        { status: 400 }
      );
    }

    const drivers = await getDrivers(Number(sessionKey));

    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudieron obtener los pilotos" },
      { status: 500 }
    );
  }
}