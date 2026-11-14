export type City = { id: string; bn: string; en: string; lat: number; lng: number };

export const CITIES: City[] = [
  { id: "dhaka", bn: "ঢাকা", en: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { id: "tangail", bn: "টাঙ্গাইল", en: "Tangail", lat: 24.2513, lng: 89.9167 },
  { id: "chattogram", bn: "চট্টগ্রাম", en: "Chattogram", lat: 22.3569, lng: 91.7832 },
  { id: "sylhet", bn: "সিলেট", en: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { id: "rajshahi", bn: "রাজশাহী", en: "Rajshahi", lat: 24.3745, lng: 88.6042 },
  { id: "khulna", bn: "খুলনা", en: "Khulna", lat: 22.8456, lng: 89.5403 },
  { id: "barishal", bn: "বরিশাল", en: "Barishal", lat: 22.701, lng: 90.3535 },
  { id: "rangpur", bn: "রংপুর", en: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { id: "mymensingh", bn: "ময়মনসিংহ", en: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { id: "cumilla", bn: "কুমিল্লা", en: "Cumilla", lat: 23.4607, lng: 91.1809 },
  { id: "gazipur", bn: "গাজীপুর", en: "Gazipur", lat: 23.9999, lng: 90.4203 },
  { id: "narayanganj", bn: "নারায়ণগঞ্জ", en: "Narayanganj", lat: 23.6238, lng: 90.5 },
  { id: "bogura", bn: "বগুড়া", en: "Bogura", lat: 24.8465, lng: 89.3773 },
  { id: "jashore", bn: "যশোর", en: "Jashore", lat: 23.1634, lng: 89.2182 },
  { id: "coxsbazar", bn: "কক্সবাজার", en: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
  { id: "dinajpur", bn: "দিনাজপুর", en: "Dinajpur", lat: 25.6279, lng: 88.6332 },
];

export const DEFAULT_CITY = CITIES[0];

export type Place = { name: string; lat: number; lng: number; cityId?: string };

export function cityToPlace(c: City): Place {
  return { name: c.bn, lat: c.lat, lng: c.lng, cityId: c.id };
}
