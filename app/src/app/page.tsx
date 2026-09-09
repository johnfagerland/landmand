import AddressSearch from "@/components/quote/AddressSearch";
import RecentQuotes from "@/components/quote/RecentQuotes";
import { APP_NAME } from "@/lib/config";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
        <p className="text-zinc-600">
          Type the job address. We pull the lot lines from county records, you adjust the fence on aerial imagery,
          and the take-off prices it from your own price book.
        </p>
      </div>
      <AddressSearch />
      <RecentQuotes />
      <p className="text-xs text-zinc-400">
        Imagery is USGS/USDA NAIP (public domain) and is shown for orientation only; measurements come from county
        lot lines, your on-map edits and USGS 3DEP elevation.
      </p>
    </main>
  );
}
