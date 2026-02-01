# OpenMusic API (Version 2) 🎵

Proyek ini adalah implementasi **RESTful API** untuk aplikasi OpenMusic. Proyek ini merupakan submission untuk kelas **Belajar Fundamental Aplikasi Back-End** di Dicoding Indonesia.

## 🚀 Teknologi yang Digunakan
* **Node.js** - Runtime environment.
* **Hapi.js** - Framework web server.
* **PostgreSQL** - Database relasional.
* **node-postgres (pg)** - Driver PostgreSQL untuk Node.js.
* **JWT (JSON Web Token)** - Untuk otentikasi dan otorisasi pengguna.
* **Joi** - Untuk validasi data (payload validation).
* **Dotenv** - Manajemen environment variables.

## ✨ Fitur Utama
Aplikasi ini memiliki fitur-fitur berikut sesuai kriteria submission:

1.  **Albums & Songs**: Pengelolaan data musik (CRUD).
2.  **Users**: Registrasi pengguna baru.
3.  **Authentications**: Login, Logout, dan Refresh Token menggunakan JWT.
4.  **Playlists**: Pengguna dapat membuat playlist pribadi.
5.  **Playlist Songs**: Menambahkan lagu ke dalam playlist.
6.  **Collaborations**: Fitur kolaborasi antar pengguna dalam mengelola playlist (menggunakan verifikasi owner & collaborator).
7.  **Activities**: Mencatat riwayat penambahan dan penghapusan lagu dalam playlist.

## 🛠️ Cara Menjalankan Project

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/username-kamu/openmusic-api-v2.git](https://github.com/username-kamu/openmusic-api-v2.git)
    cd openmusic-api-v2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment:**
    Buat file `.env` di root folder dan sesuaikan isinya (lihat `.env.example` jika ada, atau gunakan konfigurasi database lokal kamu).

4.  **Jalankan Database Migrations:**
    ```bash
    npm run migrate up
    ```

5.  **Jalankan Server:**
    ```bash
    npm run start-dev
    ```

---
**Developed by Septio Yasin Tiaratomo**
