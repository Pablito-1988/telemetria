import type { Driver, DriverPosition, Lap } from "@/types/openf1";

interface QualifyingTableProps {
  driver: Driver | null;
  laps: Lap[];
  positions: DriverPosition[];
}

const sectorStatusColors: Record<number, string> = {
  0: "bg-slate-600",
  2048: "bg-yellow-400",
  2049: "bg-emerald-400",
  2050: "bg-sky-400",
  2051: "bg-violet-400",
  2052: "bg-orange-400",
  2064: "bg-cyan-400",
  2068: "bg-red-400",
};

const sectorStatusLabels: Record<number, string> = {
  0: "No disponible",
  2048: "Sector amarillo",
  2049: "Sector verde",
  2050: "Sector azul",
  2051: "Sector morado",
  2052: "Sector naranja",
  2064: "Pit lane",
  2068: "Sector rojo",
};

function formatLapTime(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  const totalMilliseconds = Math.max(0, value * 1000);
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
    3,
    "0"
  )}`;
}

function getSectorColor(status: number | null | undefined) {
  if (status === null || status === undefined) {
    return "bg-slate-600";
  }

  return sectorStatusColors[status] ?? "bg-slate-500";
}

function getSectorLabel(status: number | null | undefined) {
  if (status === null || status === undefined) {
    return "No disponible";
  }

  return sectorStatusLabels[status] ?? `Estado ${status}`;
}

function getPositionAtLapEnd(
  lap: Lap,
  orderedPositions: DriverPosition[]
) {
  const lapStart = new Date(lap.date_start).getTime();

  if (Number.isNaN(lapStart)) {
    return null;
  }

  const lapEnd = lapStart + (lap.lap_duration ?? 0) * 1000;
  let positionAtLapEnd: DriverPosition | null = null;

  for (const position of orderedPositions) {
    const positionTime = new Date(position.date).getTime();

    if (positionTime <= lapEnd) {
      positionAtLapEnd = position;
      continue;
    }

    break;
  }

  return positionAtLapEnd;
}

function renderSectorCell(
  value: number | null,
  status: number | null | undefined,
  segments?: number[] | null
) {
  const segmentValues = segments && segments.length > 0 ? segments : status === undefined || status === null ? [] : [status];
  const label = getSectorLabel(status);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span>{formatLapTime(value)}</span>
      <div className="flex min-h-3 items-center gap-1" title={label} aria-label={label}>
        {segmentValues.length > 0 ? (
          segmentValues.map((segmentStatus, index) => (
            <span
              key={`${segmentStatus}-${index}`}
              className={`h-2.5 w-2.5 rounded-sm ${getSectorColor(segmentStatus)} shadow-sm ring-1 ring-white/10`}
              title={getSectorLabel(segmentStatus)}
            />
          ))
        ) : (
          <span className="h-2.5 w-12 rounded-full bg-slate-600 shadow-sm ring-1 ring-white/10" title={label} />
        )}
      </div>
    </div>
  );
}

export function QualifyingTable({ driver, laps, positions }: QualifyingTableProps) {
  if (!driver) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        No hay piloto seleccionado.
      </section>
    );
  }

  const orderedPositions = [...positions].sort(
    (first, second) =>
      new Date(first.date).getTime() - new Date(second.date).getTime()
  );
  const latestPosition = orderedPositions[orderedPositions.length - 1] ?? null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/30">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-6 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Piloto</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {driver.name_acronym} — {driver.full_name}
          </h2>
        </div>
        <div className="text-right text-sm text-slate-300">
          <p>{driver.team_name}</p>
          <p>#{driver.driver_number}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-400">
            Posición
          </p>
          <p className="text-2xl font-bold text-white">
            {latestPosition ? `P${latestPosition.position}` : "—"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-slate-300">
            <tr>
              <th className="px-6 py-3 font-medium">Vuelta</th>
              <th className="px-6 py-3 font-medium">Posición</th>
              <th className="px-6 py-3 font-medium">Tiempo total</th>
              <th className="px-6 py-3 font-medium">S1</th>
              <th className="px-6 py-3 font-medium">S2</th>
              <th className="px-6 py-3 font-medium">S3</th>
            </tr>
          </thead>
          <tbody>
            {laps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No hay vueltas disponibles para este piloto.
                </td>
              </tr>
            ) : (
              laps.map((lap) => {
                const positionAtLapEnd = getPositionAtLapEnd(lap, orderedPositions);

                return (
                <tr key={`${lap.driver_number}-${lap.lap_number}`} className="border-t border-slate-800">
                  <td className="px-6 py-3">{lap.lap_number}</td>
                  <td className="px-6 py-3 font-semibold text-white">
                    {positionAtLapEnd ? `P${positionAtLapEnd.position}` : "—"}
                  </td>
                  <td className="px-6 py-3">{formatLapTime(lap.lap_duration)}</td>
                  <td className="px-6 py-3">{renderSectorCell(lap.duration_sector_1, lap.sector_1_status, lap.segments_sector_1)}</td>
                  <td className="px-6 py-3">{renderSectorCell(lap.duration_sector_2, lap.sector_2_status, lap.segments_sector_2)}</td>
                  <td className="px-6 py-3">{renderSectorCell(lap.duration_sector_3, lap.sector_3_status, lap.segments_sector_3)}</td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
