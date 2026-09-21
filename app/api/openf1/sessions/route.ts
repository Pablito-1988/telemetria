import { NextRequest, NextResponse } from "next/server";
import { getQualifyingSessions } from "@/services/openf1/sessions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const yearParam = searchParams.get("year");
    const country = searchParams.get("country_name") ?? undefined;
    const year = yearParam ? Number(yearParam) : undefined;

    const sessions = await getQualifyingSessions(year, country);

    if (!sessions.length) {
      return NextResponse.json(
        { error: "No se encontraron sesiones de qualifying" },
        { status: 404 }
      );
    }

    if (yearParam || country) {
      return NextResponse.json(sessions[0] ?? null);
    }

    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener la sesión" },
      { status: 500 }
    );
  }
}