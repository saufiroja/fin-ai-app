# Mock Users untuk Testing

Ketika server backend tidak tersedia, aplikasi akan secara otomatis menggunakan mock authentication dengan user-user berikut:

## Daftar Mock Users

### User 1 - Andi Pratama
- **Email:** `andi@example.com`
- **Password:** `password123`
- **Avatar:** A
- **ID:** 1

### User 2 - Budi Santoso  
- **Email:** `budi@example.com`
- **Password:** `password123`
- **Avatar:** B
- **ID:** 2

### User 3 - Citra Dewi
- **Email:** `citra@example.com`
- **Password:** `password123`
- **Avatar:** C
- **ID:** 3

## Cara Menggunakan

1. Pastikan server backend tidak berjalan atau tidak dapat diakses
2. Buka halaman login di aplikasi
3. Gunakan salah satu kombinasi email dan password di atas
4. Sistem akan secara otomatis menggunakan mock authentication
5. Avatar di navbar akan menampilkan huruf pertama dari nama user yang login

## Fitur Mock Authentication

- ✅ Login dengan validasi email dan password
- ✅ Generate mock token dan simpan di cookies
- ✅ Avatar dinamis berdasarkan nama user
- ✅ Redirect ke dashboard setelah login berhasil  
- ✅ Logout functionality
- ✅ Persistent session dengan cookies

## Catatan

Mock authentication akan digunakan secara otomatis ketika:
- Server backend tidak berjalan
- Network error ke API
- API endpoint tidak dapat diakses

Jika server backend tersedia, aplikasi akan menggunakan real authentication.
