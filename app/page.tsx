import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-red-400">
          Telemetria
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Dashboard de clasificación de Fórmula 1
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-300">
          Consulta la sesión de quali disponible en OpenF1 y revisa la información
          de pilotos y vueltas de manera estructurada.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/qualifying"
            className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Ver quali
          </Link>
        </div>
      </div>
    </main>
  );
}
