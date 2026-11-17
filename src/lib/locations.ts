
export type City = {
  id: string;
  bn: string;
  en: string;
  lat: number;
  lng: number;
};

export const CITIES: City[] = [
  // ঢাকা বিভাগ
  { id: "dhaka", bn: "ঢাকা", en: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { id: "faridpur", bn: "ফরিদপুর", en: "Faridpur", lat: 23.6071, lng: 89.8429 },
  { id: "gazipur", bn: "গাজীপুর", en: "Gazipur", lat: 23.9999, lng: 90.4203 },
  { id: "gopalganj", bn: "গোপালগঞ্জ", en: "Gopalganj", lat: 23.0051, lng: 89.8266 },
  { id: "kishoreganj", bn: "কিশোরগঞ্জ", en: "Kishoreganj", lat: 24.4260, lng: 90.9821 },
  { id: "madaripur", bn: "মাদারীপুর", en: "Madaripur", lat: 23.1641, lng: 90.1897 },
  { id: "manikganj", bn: "মানিকগঞ্জ", en: "Manikganj", lat: 23.8617, lng: 90.0003 },
  { id: "munshiganj", bn: "মুন্সীগঞ্জ", en: "Munshiganj", lat: 23.5422, lng: 90.5305 },
  { id: "narayanganj", bn: "নারায়ণগঞ্জ", en: "Narayanganj", lat: 23.6238, lng: 90.5 },
  { id: "narsingdi", bn: "নরসিংদী", en: "Narsingdi", lat: 23.9322, lng: 90.7151 },
  { id: "rajbari", bn: "রাজবাড়ী", en: "Rajbari", lat: 23.7574, lng: 89.6445 },
  { id: "shariatpur", bn: "শরীয়তপুর", en: "Shariatpur", lat: 23.2423, lng: 90.4348 },
  { id: "tangail", bn: "টাঙ্গাইল", en: "Tangail", lat: 24.2513, lng: 89.9167 },

  // চট্টগ্রাম বিভাগ
  { id: "bandarban", bn: "বান্দরবান", en: "Bandarban", lat: 22.1953, lng: 92.2184 },
  { id: "brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", en: "Brahmanbaria", lat: 23.9571, lng: 91.1119 },
  { id: "chandpur", bn: "চাঁদপুর", en: "Chandpur", lat: 23.2333, lng: 90.6712 },
  { id: "chattogram", bn: "চট্টগ্রাম", en: "Chattogram", lat: 22.3569, lng: 91.7832 },
  { id: "cumilla", bn: "কুমিল্লা", en: "Cumilla", lat: 23.4607, lng: 91.1809 },
  { id: "coxsbazar", bn: "কক্সবাজার", en: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
  { id: "feni", bn: "ফেনী", en: "Feni", lat: 23.0159, lng: 91.3976 },
  { id: "khagrachhari", bn: "খাগড়াছড়ি", en: "Khagrachhari", lat: 23.1193, lng: 91.9847 },
  { id: "lakshmipur", bn: "লক্ষ্মীপুর", en: "Lakshmipur", lat: 22.9447, lng: 90.8282 },
  { id: "noakhali", bn: "নোয়াখালী", en: "Noakhali", lat: 22.8696, lng: 91.0995 },
  { id: "rangamati", bn: "রাঙ্গামাটি", en: "Rangamati", lat: 22.7324, lng: 92.2985 },

  // রাজশাহী বিভাগ
  { id: "bogura", bn: "বগুড়া", en: "Bogura", lat: 24.8465, lng: 89.3773 },
  { id: "joypurhat", bn: "জয়পুরহাট", en: "Joypurhat", lat: 25.0968, lng: 89.0227 },
  { id: "naogaon", bn: "নওগাঁ", en: "Naogaon", lat: 24.7936, lng: 88.9318 },
  { id: "natore", bn: "নাটোর", en: "Natore", lat: 24.4206, lng: 89.0003 },
  { id: "chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ", en: "Chapainawabganj", lat: 24.5965, lng: 88.2775 },
  { id: "pabna", bn: "পাবনা", en: "Pabna", lat: 24.0064, lng: 89.2372 },
  { id: "rajshahi", bn: "রাজশাহী", en: "Rajshahi", lat: 24.3745, lng: 88.6042 },
  { id: "sirajganj", bn: "সিরাজগঞ্জ", en: "Sirajganj", lat: 24.4534, lng: 89.7007 },

  // খুলনা বিভাগ
  { id: "bagerhat", bn: "বাগেরহাট", en: "Bagerhat", lat: 22.6516, lng: 89.7859 },
  { id: "chuadanga", bn: "চুয়াডাঙ্গা", en: "Chuadanga", lat: 23.6402, lng: 88.8418 },
  { id: "jashore", bn: "যশোর", en: "Jashore", lat: 23.1634, lng: 89.2182 },
  { id: "jhenaidah", bn: "ঝিনাইদহ", en: "Jhenaidah", lat: 23.5448, lng: 89.1539 },
  { id: "khulna", bn: "খুলনা", en: "Khulna", lat: 22.8456, lng: 89.5403 },
  { id: "kushtia", bn: "কুষ্টিয়া", en: "Kushtia", lat: 23.9013, lng: 89.1205 },
  { id: "magura", bn: "মাগুরা", en: "Magura", lat: 23.4855, lng: 89.4198 },
  { id: "meherpur", bn: "মেহেরপুর", en: "Meherpur", lat: 23.7622, lng: 88.6318 },
  { id: "narail", bn: "নড়াইল", en: "Narail", lat: 23.1725, lng: 89.5127 },
  { id: "satkhira", bn: "সাতক্ষীরা", en: "Satkhira", lat: 22.7185, lng: 89.0705 },

  // বরিশাল বিভাগ
  { id: "barguna", bn: "বরগুনা", en: "Barguna", lat: 22.1592, lng: 90.1255 },
  { id: "barishal", bn: "বরিশাল", en: "Barishal", lat: 22.7010, lng: 90.3535 },
  { id: "bhola", bn: "ভোলা", en: "Bhola", lat: 22.6859, lng: 90.6482 },
  { id: "jhalokati", bn: "ঝালকাঠি", en: "Jhalokati", lat: 22.6406, lng: 90.1987 },
  { id: "patuakhali", bn: "পটুয়াখালী", en: "Patuakhali", lat: 22.3596, lng: 90.3299 },
  { id: "pirojpur", bn: "পিরোজপুর", en: "Pirojpur", lat: 22.5791, lng: 89.9759 },

  // সিলেট বিভাগ
  { id: "habiganj", bn: "হবিগঞ্জ", en: "Habiganj", lat: 24.3749, lng: 91.4155 },
  { id: "moulvibazar", bn: "মৌলভীবাজার", en: "Moulvibazar", lat: 24.4829, lng: 91.7774 },
  { id: "sunamganj", bn: "সুনামগঞ্জ", en: "Sunamganj", lat: 25.0658, lng: 91.3950 },
  { id: "sylhet", bn: "সিলেট", en: "Sylhet", lat: 24.8949, lng: 91.8687 },

  // রংপুর বিভাগ
  { id: "dinajpur", bn: "দিনাজপুর", en: "Dinajpur", lat: 25.6279, lng: 88.6332 },
  { id: "gaibandha", bn: "গাইবান্ধা", en: "Gaibandha", lat: 25.3288, lng: 89.5281 },
  { id: "kurigram", bn: "কুড়িগ্রাম", en: "Kurigram", lat: 25.8054, lng: 89.6362 },
  { id: "lalmonirhat", bn: "লালমনিরহাট", en: "Lalmonirhat", lat: 25.9165, lng: 89.4532 },
  { id: "nilphamari", bn: "নীলফামারী", en: "Nilphamari", lat: 25.9318, lng: 88.8560 },
  { id: "panchagarh", bn: "পঞ্চগড়", en: "Panchagarh", lat: 26.3411, lng: 88.5542 },
  { id: "rangpur", bn: "রংপুর", en: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { id: "thakurgaon", bn: "ঠাকুরগাঁও", en: "Thakurgaon", lat: 26.0337, lng: 88.4617 },

  // ময়মনসিংহ বিভাগ
  { id: "jamalpur", bn: "জামালপুর", en: "Jamalpur", lat: 24.9375, lng: 89.9378 },
  { id: "mymensingh", bn: "ময়মনসিংহ", en: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { id: "netrokona", bn: "নেত্রকোণা", en: "Netrokona", lat: 24.8700, lng: 90.7270 },
  { id: "sherpur", bn: "শেরপুর", en: "Sherpur", lat: 25.0205, lng: 90.0153 },
];

export const DEFAULT_CITY = CITIES[0];

export type Place = {
  name: string;
  lat: number;
  lng: number;
  cityId?: string;
};

export function cityToPlace(c: City): Place {
  return {
    name: c.bn,
    lat: c.lat,
    lng: c.lng,
    cityId: c.id,
  };
}

export function getNearestCity(lat: number, lng: number): City {
  const toRad = (value: number) => (value * Math.PI) / 180;

  function distance(city: City) {
    const R = 6371;
    const dLat = toRad(city.lat - lat);
    const dLng = toRad(city.lng - lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(city.lat)) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return CITIES.reduce((nearest, city) =>
    distance(city) < distance(nearest) ? city : nearest
  );
}
