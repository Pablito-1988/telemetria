import { NextRequest, NextResponse } from "next/server";
import { getMeetings } from "@/services/openf1/meetings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const country = searchParams.get("country_name") ?? undefined;

    const meetings = await getMeetings(year, country);

    return NextResponse.json(meetings);
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener la información del circuito" },
      { status: 500 }
    );
  }
}
