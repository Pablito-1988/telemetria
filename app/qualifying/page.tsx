"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { QualifyingTable } from "@/components/qualifying/QualifyingTable";
import type {
  Driver,
  DriverPosition,
  Lap,
  Meeting,
  Session,
} from "@/types/openf1";

export default function QualifyingPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionKey, setSelectedSessionKey] = useState<number | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<number | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [positions, setPositions] = useState<DriverPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch("/api/openf1/sessions");

        if (!response.ok) {
          throw new Error("Error obteniendo las sesiones");
        }

        const sessionsData: Session[] = await response.json();

        if (!sessionsData.length) {
          throw new Error("No hay sesiones disponibles");
        }

        setSessions(sessionsData);
        setSelectedSessionKey(sessionsData[0].session_key);
      } catch {
        setError("No se pudieron obtener las sesiones");
      } finally {
        setLoading(false);
      }
    }

    void loadSessions();
  }, []);

  useEffect(() => {
    const selectedSessionData =
      sessions.find((item) => item.session_key === selectedSessionKey) ?? null;

    if (!selectedSessionData) {
      return;
    }

    const meetingYear = selectedSessionData.year;
    const meetingCountry = selectedSessionData.country_name;

    async function loadMeeting() {
      try {
        const response = await fetch(
          `/api/openf1/meetings?year=${meetingYear}&country_name=${encodeURIComponent(meetingCountry)}`
        );

        if (!response.ok) {
          throw new Error("Error obteniendo el circuito");
        }

        const meetingsData: Meeting[] = await response.json();
        setMeeting(meetingsData[0] ?? null);
      } catch {
        setMeeting(null);
      }
    }

    void loadMeeting();
  }, [selectedSessionKey, sessions]);

  useEffect(() => {
    if (!selectedSessionKey) {
      return;
    }

    async function loadSessionDrivers() {
      try {
        const response = await fetch(
          `/api/openf1/drivers?session_key=${selectedSessionKey}`
        );

        if (!response.ok) {
          throw new Error("Error obteniendo los pilotos");
        }

        const driversData: Driver[] = await response.json();
        setDrivers(driversData);
        setSelectedDriverNumber(driversData[0]?.driver_number ?? null);
      } catch {
        setDrivers([]);
        setSelectedDriverNumber(null);
      }
    }

    void loadSessionDrivers();
  }, [selectedSessionKey]);

  useEffect(() => {
    const selectedSessionData =
      sessions.find((item) => item.session_key === selectedSessionKey) ?? null;

    if (!selectedSessionData || selectedDriverNumber === null) {
      return;
    }

    const sessionKey = selectedSessionData.session_key;

    async function loadDriverData() {
      try {
        const query = `session_key=${sessionKey}&driver_number=${selectedDriverNumber}`;
        const [lapsResponse, positionsResponse] = await Promise.all([
          fetch(`/api/openf1/laps?${query}`),
          fetch(`/api/openf1/positions?${query}`),
        ]);

        if (!lapsResponse.ok || !positionsResponse.ok) {
          throw new Error("Error obteniendo las vueltas");
        }

        const [lapsData, positionsData] = await Promise.all([
          lapsResponse.json() as Promise<Lap[]>,
          positionsResponse.json() as Promise<DriverPosition[]>,
        ]);
        setLaps(lapsData);
        setPositions(positionsData);
      } catch {
        setLaps([]);
        setPositions([]);
      }
    }

    void loadDriverData();

    const isPageVisible = typeof document !== "undefined" && !document.hidden;

    if (!isPageVisible) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadDriverData();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sessions, selectedDriverNumber, selectedSessionKey]);

  const selectedSession =
    sessions.find((session) => session.session_key === selectedSessionKey) ?? null;

  const selectedDriver = drivers.find(
    (driver) => driver.driver_number === selectedDriverNumber
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-lg font-semibold">Cargando sesiones...</p>
        </div>
      </main>
    );
  }

  if (error || !selectedSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
        <div className="rounded-xl border border-red-500/30 bg-slate-900 p-8 text-center text-red-300">
          <p className="text-lg font-semibold">{error ?? "No se encontró la sesión."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">F1</p>
          <h1 className="text-3xl font-bold text-white">Quali</h1>

          <div className="mt-2">
            <label htmlFor="session-select" className="mb-2 block text-sm text-slate-300">
              Seleccionar sesión
            </label>
            <select
              id="session-select"
              value={selectedSessionKey ?? ""}
              onChange={(event) => {
                const nextSessionKey = Number(event.target.value);
                setMeeting(null);
                setSelectedSessionKey(nextSessionKey);
                setLaps([]);
                setPositions([]);
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 outline-none ring-0"
            >
              {sessions.map((session) => (
                <option key={session.session_key} value={session.session_key}>
                  {session.country_name} — {session.year}
                </option>
              ))}
            </select>
          </div>

          {meeting ? (
            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {meeting.circuit_image ? (
                  <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-2">
                    <Image
                      src={meeting.circuit_image}
                      alt={meeting.circuit_short_name}
                      width={80}
                      height={64}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Circuito</p>
                  <h2 className="text-xl font-semibold text-white">{meeting.meeting_name}</h2>
                  <p className="text-sm text-slate-300">
                    {meeting.location} · {meeting.circuit_short_name} · {meeting.country_name}
                  </p>
                  {meeting.country_flag ? (
                    <div className="mt-2 flex h-8 w-12 items-center justify-center overflow-hidden rounded-md bg-white/5 p-1">
                      <Image
                        src={meeting.country_flag}
                        alt={meeting.country_code}
                        width={48}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Tipo:</span> {meeting.circuit_type}
                </p>
                <p>
                  <span className="text-slate-400">País:</span> {meeting.country_code}
                </p>
              </div>
            </div>
          ) : null}
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Pilotos</h2>
          <div className="flex flex-wrap gap-3">
            {drivers.map((driver) => {
              const isSelected = driver.driver_number === selectedDriverNumber;

              return (
                <div key={driver.driver_number} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDriverNumber(driver.driver_number);
                      setLaps([]);
                      setPositions([]);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-red-500 bg-red-500/15 text-red-200"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
                    }`}
                  >
                    {driver.name_acronym} — {driver.team_name}
                  </button>
                  {driver.headshot_url ? (
                    <div className="flex h-12 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-1">
                      <Image
                        src={driver.headshot_url}
                        alt={driver.full_name}
                        width={40}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <QualifyingTable
          driver={selectedDriver ?? null}
          laps={laps}
          positions={positions}
        />
      </div>
    </main>
  );
}