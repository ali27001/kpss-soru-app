# KPSS Soru Takip Uygulaması

Bu proje, KPSS hazırlık sürecinde çözülen soruları takip etmek için geliştirilmiş bir tam yığın (full-stack) uygulamadır.

## Proje Yapısı

- **Backend:** NestJS & PostgreSQL (TypeORM)
- **Frontend:** React Native (Expo)
- **Veritabanı:** Docker üzerinde koşan PostgreSQL

---

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları sırasıyla takip edin.

### 1. Veritabanını Başlatın

Projenin kök dizininde (root) Docker Compose kullanarak PostgreSQL veritabanını ve pgAdmin'i başlatın:

```bash
docker-compose up -d
```

* **PostgreSQL Port:** 5435
* **pgAdmin:** [http://localhost:8080](http://localhost:8080) (Email: `admin@admin.com`, Şifre: `admin`)

### 2. Backend'i Çalıştırın

Backend dizinine gidin, bağımlılıkları yükleyin ve uygulamayı başlatın:

```bash
cd kpss-app/backend
npm install
npm run start:dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır. `.env` dosyasının doğru yapılandırıldığından emin olun.

### 3. Frontend'i Çalıştırın

Frontend dizinine gidin, bağımlılıkları yükleyin ve Expo'yu başlatın:

```bash
cd kpss-app/frontend
npm install
npx expo start
```

Expo başlatıldıktan sonra:
- **iOS** için `i` tuşuna basın.
- **Android** için `a` tuşuna basın.
- QR kodu tarayarak kendi cihazınızda (Expo Go) test edebilirsiniz.

---

## Özellikler

- Günlük soru takibi (Ders ve Konu bazlı)
- Grafiksel istatistikler
- Kullanıcı kaydı ve girişi (JWT tabanlı)
- Geçmiş performans takibi

---

## Teknolojiler

- **Backend:** NestJS, TypeORM, PostgreSQL, Passport/JWT
- **Frontend:** React Native, Expo, React Navigation, Axios, React Native Chart Kit
- **DevOps:** Docker, Docker Compose
