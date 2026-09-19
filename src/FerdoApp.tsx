import React, { useEffect, useMemo, useState } from "react";
import {
  Tractor,
  Truck,
  Warehouse,
  MapPin,
  Star,
  Phone,
  X,
  Check,
  CheckCircle2,
  ChevronRight,
  Search,
  Calendar,
  Users,
  Moon,
  Sun,
  Sprout,
  Gauge,
  PackageCheck,
  Loader2,
} from "lucide-react";

/* ============================================================================
   FERDO — Agrotexnika va Logistika platformasi
   Telegram Mini App prototipi (taqdimot uchun, backendsiz, Mock Data bilan)
   ----------------------------------------------------------------------------
   O'rnatish:
     npm install lucide-react
     (Tailwind CSS loyihada allaqachon sozlangan bo'lishi kerak)

   Ishlatish:
     import FerdoApp from "./FerdoApp";
     export default function Page() { return <FerdoApp />; }

   Eslatma: bu komponent Tailwind'ning standart utility klasslaridan
   foydalanadi (dark: prefiksisiz) — shuning uchun tailwind.config.js'da
   qo'shimcha sozlash shart emas, darhol ishlaydi.
============================================================================ */

/* ---------------------------------- Types --------------------------------- */

interface Machine {
  id: string;
  name: string;
  type: "traktor" | "kombayn";
  spec: string;
  pricePerDay: number;
  available: boolean;
}

interface DriverOffer {
  id: string;
  driverName: string;
  vehicleModel: string;
  rating: number;
  ratingsCount: number;
  phone: string;
  basePrice: number;
  etaLabel: string;
}

interface WarehouseItem {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  totalCapacity: number;
  freeCapacity: number;
}

/* -------------------------------- Mock data -------------------------------- */

const MACHINES: Machine[] = [
  {
    id: "m1",
    name: "John Deere 8310R",
    type: "traktor",
    spec: "310 ot kuchi · Universal",
    pricePerDay: 850000,
    available: true,
  },
  {
    id: "m2",
    name: "Case IH 7250",
    type: "kombayn",
    spec: "Bunker hajmi 10.5 m³",
    pricePerDay: 1450000,
    available: true,
  },
  {
    id: "m3",
    name: "MTZ Belarus 892",
    type: "traktor",
    spec: "92 ot kuchi · Yengil ishlar",
    pricePerDay: 420000,
    available: true,
  },
  {
    id: "m4",
    name: "New Holland CR8.90",
    type: "kombayn",
    spec: "Yuqori unumdorlik · GPS",
    pricePerDay: 1680000,
    available: false,
  },
  {
    id: "m5",
    name: "Kirovets K-744",
    type: "traktor",
    spec: "428 ot kuchi · Og'ir tuproq",
    pricePerDay: 690000,
    available: true,
  },
];

const DRIVER_POOL: DriverOffer[] = [
  {
    id: "d1",
    driverName: "Aziz Karimov",
    vehicleModel: "Isuzu Forward",
    rating: 4.8,
    ratingsCount: 126,
    phone: "+998 90 123 45 67",
    basePrice: 2200000,
    etaLabel: "Ertaga ertalab",
  },
  {
    id: "d2",
    driverName: "Bahrom Yusupov",
    vehicleModel: "KamAZ 65115",
    rating: 4.6,
    ratingsCount: 84,
    phone: "+998 91 234 56 78",
    basePrice: 1950000,
    etaLabel: "Bugun kechqurun",
  },
  {
    id: "d3",
    driverName: "Sardor Aliyev",
    vehicleModel: "MAN TGS",
    rating: 4.9,
    ratingsCount: 201,
    phone: "+998 93 345 67 89",
    basePrice: 2650000,
    etaLabel: "Ertaga, 10:00",
  },
  {
    id: "d4",
    driverName: "Jasur Nematov",
    vehicleModel: "Howo Sinotruk",
    rating: 4.5,
    ratingsCount: 57,
    phone: "+998 94 456 78 90",
    basePrice: 1750000,
    etaLabel: "2 kun ichida",
  },
];

const INITIAL_WAREHOUSES: WarehouseItem[] = [
  {
    id: "w1",
    name: "FERDO Sklad-1",
    region: "Toshkent v., Sergeli tumani",
    distanceKm: 3.2,
    totalCapacity: 500,
    freeCapacity: 150,
  },
  {
    id: "w2",
    name: "Qibray agro-ombori",
    region: "Toshkent v., Qibray tumani",
    distanceKm: 7.8,
    totalCapacity: 300,
    freeCapacity: 80,
  },
  {
    id: "w3",
    name: "Zangiota saqlash markazi",
    region: "Toshkent v., Zangiota tumani",
    distanceKm: 12.5,
    totalCapacity: 600,
    freeCapacity: 220,
  },
  {
    id: "w4",
    name: "Chirchiq don ombori",
    region: "Toshkent v., Chirchiq shahri",
    distanceKm: 18,
    totalCapacity: 250,
    freeCapacity: 40,
  },
];

const DRIVER_FEE_PER_DAY = 180000;

/* -------------------------------- Utilities -------------------------------- */

function formatSum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

/* --------------------------------- Theming --------------------------------- */

const LIGHT = {
  appBg: "bg-[#F6F4EC]",
  text: "text-[#1C2B22]",
  subtext: "text-[#69766B]",
  faint: "text-[#8B9690]",
  card: "bg-white",
  cardBorder: "border-[#E7E2D4]",
  inputBg: "bg-[#F0ECE0]",
  navBg: "bg-white/90",
  navBorder: "border-[#E7E2D4]",
  chip: "bg-[#EFEAD9]",
  divider: "border-[#EDE8DA]",
};

const DARK = {
  appBg: "bg-[#12170F]",
  text: "text-[#F2F3ED]",
  subtext: "text-[#9EAC9B]",
  faint: "text-[#71806E]",
  card: "bg-[#1A2117]",
  cardBorder: "border-[#2A3426]",
  inputBg: "bg-[#212B1D]",
  navBg: "bg-[#12170F]/92",
  navBorder: "border-[#2A3426]",
  chip: "bg-[#233020]",
  divider: "border-[#232D1F]",
};

type Theme = typeof LIGHT;

const BRAND_GREEN = "#2E6B3E";
const BRAND_GREEN_DARK = "#25552F";
const BRAND_AMBER = "#E1A13B";
const BRAND_SOIL = "#96693F";

const injectedStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes ferdoFadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ferdoSlideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes ferdoSheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
  @keyframes ferdoBump { 0% { transform: scale(1) } 35% { transform: scale(1.06) } 100% { transform: scale(1) } }
  @media (prefers-reduced-motion: reduce) {
    .ferdo-anim, .ferdo-anim * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  }
`;

/* ------------------------------ Small elements ------------------------------ */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? BRAND_GREEN : "#B9C2B4" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: BRAND_AMBER }}>
      <Star size={14} fill={BRAND_AMBER} strokeWidth={0} />
      {rating.toFixed(1)}
    </span>
  );
}

function SheetModal({
  onClose,
  children,
  t,
}: {
  onClose: () => void;
  children: React.ReactNode;
  t: Theme;
}) {
  return (
    <div className="ferdo-anim fixed inset-0 z-50 flex items-end justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        style={{ animation: "ferdoFadeIn 0.2s ease-out" }}
      />
      <div
        className={`relative w-full max-w-md rounded-t-[28px] border-t ${t.cardBorder} ${t.card} px-5 pb-6 pt-3 max-h-[88vh] overflow-y-auto`}
        style={{ animation: "ferdoSheetUp 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className={`mx-auto mb-3 h-1.5 w-10 rounded-full ${t.chip}`} />
        {children}
      </div>
    </div>
  );
}

function Toast({ message, t }: { message: string; t: Theme }) {
  return (
    <div
      className="ferdo-anim fixed left-1/2 top-4 z-[60] -translate-x-1/2"
      style={{ animation: "ferdoSlideUp 0.25s ease-out" }}
    >
      <div className={`flex items-center gap-2 rounded-2xl border ${t.cardBorder} ${t.card} px-4 py-3 shadow-lg`}>
        <CheckCircle2 size={18} color={BRAND_GREEN} />
        <span className={`text-sm font-medium ${t.text}`}>{message}</span>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  t,
}: {
  title: string;
  subtitle: string;
  t: Theme;
}) {
  return (
    <div className="px-5 pb-4 pt-1">
      <h1 className={`text-2xl font-bold ${t.text}`}>{title}</h1>
      <p className={`mt-1 text-sm ${t.subtext}`}>{subtitle}</p>
    </div>
  );
}

/* ------------------------------- Machine visual ------------------------------ */

function MachineVisual({ type, available }: { type: Machine["type"]; available: boolean }) {
  const isTraktor = type === "traktor";
  const gradient = isTraktor
    ? "linear-gradient(135deg, #3B7A48 0%, #2A5B36 100%)"
    : "linear-gradient(135deg, #D99A3D 0%, #B87B2A 100%)";
  return (
    <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-2xl" style={{ backgroundImage: gradient }}>
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-black/10" />
      <Tractor size={54} color="white" strokeWidth={1.5} />
      <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {isTraktor ? "Traktor" : "Kombayn"}
      </span>
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1C2B22]">Band qilingan</span>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Page 1 --------------------------------- */

function RentalPage({ t, showToast }: { t: Theme; showToast: (m: string) => void }) {
  const [selected, setSelected] = useState<Machine | null>(null);
  const [days, setDays] = useState(1);
  const [withDriver, setWithDriver] = useState(false);
  const [bump, setBump] = useState(false);

  const total = useMemo(() => {
    if (!selected) return 0;
    return selected.pricePerDay * days + (withDriver ? DRIVER_FEE_PER_DAY * days : 0);
  }, [selected, days, withDriver]);

  useEffect(() => {
    if (!selected) return;
    setBump(true);
    const tmr = window.setTimeout(() => setBump(false), 260);
    return () => window.clearTimeout(tmr);
  }, [total, selected]);

  const openMachine = (m: Machine) => {
    if (!m.available) return;
    setSelected(m);
    setDays(1);
    setWithDriver(false);
  };

  return (
    <div>
      <SectionHeader title="Texnika ijarasi" subtitle="Traktor va kombaynlarni kuniga ijaraga oling" t={t} />
      <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2">
        {MACHINES.map((m) => (
          <button
            key={m.id}
            onClick={() => openMachine(m)}
            className={`text-left rounded-2xl border ${t.cardBorder} ${t.card} p-3 transition-transform active:scale-[0.98] ${
              !m.available ? "opacity-70" : ""
            }`}
          >
            <MachineVisual type={m.type} available={m.available} />
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <h3 className={`text-base font-semibold ${t.text}`}>{m.name}</h3>
                <p className={`mt-0.5 text-xs ${t.subtext}`}>{m.spec}</p>
              </div>
              <ChevronRight size={18} className={t.faint} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-bold" style={{ color: BRAND_GREEN }}>
                {formatSum(m.pricePerDay)}
              </span>
              <span className={`text-xs ${t.faint}`}>/ kun</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <SheetModal t={t} onClose={() => setSelected(null)}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-bold ${t.text}`}>{selected.name}</h2>
              <p className={`mt-0.5 text-sm ${t.subtext}`}>{selected.spec}</p>
            </div>
            <button onClick={() => setSelected(null)} className={`rounded-full p-1.5 ${t.chip}`} aria-label="Yopish">
              <X size={18} className={t.text} />
            </button>
          </div>

          <div className="mt-4">
            <MachineVisual type={selected.type} available={selected.available} />
          </div>

          <div className="mt-5">
            <label className={`mb-2 block text-sm font-medium ${t.text}`}>Necha kunga olasiz?</label>
            <div className={`flex items-center gap-3 rounded-2xl border ${t.cardBorder} ${t.inputBg} px-4 py-3`}>
              <Calendar size={18} className={t.faint} />
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                className={`w-full bg-transparent text-base font-semibold outline-none ${t.text}`}
              />
              <span className={`text-sm ${t.faint}`}>kun</span>
            </div>
          </div>

          <div className={`mt-4 flex items-center justify-between rounded-2xl border ${t.cardBorder} px-4 py-3`}>
            <div className="flex items-center gap-2.5">
              <Users size={18} className={t.faint} />
              <div>
                <p className={`text-sm font-medium ${t.text}`}>Haydovchi bilan</p>
                <p className={`text-xs ${t.faint}`}>+{formatSum(DRIVER_FEE_PER_DAY)} / kun</p>
              </div>
            </div>
            <Toggle checked={withDriver} onChange={setWithDriver} />
          </div>

          <div className={`mt-5 space-y-1.5 border-t ${t.divider} pt-4`}>
            <div className={`flex items-center justify-between text-sm ${t.subtext}`}>
              <span>
                Texnika ({days} kun × {formatSum(selected.pricePerDay)})
              </span>
              <span>{formatSum(selected.pricePerDay * days)}</span>
            </div>
            {withDriver && (
              <div className={`flex items-center justify-between text-sm ${t.subtext}`}>
                <span>Haydovchi xizmati ({days} kun)</span>
                <span>{formatSum(DRIVER_FEE_PER_DAY * days)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1.5">
              <span className={`text-sm font-medium ${t.text}`}>Jami narx</span>
              <span
                className="text-xl font-extrabold"
                style={{
                  color: BRAND_GREEN,
                  display: "inline-block",
                  animation: bump ? "ferdoBump 0.26s ease-out" : undefined,
                }}
              >
                {formatSum(total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              showToast(`Buyurtma qabul qilindi — ${selected.name}, ${days} kun`);
              setSelected(null);
            }}
            className="mt-5 w-full rounded-2xl py-3.5 text-center text-base font-semibold text-white transition-opacity active:opacity-90"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            Buyurtma berish
          </button>
        </SheetModal>
      )}
    </div>
  );
}

/* --------------------------------- Page 2 --------------------------------- */

function LogisticsPage({ t, showToast }: { t: Theme; showToast: (m: string) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DriverOffer[] | null>(null);
  const [contact, setContact] = useState<DriverOffer | null>(null);

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      showToast("Iltimos, «Qayerdan» va «Qayerga» maydonlarini to'ldiring");
      return;
    }
    setLoading(true);
    setResults(null);
    const tonnage = Number(weight) || 1;
    window.setTimeout(() => {
      const priced = DRIVER_POOL.map((d) => ({
        ...d,
        basePrice: Math.round((d.basePrice + tonnage * 15000) / 1000) * 1000,
      }));
      setResults(priced);
      setLoading(false);
    }, 650);
  };

  return (
    <div>
      <SectionHeader title="Logistika" subtitle="Yukingiz uchun eng yaqin haydovchini toping" t={t} />

      <div className="px-5">
        <div className={`space-y-3 rounded-2xl border ${t.cardBorder} ${t.card} p-4`}>
          <div className={`flex items-center gap-3 rounded-xl ${t.inputBg} px-3.5 py-3`}>
            <MapPin size={18} style={{ color: BRAND_GREEN }} />
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Qayerdan (masalan: Toshkent)"
              className={`w-full bg-transparent text-sm outline-none ${t.text}`}
            />
          </div>
          <div className={`flex items-center gap-3 rounded-xl ${t.inputBg} px-3.5 py-3`}>
            <MapPin size={18} style={{ color: BRAND_AMBER }} />
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Qayerga (masalan: Andijon)"
              className={`w-full bg-transparent text-sm outline-none ${t.text}`}
            />
          </div>
          <div className={`flex items-center gap-3 rounded-xl ${t.inputBg} px-3.5 py-3`}>
            <PackageCheck size={18} className={t.faint} />
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="Yuk vazni (tonna)"
              inputMode="decimal"
              className={`w-full bg-transparent text-sm outline-none ${t.text}`}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white active:opacity-90"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}
            {loading ? "Qidirilmoqda..." : "Qidirish"}
          </button>
        </div>
      </div>

      <div className="mt-5 px-5">
        {loading &&
          [0, 1, 2].map((i) => <div key={i} className={`mb-3 h-24 animate-pulse rounded-2xl border ${t.cardBorder} ${t.chip}`} />)}

        {!loading && results && (
          <div>
            <p className={`mb-3 text-xs font-medium uppercase tracking-wide ${t.faint}`}>{results.length} ta haydovchi topildi</p>
            <div className="space-y-3">
              {results.map((d, i) => (
                <div
                  key={d.id}
                  className={`ferdo-anim rounded-2xl border ${t.cardBorder} ${t.card} p-4`}
                  style={{ animation: `ferdoSlideUp 0.35s ease-out both`, animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: BRAND_SOIL + "22" }}>
                        <Truck size={20} style={{ color: BRAND_SOIL }} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold ${t.text}`}>{d.vehicleModel}</h3>
                        <p className={`text-xs ${t.subtext}`}>{d.driverName}</p>
                      </div>
                    </div>
                    <Stars rating={d.rating} />
                  </div>
                  <div className={`mt-3 flex items-center justify-between border-t ${t.divider} pt-3`}>
                    <div>
                      <p className={`text-xs ${t.faint}`}>{d.etaLabel}</p>
                      <p className="text-base font-bold" style={{ color: BRAND_GREEN }}>
                        {formatSum(d.basePrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => setContact(d)}
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white active:opacity-90"
                      style={{ backgroundColor: BRAND_GREEN_DARK }}
                    >
                      Bog'lanish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !results && (
          <div className={`rounded-2xl border border-dashed ${t.cardBorder} px-5 py-10 text-center`}>
            <Truck size={28} className={`mx-auto ${t.faint}`} />
            <p className={`mt-3 text-sm ${t.subtext}`}>Yo'nalishni kiritib qidiring — mos haydovchilar shu yerda chiqadi</p>
          </div>
        )}
      </div>

      {contact && (
        <SheetModal t={t} onClose={() => setContact(null)}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${t.text}`}>{contact.driverName}</h2>
            <button onClick={() => setContact(null)} className={`rounded-full p-1.5 ${t.chip}`}>
              <X size={18} className={t.text} />
            </button>
          </div>
          <p className={`mt-1 text-sm ${t.subtext}`}>
            {contact.vehicleModel} · <Stars rating={contact.rating} /> ({contact.ratingsCount} baho)
          </p>
          <div className={`mt-4 flex items-center gap-3 rounded-2xl ${t.inputBg} px-4 py-3.5`}>
            <Phone size={18} style={{ color: BRAND_GREEN }} />
            <span className={`text-base font-semibold ${t.text}`}>{contact.phone}</span>
          </div>
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            onClick={() => showToast(`${contact.driverName} bilan bog'lanmoqda...`)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold text-white active:opacity-90"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            <Phone size={18} /> Qo'ng'iroq qilish
          </a>
        </SheetModal>
      )}
    </div>
  );
}

/* --------------------------------- Page 3 --------------------------------- */

function WarehousePage({ t, showToast }: { t: Theme; showToast: (m: string) => void }) {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
  const [target, setTarget] = useState<WarehouseItem | null>(null);
  const [tonnage, setTonnage] = useState(10);

  const sorted = useMemo(() => [...warehouses].sort((a, b) => a.distanceKm - b.distanceKm), [warehouses]);

  const openBooking = (w: WarehouseItem) => {
    setTarget(w);
    setTonnage(Math.min(10, w.freeCapacity));
  };

  const confirmBooking = () => {
    if (!target) return;
    setWarehouses((prev) =>
      prev.map((w) => (w.id === target.id ? { ...w, freeCapacity: Math.max(0, w.freeCapacity - tonnage) } : w))
    );
    showToast(`${target.name} — ${tonnage} tonnaga bron qilindi`);
    setTarget(null);
  };

  return (
    <div>
      <SectionHeader title="Omborxona" subtitle="Sizga eng yaqin omborlar" t={t} />
      <div className="space-y-3 px-5">
        {sorted.map((w) => {
          const pct = Math.round((w.freeCapacity / w.totalCapacity) * 100);
          return (
            <div key={w.id} className={`rounded-2xl border ${t.cardBorder} ${t.card} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: BRAND_GREEN + "1F" }}>
                    <Warehouse size={20} style={{ color: BRAND_GREEN }} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${t.text}`}>{w.name}</h3>
                    <p className={`text-xs ${t.subtext}`}>{w.region}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${t.faint}`}>
                  <MapPin size={13} /> {w.distanceKm} km
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={t.subtext}>Bo'sh joy</span>
                  <span className={`font-semibold ${t.text}`}>
                    {w.freeCapacity} / {w.totalCapacity} tonna
                  </span>
                </div>
                <div className={`mt-1.5 h-2 w-full overflow-hidden rounded-full ${t.chip}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: pct < 25 ? BRAND_SOIL : BRAND_GREEN }}
                  />
                </div>
              </div>

              <button
                onClick={() => openBooking(w)}
                disabled={w.freeCapacity <= 0}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-40 active:opacity-90"
                style={{ backgroundColor: BRAND_GREEN }}
              >
                <Gauge size={16} />
                {w.freeCapacity <= 0 ? "Joy yo'q" : "Bron qilish"}
              </button>
            </div>
          );
        })}
      </div>

      {target && (
        <SheetModal t={t} onClose={() => setTarget(null)}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${t.text}`}>{target.name}</h2>
            <button onClick={() => setTarget(null)} className={`rounded-full p-1.5 ${t.chip}`}>
              <X size={18} className={t.text} />
            </button>
          </div>
          <p className={`mt-1 text-sm ${t.subtext}`}>
            {target.region} · {target.distanceKm} km
          </p>

          <div className="mt-4">
            <label className={`mb-2 block text-sm font-medium ${t.text}`}>Necha tonna joy bron qilasiz?</label>
            <div className={`flex items-center gap-3 rounded-2xl border ${t.cardBorder} ${t.inputBg} px-4 py-3`}>
              <input
                type="number"
                min={1}
                max={target.freeCapacity}
                value={tonnage}
                onChange={(e) => setTonnage(Math.max(1, Math.min(target.freeCapacity, Number(e.target.value) || 1)))}
                className={`w-full bg-transparent text-base font-semibold outline-none ${t.text}`}
              />
              <span className={`text-sm ${t.faint}`}>tonna / {target.freeCapacity} bo'sh</span>
            </div>
          </div>

          <button
            onClick={confirmBooking}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold text-white active:opacity-90"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            <Check size={18} /> Bronni tasdiqlash
          </button>
        </SheetModal>
      )}
    </div>
  );
}

/* -------------------------------- Bottom nav -------------------------------- */

type Tab = "rental" | "logistics" | "warehouse";

function BottomNav({ tab, setTab, t }: { tab: Tab; setTab: (t: Tab) => void; t: Theme }) {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "rental", label: "Texnika", icon: <Tractor size={20} /> },
    { id: "logistics", label: "Logistika", icon: <Truck size={20} /> },
    { id: "warehouse", label: "Ombor", icon: <Warehouse size={20} /> },
  ];
  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-center justify-around border-t ${t.navBorder} ${t.navBg} px-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 backdrop-blur-md`}
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button key={item.id} onClick={() => setTab(item.id)} className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors">
            <span
              className="flex h-9 w-14 items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: active ? BRAND_GREEN : "transparent", color: active ? "white" : undefined }}
            >
              <span className={active ? "" : t.faint}>{item.icon}</span>
            </span>
            <span className={`text-[11px] font-medium ${active ? "" : t.faint}`} style={active ? { color: BRAND_GREEN } : undefined}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------------------------- Top bar ---------------------------------- */

function TopBar({ dark, setDark, t }: { dark: boolean; setDark: (v: boolean) => void; t: Theme }) {
  return (
    <div
      className={`sticky top-0 z-30 flex items-center justify-between border-b ${t.navBorder} ${t.navBg} px-5 pb-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] backdrop-blur-md`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl text-white" style={{ backgroundColor: BRAND_GREEN }}>
          <Sprout size={17} />
        </span>
        <span className={`text-base font-extrabold tracking-tight ${t.text}`}>FERDO</span>
      </div>
      <button onClick={() => setDark(!dark)} className={`flex h-8 w-8 items-center justify-center rounded-full ${t.chip}`} aria-label="Mavzuni almashtirish">
        {dark ? <Sun size={16} className={t.text} /> : <Moon size={16} className={t.text} />}
      </button>
    </div>
  );
}

/* ----------------------------------- App ----------------------------------- */

export default function FerdoApp() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>("rental");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      tg.ready?.();
      tg.expand?.();
      setDark(tg.colorScheme === "dark");
    } else if (typeof window !== "undefined" && window.matchMedia) {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const t = dark ? DARK : LIGHT;

  return (
    <div
      className={`mx-auto min-h-screen w-full max-w-md ${t.appBg} sm:my-4 sm:min-h-[812px] sm:rounded-[36px] sm:border sm:${t.cardBorder} sm:shadow-2xl`}
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{injectedStyle}</style>
      <TopBar dark={dark} setDark={setDark} t={t} />
      <main className="pb-28 pt-2">
        {tab === "rental" && <RentalPage t={t} showToast={showToast} />}
        {tab === "logistics" && <LogisticsPage t={t} showToast={showToast} />}
        {tab === "warehouse" && <WarehousePage t={t} showToast={showToast} />}
      </main>
      <BottomNav tab={tab} setTab={setTab} t={t} />
      {toast && <Toast message={toast} t={t} />}
    </div>
  );
}