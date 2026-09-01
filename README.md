# 🍳 Recipely API (MasakApaHariIni Scraper Backend)

Drop-in replacement API backend for **RecipelyApp** (`rukys/RecipelyApp`) by scraping data from `masakapahariini.com`.

---

## 🚀 Fitur Utama
- **Drop-in Contract Replacement**: Mengembalikan format `{ method: "GET", status: true, results: [...] }` persis seperti yang diharapkan aplikasi mobile.
- **Enterprise-grade Scraper**: Menggunakan internal API Unilever & JSON-LD Schema.org untuk data yang 100% akurat dan cepat.
- **In-Memory Caching (LRU)**: Menyimpan response secara in-memory untuk kecepatan sub-millisecond dan mencegah rate-limiting.
- **Error Handling Komprehensif**: Menghandle error 400, 404, 429, 500, 502, 504 dengan format error standar dan detail.
- **Security & Rate Limiting**: Dilengkapi Helmet, CORS, dan Rate Limiter (120 req/menit).
- **Interactive Documentation**: Swagger / OpenAPI 3.0 UI tersedia di `/api/docs`.
- **Deploy Ready**: Siap dijalankan di Docker, Vercel, Railway, Render, atau VPS.

---

## 🛠️ Instalasi & Menjalankan

### Persyaratan
- Node.js `>= 18.0.0`
- Yarn atau NPM

### 1. Clone & Install Dependencies
```bash
yarn install
```

### 2. Konfigurasi Environment
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Isi variabel `.env` (default sudah siap pakai):
```env
PORT=3000
NODE_ENV=development
API_PREFIX=/api
BASE_URL=https://www.masakapahariini.com
UPSTREAM_TIMEOUT_MS=15000
CACHE_TTL_SECONDS=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

### 3. Jalankan Server
```bash
# Mode Development (auto-reload)
yarn dev

# Mode Production
yarn start
```

Akses dokumentasi Swagger UI: `http://localhost:3000/api/docs`

---

## 📋 Daftar Endpoint API

### 🍲 Resep (Recipes)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/recipes` | Daftar resep terbaru (default 10) |
| `GET` | `/api/recipes/:page` | Daftar resep berdasarkan halaman |
| `GET` | `/api/recipes-length/?limit=:limit` | Daftar resep dengan batasan jumlah |
| `GET` | `/api/category/recipes` | Daftar seluruh kategori resep |
| `GET` | `/api/category/recipes/:category` | Resep berdasarkan kategori (misal `sarapan`, `resep-ayam`, dll) |
| `GET` | `/api/recipe/:key` | Detail lengkap resep (bahan, step, waktu, porsi, nutrisi, video) |
| `GET` | `/api/search/?q=:keyword` | Cari resep berdasarkan kata kunci |

### 📰 Artikel (Articles)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/category/article` | Daftar seluruh kategori artikel |
| `GET` | `/api/category/article/:category` | Artikel per kategori (misal `inspirasi-dapur`, `tips-masak`) |
| `GET` | `/api/articles/new` | Daftar artikel terbaru |
| `GET` | `/api/article/:category/:slug` | Detail lengkap artikel |

---

## 📦 Format Respons

### 1. Respons Berhasil (Success)
```json
{
  "method": "GET",
  "status": true,
  "results": [
    {
      "title": "Resep Ayam Goreng Nasi Kuning",
      "thumb": "https://assets.unileversolutions.com/recipes-v3/125001-default.jpg",
      "key": "resep-ayam-goreng-nasi-kuning--125001",
      "times": "65 mnt",
      "portion": "6 porsi",
      "dificulty": "Sedang",
      "difficulty": "Sedang"
    }
  ]
}
```

### 2. Respons Detail Resep
```json
{
  "method": "GET",
  "status": true,
  "results": {
    "title": "Cara Membuat Tumis Genjer Taoco Sederhana",
    "thumb": "https://assets.unileversolutions.com/recipes-v2/258644.jpg",
    "servings": "4 porsi",
    "times": "30 mnt",
    "difficulty": "Mudah",
    "calories": null,
    "author": {
      "user": "Royco",
      "datePublished": "2025-09-08T08:01:29Z"
    },
    "desc": "Ikuti cara membuat tumis genjer taoco agar tidak pahit dan enak ini...",
    "needItem": [],
    "ingredient": [
      "250 g genjer, potong 4 cm",
      "500 ml air panas",
      "150 g daging ayam filet, iris tipis",
      "5 siung bawang putih, iris",
      "2 sdm taoco"
    ],
    "step": [
      "1. Seduh genjer dengan air panas, tiriskan. Sisihkan.",
      "2. Panaskan minyak, tumis bawang putih hingga harum. Masukkan daging ayam...",
      "3. Masukkan garam, merica, dan Bango Kecap Manis."
    ],
    "video": {
      "title": "Placeholder title",
      "url": "https://www.youtube.com/watch?v=VxW6Mkzsfzk"
    }
  }
}
```

### 3. Respons Error (Failure Envelope)
```json
{
  "method": "GET",
  "status": false,
  "statusCode": 404,
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Resep 'tidak-ada' tidak ditemukan",
    "details": null,
    "timestamp": "2026-09-01T14:30:00.000Z"
  }
}
```

---

## 🧪 Testing

Jalankan integration test otomatis:
```bash
yarn test
```

---

## 🐳 Docker Deployment

```bash
# Build & Run Container
docker-compose up -d --build

# Cek logs
docker logs -f recipely-api
```
