import Image from "next/image";

export default function Home() {
  return (
    <section className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-.02em] leading-tight">
          Welcome to <span className="text-[#0070f3]">Habbitly</span>
        </h1>
        <p className="text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          The best place to track your habits
        </p> 
      </main>
    </section>
  );
}
