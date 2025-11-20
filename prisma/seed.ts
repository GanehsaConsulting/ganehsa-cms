import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Website Development Packages Data (serviceId: 3)
const websitePackagesData = [
  {
    serviceId: 3,
    type: "Landing Page Company Profile",
    highlight: true,
    price: 1350000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "1 Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 2x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: false },
      { feature: "CMS Admin", status: false },
      { feature: "Free 1 Professional Email", status: false },
      { feature: "Free 10 Related Article Content", status: false },
      { feature: "Free 5 Design Product", status: false },
      { feature: "Login Owner & User", status: false },
      { feature: "Payment Gateway", status: false },
      { feature: "Client Request Feature", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Company Profile Basic",
    highlight: false,
    price: 3950000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Up to 8 Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 2x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: false },
      { feature: "CMS Admin", status: false },
      { feature: "Free 1 Professional Email", status: false },
      { feature: "Free 10 Related Article Content", status: false },
      { feature: "Free 5 Design Product", status: false },
      { feature: "Login Owner & User", status: false },
      { feature: "Payment Gateway", status: false },
      { feature: "Client Request Feature", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Blog Static / Product Catalog",
    highlight: false,
    price: 7000000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Dynamic Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 4x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: true },
      { feature: "1 Internal Admin", status: true },
      { feature: "Client Request Feature", status: true },
      { feature: "CMS Admin", status: false },
      { feature: "Free 1 Professional Email", status: false },
      { feature: "Free 10 Related Article Content", status: false },
      { feature: "Free 5 Design Product", status: false },
      { feature: "Login Owner & User", status: false },
      { feature: "Payment Gateway", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Dynamic Data Company Profile",
    highlight: false,
    price: 14000000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Up to 15 Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 4x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: true },
      { feature: "CMS Admin", status: true },
      { feature: "Free 1 Professional Email", status: false },
      { feature: "Free 10 Related Article Content", status: false },
      { feature: "Free 5 Design Product", status: false },
      { feature: "Login Owner & User", status: false },
      { feature: "Payment Gateway", status: false },
      { feature: "Client Request Feature", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Company Blog Website",
    highlight: false,
    price: 18000000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Dynamic Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 4x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: true },
      { feature: "CMS Admin", status: true },
      { feature: "Free 1 Professional Email", status: true },
      { feature: "Free 10 Related Article Content", status: true },
      { feature: "Login Owner Only", status: true },
      { feature: "Payment Gateway", status: false },
      { feature: "Client Request Feature", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Company Business E-Commerce",
    highlight: false,
    price: 0,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Dynamic Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 4x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: true },
      { feature: "CMS Admin", status: true },
      { feature: "Free 1 Professional Email", status: true },
      { feature: "Free 5 Design Product", status: true },
      { feature: "Login Owner & User", status: true },
      { feature: "Payment Gateway", status: true },
      { feature: "Client Request Feature", status: false },
    ],
  },
  {
    serviceId: 3,
    type: "Custom Web Client Request",
    highlight: false,
    price: 0,
    discount: 0,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20pembuatan%20Website%20nih!%20",
    features: [
      { feature: "Dynamic Page", status: true },
      { feature: "Domain Included", status: true },
      { feature: "SEO Friendly", status: true },
      { feature: "Design Premium", status: true },
      { feature: "Design Responsive", status: true },
      { feature: "Lifetime Support & Maintenance Teknis", status: true },
      { feature: "Content Writing", status: true },
      { feature: "SSL Included (Https)", status: true },
      { feature: "Revisi 4x", status: true },
      { feature: "Integrasi Sosial media", status: true },
      { feature: "Managed Server Data", status: true },
      { feature: "CMS Admin", status: true },
      { feature: "Free 1 Professional Email", status: true },
      { feature: "Free Design Or Content", status: true },
      { feature: "Login Owner & User", status: true },
      { feature: "Payment Gateway", status: true },
      { feature: "Client Request Feature", status: true },
    ],
  },
];

// Social Media Management Packages Data (serviceId: 7)
const socialMediaPackagesData = [
  {
    serviceId: 7,
    type: "Paket BotLane",
    highlight: false,
    price: 1995000, // 2850000 * 0.7
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Social%20Media%20Management%20nih!%20",
    features: [
      { feature: "Free Template Post", status: true },
      { feature: "Design Feed 14", status: true },
      { feature: "Design Story 4", status: true },
      { feature: "Including 4 Content Carousel", status: true },
      { feature: "Free 14 Copy Writing", status: true },
      { feature: "Free Admin Post (with Meta & Scheduling)", status: true },
      { feature: "Free Optimasi Hastag Tertarget Brand & Viral", status: true },
      { feature: "100% Original Design", status: true },
      { feature: "Unlimited Revision", status: true },
      { feature: "1 Reels Content", status: false },
      { feature: "Free Create Homepage Facebook", status: false },
      { feature: "Free Ads Consulting", status: false },
      { feature: "Free 1 Week Ads", status: false },
      { feature: "Free Ads Content", status: false },
      { feature: "Monthly Reporting", status: false },
      { feature: "Raw File Editable", status: false },
    ],
  },
  {
    serviceId: 7,
    type: "Paket Midlane",
    highlight: false,
    price: 5005000, // 7150000 * 0.7
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Social%20Media%20Management%20nih!%20",
    features: [
      { feature: "Free Template Post", status: true },
      { feature: "Design Feed 24", status: true },
      { feature: "Design Story 7", status: true },
      { feature: "Including 6 Content Carousel", status: true },
      { feature: "Free 25 Copy Writing", status: true },
      { feature: "Free Admin Post (with Meta & Scheduling)", status: true },
      { feature: "Free Optimasi Hastag Tertarget Brand & Viral", status: true },
      { feature: "100% Original Design", status: true },
      { feature: "Unlimited Revision", status: true },
      { feature: "1 REEL Content", status: true },
      { feature: "Free Create Homepage Facebook", status: true },
      { feature: "Free Ads Consulting", status: true },
      { feature: "Free 1 Week Ads", status: false },
      { feature: "Free Ads Content", status: false },
      { feature: "Monthly Reporting", status: false },
      { feature: "Raw File Editable", status: false },
    ],
  },
  {
    serviceId: 7,
    type: "Paket Jungler",
    highlight: true,
    price: 10010000, // 14300000 * 0.7
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Social%20Media%20Management%20nih!%20",
    features: [
      { feature: "Free Template Post", status: true },
      { feature: "Design Feed 30", status: true },
      { feature: "Design Story 10", status: true },
      { feature: "Including 8 Content Carousel", status: true },
      { feature: "Free 33 Copy Writing", status: true },
      { feature: "Free Admin Post (with Meta & Scheduling)", status: true },
      { feature: "Free Optimasi Hastag Tertarget Brand & Viral", status: true },
      { feature: "100% Original Design", status: true },
      { feature: "Unlimited Revision", status: true },
      { feature: "3 REEL's Content", status: true },
      { feature: "Free Create Homepage Facebook", status: true },
      { feature: "Free Ads Consulting", status: true },
      { feature: "Free 1 Week Ads", status: true },
      { feature: "Free Ads Content", status: true },
      { feature: "Monthly Reporting", status: true },
      { feature: "Raw File Editable", status: true },
    ],
  },
];

// PT Packages Data (serviceId: 1)
const PTPackagesData = [
  {
    serviceId: 1,
    type: "PT PMA (Penanaman Modal Asing)",
    highlight: true,
    price: 8500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20PMA%20nih!%20",
    discount: 36,
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak ( SKT )", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha ( NIB )", status: true },
      { feature: "Pernyataan Mandiri OSS ( K3L dan  SPPL )", status: true },
      {
        feature: "KKKPR ( Konfirmasi Kesesuaian Kegiatan Pemanfaatan Ruang )",
        status: true,
      },
      {
        feature: "Sertifikat Standar ( Jika resiko KBLI Menengah Rendah )",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
    ],
  },
  {
    serviceId: 1,
    type: "PT DASAR",
    highlight: true,
    price: 4500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Account Gmail", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: false },
      { feature: "Logo Perusahaan", status: false },
      { feature: "Company Profile", status: false },
      { feature: "Kartu Nama", status: false },
      { feature: "Invoice", status: false },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Sertifikat Elektronik", status: false },
      { feature: "Website Company", status: false },
    ],
  },
  {
    serviceId: 1,
    type: "PT LENGKAP",
    highlight: true,
    price: 5000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Account Gmail", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profile", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Sertifikat Elektronik", status: false },
      { feature: "Website Company", status: false },
    ],
  },
  {
    serviceId: 1,
    type: "PT LENGKAP + PKP",
    highlight: false,
    price: 6000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Account Gmail", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profile", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: true },
      { feature: "Sertifikat Elektronik", status: true },
      { feature: "Website Company", status: false },
    ],
  },
  {
    serviceId: 1,
    type: "PT LENGKAP + WEBSITE COMPANY",
    highlight: true,
    price: 6500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Account Gmail", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profile", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Website Company", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Sertifikat Elektronik", status: false },
    ],
  },
  {
    serviceId: 1,
    type: "PT LENGKAP + PKP + WEBSITE COMPANY",
    highlight: false,
    price: 7000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Account Gmail", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profile", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Website Company", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: true },
      { feature: "Sertifikat Elektronik", status: true },
    ],
  },
  {
    serviceId: 1,
    type: "PAKET SILVER PT PERORANGAN",
    highlight: false,
    price: 600000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Pesan Nama PT Perorangan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "Surat Pernyataan Kemenkumham", status: true },
      { feature: "NPWP PT Perorangan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak PT (SKT)", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Email PT Perorangan", status: true },
      { feature: "Free Stempel PT Perorangan", status: true },
      { feature: "Kop Surat", status: false },
      { feature: "Logo Perusahaan", status: false },
      { feature: "Company Profile", status: false },
      { feature: "Kartu Nama", status: false },
      { feature: "Invoice", status: false },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Sertifikat Elektronik", status: false },
      { feature: "Website Company", status: false },
    ],
  },
  {
    serviceId: 1,
    type: "PAKET GOLD PT PERORANGAN",
    highlight: false,
    price: 1500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20PT%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Pesan Nama PT Perorangan", status: true },
      { feature: "Akta Penegasan Pendirian", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "Surat Pernyataan Kemenkumham", status: true },
      { feature: "NPWP PT Perorangan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak PT (SKT)", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Email PT Perorangan", status: true },
      { feature: "Free Stempel PT Perorangan", status: true },
      { feature: "Kop Surat", status: false },
      { feature: "Logo Perusahaan", status: false },
      { feature: "Company Profile", status: false },
      { feature: "Kartu Nama", status: false },
      { feature: "Invoice", status: false },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Sertifikat Elektronik", status: false },
      { feature: "Website Company", status: false },
    ],
  },
];

// CV Packages Data (serviceId: 2)
const CVPackagesData = [
  {
    serviceId: 2,
    type: "CV Dasar",
    highlight: true,
    price: 3000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20CV%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      { feature: "Pernyataan Mandiri OSS (K3L dan SPPL)", status: true },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: false },
      { feature: "Logo Perusahaan", status: false },
      { feature: "Company Profil", status: false },
      { feature: "Kartu Nama", status: false },
      { feature: "Invoice", status: false },
      { feature: "Website Company", status: false },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Serifikat Elektronik", status: false },
    ],
  },
  {
    serviceId: 2,
    type: "CV Lengkap",
    highlight: true,
    price: 3500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20CV%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      { feature: "Pernyataan Mandiri OSS (K3L dan SPPL)", status: true },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profil", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Website Company", status: false },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Serifikat Elektronik", status: false },
    ],
  },
  {
    serviceId: 2,
    type: "CV Lengkap + PKP",
    highlight: false,
    price: 4500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20CV%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      { feature: "Pernyataan Mandiri OSS (K3L dan SPPL)", status: true },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profil", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: true },
      { feature: "Serifikat Elektronik", status: true },
      { feature: "Website Company", status: false },
    ],
  },
  {
    serviceId: 2,
    type: "CV Lengkap + Website Company",
    highlight: true,
    price: 5000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20CV%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      { feature: "Pernyataan Mandiri OSS (K3L dan SPPL)", status: true },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profil", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Website Company", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: false },
      { feature: "Serifikat Elektronik", status: false },
    ],
  },
  {
    serviceId: 2,
    type: "CV Lengkap + PKP + Website",
    highlight: false,
    price: 6000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pembuatan%20CV%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Akta Pendirian Perusahaan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Badan", status: true },
      { feature: "Surat Keterangan Terdaftar Pajak (SKT)", status: true },
      { feature: "Coretax Badan", status: true },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      { feature: "Pernyataan Mandiri OSS (K3L dan SPPL)", status: true },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Stempel Nama Perusahaan", status: true },
      { feature: "Free Template Laporan Keuangan", status: true },
      { feature: "Kop Surat", status: true },
      { feature: "Logo Perusahaan", status: true },
      { feature: "Company Profil", status: true },
      { feature: "Kartu Nama", status: true },
      { feature: "Invoice", status: true },
      { feature: "Website Company", status: true },
      { feature: "Surat Pengukuhan Kena Pajak (SPPKP)", status: true },
      { feature: "Serifikat Elektronik", status: true },
    ],
  },
];

// Virtual Office Packages Data (serviceId: 10)
const VirtualOfficePackagesData = [
  {
    serviceId: 10,
    type: "VIRTUAL OFFICE",
    highlight: false,
    price: 2650000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Virtual%20Office%20nih!%20",
    features: [
      { feature: "Perjanjian Sewa Menyewa 1 Tahun", status: true },
      { feature: "Sudah Termasuk PPN dan PPH", status: true },
      { feature: "Alamat Virtual Office Bisa PKP", status: true },
      {
        feature: "Bisa Pakai Ruang Meeting diseluruh Cabang Virtual Office",
        status: true,
      },
      { feature: "Layanan Surat Menyurat", status: true },
      { feature: "Notifikasi Atas Dokumen Atau Surat Masuk", status: true },
      { feature: "Free Surat Domisili Gedung", status: true },
      { feature: "Free Wifi", status: true },
      { feature: "Self Service Pantry", status: true },
      { feature: "Alamat Komersil dan Prestisius", status: true },
      { feature: "Bonus Meeting Room Gratis 60-90 Jam Pertahun", status: true },
      { feature: "Fasilitas Live Streaming", status: true },
      { feature: "Fasilitas Podcast", status: true },
      { feature: "Fasilitas Proyektor", status: true },
    ],
  },
  {
    serviceId: 10,
    type: "VIRTUAL OFFICE PREMIUM (SCBD)",
    highlight: false,
    price: 3999000,
    discount: 30,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Virtual%20Office%20nih!%20",
    features: [
      { feature: "Perjanjian Sewa Menyewa 1 Tahun", status: true },
      { feature: "Sudah Termasuk PPN dan PPH", status: true },
      { feature: "Alamat Virtual Office Bisa PKP", status: true },
      {
        feature: "Bisa Pakai Ruang Meeting diseluruh Cabang Virtual Office",
        status: true,
      },
      { feature: "Layanan Surat Menyurat", status: true },
      { feature: "Notifikasi Atas Dokumen Atau Surat Masuk", status: true },
      { feature: "Free Surat Domisili Gedung", status: true },
      { feature: "Free Wifi", status: true },
      { feature: "Self Service Pantry", status: true },
      { feature: "Alamat Komersil dan Prestisius", status: true },
      { feature: "Bonus Meeting Room Gratis 60-90 Jam Pertahun", status: true },
      { feature: "Fasilitas Live Streaming", status: true },
      { feature: "Fasilitas Podcast", status: true },
      { feature: "Fasilitas Proyektor", status: true },
    ],
  },
];

// Badan Usaha Packages Data (serviceId: 4)
const BadanUsahaPackagesData = [
  {
    serviceId: 4,
    type: "Pendirian Yayasan",
    highlight: false,
    price: 4000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pendirian%20Yayasan%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Pesan Nama Yayasan", status: true },
      { feature: "Akta Pendirian Yayasan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Yayasan", status: true },
      {
        feature: "Surat Keterangan Terdaftar Pajak Yayasan (SKT)",
        status: true,
      },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Email Yayasan", status: true },
      { feature: "Free Stempel Nama Yayasan", status: true },
    ],
  },
  {
    serviceId: 4,
    type: "Pendirian Perkumpulan/Asosiasi",
    highlight: false,
    price: 4000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pendirian%20Asosiasi/Perkumpulan%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Pesan Nama Perkumpulan", status: true },
      { feature: "Akta Pendirian Yayasan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Yayasan", status: true },
      {
        feature: "Surat Keterangan Terdaftar Pajak Yayasan (SKT)",
        status: true,
      },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Email Perkumpulan", status: true },
      { feature: "Free Stempel Nama Perkumpulan", status: true },
    ],
  },
  {
    serviceId: 4,
    type: "Pendirian Firma Hukum",
    highlight: false,
    price: 3000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pendirian%20Firma%20Hukum%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Pesan Nama Firma Hukum", status: true },
      { feature: "Akta Pendirian Perkumpulan", status: true },
      { feature: "Surat Keputusan Kemenkumham", status: true },
      { feature: "NPWP Yayasan", status: true },
      {
        feature: "Surat Keterangan Terdaftar Pajak Yayasan (SKT)",
        status: true,
      },
      { feature: "Nomor Induk Berusaha (NIB)", status: true },
      {
        feature: "Pernyataan Mandiri OSS (K3L, Tata Ruang dan SPPL)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika resiko KBLI Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
      { feature: "Free Email Firma Hukum", status: true },
      { feature: "Free Stempel Firma Hukum", status: true },
    ],
  },
];

// HAKI Packages Data (serviceId: 5)
const HakiPackagesData = [
  {
    serviceId: 5,
    type: "Pengurusan HAKI (Merek, Hak Cipta, Paten, dll.)",
    highlight: false,
    price: 3800000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pengurusan%20HAKI%20nih!%20",
    features: [
      { feature: "Free Konsultasi", status: true },
      { feature: "Proses 1-2 Hari Kerja", status: true },
    ],
  },
];

// Go Space Packages Data (serviceId: 11)
const goSpacePackagesData = [
  {
    serviceId: 11,
    type: "Virtual Office Space Lite",
    highlight: true,
    price: 1700000, // Convert from "Rp 1.700.000"
    discount: 33,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Virtual%20Office%20Space%20Lite%20nih!%20",
    features: [
      { feature: "Alamat Domisili Prestisius", status: true },
      { feature: "Resepsionis Profesional", status: true },
      { feature: "Penerimaan Surat & Paket", status: true },
      { feature: "Free Wifi", status: true },
      { feature: "Akses Private Lift", status: true },
      { feature: "Smart TV", status: true },
      { feature: "Whiteboard", status: true },
      { feature: "Free Tea & Coffee", status: true },
      { feature: "Self Service Pantry", status: true },
      { feature: "Free meeting room 40 jam/tahun", status: true },
      { feature: "Ruang meeting besar (10 orang)", status: true },
      { feature: "Ruang meeting kecil (5 orang)", status: true },
      { feature: "Meeting room smoking area (3 orang)", status: true },
    ],
  },
  {
    serviceId: 11,
    type: "Virtual Office Space Core",
    highlight: true,
    price: 2500000, // Convert from "Rp 2.500.000"
    discount: 33,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Virtual%20Office%20Space%20Core%20nih!%20",
    features: [
      { feature: "Alamat Domisili Prestisius", status: true },
      { feature: "Resepsionis Profesional", status: true },
      { feature: "Penerimaan Surat & Paket", status: true },
      { feature: "Free Wifi", status: true },
      { feature: "Akses Private Lift", status: true },
      { feature: "Smart TV", status: true },
      { feature: "Whiteboard", status: true },
      { feature: "Free Tea & Coffee", status: true },
      { feature: "Self Service Pantry", status: true },
      { feature: "Free meeting room 90 jam/tahun", status: true },
      { feature: "Ruang meeting besar (10 orang)", status: true },
      { feature: "Ruang meeting kecil (5 orang)", status: true },
      { feature: "Meeting room smoking area (3 orang)", status: true },
    ],
  },
];

// Layanan Izin & Sertifikasi Packages Data (serviceId: 6)
const servicePackagesData = [
  {
    serviceId: 6,
    type: "Pengurusan Izin SKPL A",
    highlight: false,
    price: 3500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20pengurusan%20Izin%20SKPL%20A!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat Standar SKPL - A", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Pengurusan SBUJK Skala Kecil",
    highlight: false,
    price: 9000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20pengurusan%20SBUJK%20Skala%20Kecil!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      {
        feature: "Sertifikat Badan Usaha Jasa Konstruksi (SBJUK)",
        status: true,
      },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Pengurusan SBUJK Skala Menengah",
    highlight: true,
    price: 11000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20pengurusan%20SBUJK%20Skala%20Menengah!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      {
        feature: "Sertifikat Badan Usaha Jasa Konstruksi (SBJUK)",
        status: true,
      },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Pengurusan SBUJK Skala Besar",
    highlight: false,
    price: 15000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20pengurusan%20SBUJK%20Skala%20Besar!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      {
        feature: "Sertifikat Badan Usaha Jasa Konstruksi (SBJUK)",
        status: true,
      },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Sertifikat Kompetensi Kerja (SKK) Jenjang 4-6",
    highlight: false,
    price: 3500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Sertifikat%20Kompetensi%20Kerja%20(SKK)%20Jenjang%204-6!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat Kompetensi Kerja (SKK)", status: true },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Sertifikat Kompetensi Kerja (SKK) Jenjang 7",
    highlight: false,
    price: 5000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Sertifikat%20Kompetensi%20Kerja%20(SKK)%20Jenjang%207!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat Kompetensi Kerja (SKK)", status: true },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Sertifikat Kompetensi Kerja (SKK) Jenjang 8-9",
    highlight: false,
    price: 6000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Sertifikat%20Kompetensi%20Kerja%20(SKK)%20Jenjang%208-9!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat Kompetensi Kerja (SKK)", status: true },
      { feature: "Kartu Tanda Anggota (KTA)", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "ISO 9001 Terakreditasi IAS/IAF",
    highlight: true,
    price: 9500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20ISO%209001%20Terakreditasi%20IAS/IAF!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat ISO 9001 Terakreditasi IAS/IAF", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "ISO 45001 Terakreditasi IAS/IAF",
    highlight: false,
    price: 12500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20ISO%2045001%20Terakreditasi%20IAS/IAF!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat ISO 45001 Terakreditasi IAS/IAF", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "ISO 37001 Smap Akreditasi KAN",
    highlight: false,
    price: 45000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20ISO%2037001%20Smap%20Akreditasi%20KAN!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat ISO 37001 Smap Akreditasi KAN", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "ISO 37001 Smap Akreditasi IAS/IAF",
    highlight: false,
    price: 19500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20ISO%2037001%20Smap%20Akreditasi%20IAS/IAF!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Sertifikat ISO 37001 Smap Akreditasi IAS/IAF", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Audit Barcode Untuk Izin SBU Skala Menengah dan Besar",
    highlight: false,
    price: 17500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Audit%20Barcode%20Untuk%20Izin%20SBU!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      { feature: "Audit Barcode", status: true },
    ],
  },
  {
    serviceId: 6,
    type: "Sistem Manajemen Keselamatan Dan Kesehatan Kerja (SMK3)",
    highlight: false,
    price: 27500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Sistem%20Manajemen%20Keselamatan%20Dan%20Kesehatan%20Kerja%20(SMK3)!",
    features: [
      { feature: "Free Konsultasi 24jam", status: true },
      {
        feature:
          "Sertifikat Sistem Manajemen Keselamatan Dan Kesehatan Kerja (SMK3)",
        status: true,
      },
    ],
  },
];

// Jasa Akuntansi Packages Data (serviceId: 9)
const AccountantPackagesData = [
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet < 2,5 M (1 Tahun)",
    price: 800000,
    priceOriginal: 1250000, // price = priceOriginal * (1 - discount)
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%20Kurang%20dari%202,5%20M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 2,5M s/d 5M (1 Tahun)",
    price: 1300000,
    priceOriginal: 2031250,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%202,5M%20s/d%205M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 5M s/d 7,5M (1 Tahun)",
    price: 1800000,
    priceOriginal: 2812500,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%205M%20s/d%207,5M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 7,5M s/d 10M (1 Tahun)",
    price: 2300000,
    priceOriginal: 3593750,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%207,5M%20s/d%2010M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 10M s/d 12,5M (1 Tahun)",
    price: 2800000,
    priceOriginal: 4375000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2010M%20s/d%2012,5M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 12,5M s/d 15M (1 Tahun)",
    price: 3300000,
    priceOriginal: 5156250,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2012,5M%20s/d%2015M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 15M s/d 17,5M (1 Tahun)",
    price: 3800000,
    priceOriginal: 5937500,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2015M%20s/d%2017,5M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 17,5M s/d 20M (1 Tahun)",
    price: 4300000,
    priceOriginal: 6718750,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2017,5M%20s/d%2020M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 20M s/d 25M (1 Tahun)",
    price: 4800000,
    priceOriginal: 7500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2020M%20s/d%2025M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 25M s/d 30M (1 Tahun)",
    price: 5300000,
    priceOriginal: 8281250,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Jasa%20Akuntansi%20(Kontrak)%20Omzet%2025M%20s/d%2030M%20(1%20Tahun)!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Buku Besar", status: true },
      { feature: "Laporan Neraca Keuangan", status: true },
      { feature: "Laporan Laba / Rugi Keuangan", status: true },
      { feature: "Jurnal Penyesuaian", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Buku Besar Pembantu", status: true },
    ],
    requirements: [
      "Mutasi Rekening Bank",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Rekap AP (Account Payable)",
      "Rekap AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
      "Rekap Pajak Perusahaan",
      "Stock Perusahaan (Jika Perusahaan Dagang)",
    ],
  },
];

const NIBPTPackage = [
  {
    serviceId: 1,
    type: "Pengurusan NIB (Nomor Induk Berusaha)",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pengurusan%20NIB%20nih!%20",
    discount: 50,
    features: [
      { feature: "NIB (Nomor Induk Berusaha)", status: true },
      {
        feature: "Pernyataan Mandiri (K3L, SPPL dan Tata Ruang)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika Skala Resiko Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
    ],
  },
];

const NIBCVPackage = [
  {
    serviceId: 2,
    type: "Pengurusan NIB (Nomor Induk Berusaha)",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo%20MinGans!%20Aku%20mau%20konsultasi%20terkait%20Pengurusan%20NIB%20nih!%20",
    discount: 50,
    features: [
      { feature: "NIB (Nomor Induk Berusaha)", status: true },
      {
        feature: "Pernyataan Mandiri (K3L, SPPL dan Tata Ruang)",
        status: true,
      },
      {
        feature: "Sertifikat Standar (Jika Skala Resiko Menengah Rendah)",
        status: true,
      },
      { feature: "Hak Akses OSS", status: true },
    ],
  },
];

// Konsultan Pajak Packages Data (serviceId: 8)
const KonsultanPajakPackagesData = [
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Non Pegawai Nihil) 1 Tahun",
    highlight: false,
    price: 100000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Non%20Pegawai%20Nihil)%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Bukti Potong",
      "Kartu Keluarga",
      "KTP",
      "Asset",
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Non Pegawai Omzet) 1 Tahun",
    highlight: false,
    price: 200000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Non%20Pegawai%20Omzet)%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Bukti Potong",
      "Kartu Keluarga",
      "KTP",
      "Asset",
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Pegawai) 1 Tahun",
    highlight: false,
    price: 100000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Pegawai)%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Bukti Potong",
      "Kartu Keluarga",
      "KTP",
      "Asset",
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Badan Usaha (Nihil) 1 Tahun",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Badan%20Usaha%20(Nihil)%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Laporan keuangan", status: true },
      { feature: "Review Laporan Keuangan", status: true },
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
      { feature: "SPT Masa Tahunan Badan", status: true },
    ],
    requirements: [
      "Jurnal Keuangan",
      "Laporan Neraca",
      "Laporan Laba / Rugi",
      "Rekonsiliasi Bank",
      "Laporan SPT PPh 21 Pegawai",
      "Laporan PPh 23",
      "Laporan PPh Final",
      "Laporan PPN (Jika Sudah PKP)",
      "Laporan SPT PPh 25/29",
      "Pajak Daerah (Jika Ada)",
      "Perencanaan Pajak",
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Badan Usaha (Omzet) 1 Tahun",
    highlight: false,
    price: 1000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Badan%20Usaha%20(Omzet)%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Laporan keuangan", status: true },
      { feature: "Review Laporan Keuangan", status: true },
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
      { feature: "SPT Masa Tahunan Badan", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Laporan Keuangan (Jika Ada)",
      "SPT PPh 21 Pegawai (Jika Ada)",
      "SPT PPN (Jika PKP)",
      "Bukti Potong PPh (Jika Ada)",
      "Akta Perusahaan Pendirian s/d Perubahan Terakhir",
      "KTP & NPWP Direksi",
      "NPWP Perusahaan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet Kurang dari 5M",
    highlight: false,
    price: 1000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%20Kurang%20dari%205M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 5M s/d 15M",
    highlight: false,
    price: 1500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%205M%20s/d%2015M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 15M s/d 25M",
    highlight: false,
    price: 2000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%2015M%20s/d%2025M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 25M s/d 35M",
    highlight: false,
    price: 2500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%2025M%20s/d%2035M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 35M s/d 50M",
    highlight: false,
    price: 3000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%2035M%20s/d%2050M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMA (Kontrak 1 Tahun) Omzet Kurang dari 5M",
    highlight: false,
    price: 1250000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMA%20(Kontrak%201%20Tahun)%20Omzet%20Kurang%20dari%205M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMA (Kontrak 1 Tahun) Omzet 5M s/d 15M",
    highlight: false,
    price: 1750000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMA%20(Kontrak%201%20Tahun)%20Omzet%205M%20s/d%2015M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMA (Kontrak 1 Tahun) Omzet 15M s/d 25M",
    highlight: false,
    price: 2250000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMA%20(Kontrak%201%20Tahun)%20Omzet%2015M%20s/d%2025M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMA (Kontrak 1 Tahun) Omzet 25M s/d 35M",
    highlight: false,
    price: 2750000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMA%20(Kontrak%201%20Tahun)%20Omzet%2025M%20s/d%2035M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMA (Kontrak 1 Tahun) Omzet 35M s/d 50M",
    highlight: false,
    price: 3250000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMA%20(Kontrak%201%20Tahun)%20Omzet%2035M%20s/d%2050M!",
    discount: 36,
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT PPh 21 Pegawai", status: true },
      { feature: "Laporan PPh 23", status: true },
      { feature: "Laporan PPh Final", status: true },
      { feature: "Laporan PPN (Jika Sudah PKP)", status: true },
      { feature: "Laporan SPT PPh 25/29", status: true },
      { feature: "Pajak Daerah (Jika Ada)", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP (Jika Sudah PKP)",
      "Rekap Pengeluaran",
      "Rekap Pemasukan",
      "Mutasi Rekening Bank",
      "AP (Account Payable)",
      "AR (Account Receivable)",
      "Daftar Asset Perusahaan",
      "Daftar Gaji Karyawan",
    ],
  },

  {
    serviceId: 8,
    type: "Pendaftaran Pajak Restoran (PB1) Badan/Perorangan",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pendaftaran%20Pajak%20Restoran%20(PB1)%20Badan%2FPerorangan!",
    discount: 36,
    features: [
      { feature: "Semua Pengurusan Pendaftaran", status: true },
      { feature: "Pendampingan Survey", status: true },
      { feature: "NPWPD", status: true },
      { feature: "NOPD", status: true },
    ],
    requirements: [
      "Akta Perusahaan Pendirian s/d Perubahan Terakhir",
      "KTP & NPWP Direksi",
      "NIB Perusahaan",
      "Email Perusahaan",
      "Nomor HP/WA Perusahaan",
      "NPWP Perusahaan",
      "Foto-foto Reklame",
      "Luas Reklame",
      "Tinggi Reklame",
      "Lokasi Reklame",
      "Posisi Reklame",
    ],
  },
  {
    serviceId: 8,
    type: "Pendaftaran Pajak Hiburan",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pendaftaran%20Pajak%20Hiburan!",
    discount: 36,
    features: [
      { feature: "Semua Pengurusan Pendaftaran", status: true },
      { feature: "Pendampingan Survey", status: true },
      { feature: "NPWPD", status: true },
      { feature: "NOPD", status: true },
    ],
    requirements: [
      "Akta Perusahaan Pendirian s/d Perubahan Terakhir",
      "KTP & NPWP Direksi",
      "NIB Perusahaan",
      "Email Perusahaan",
      "Nomor HP/WA Perusahaan",
      "NPWP Perusahaan",
      "Foto-foto Reklame",
      "Luas Reklame",
      "Tinggi Reklame",
      "Lokasi Reklame",
      "Posisi Reklame",
    ],
  },
  {
    serviceId: 8,
    type: "Pendaftaran Pajak Reklame",
    highlight: false,
    price: 500000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pendaftaran%20Pajak%20Reklame!",
    discount: 36,
    features: [
      { feature: "Semua Pengurusan Pendaftaran", status: true },
      { feature: "Pendampingan Survey", status: true },
      { feature: "NPWPD", status: true },
      { feature: "NOPD", status: true },
    ],
    requirements: [
      "Akta Perusahaan Pendirian s/d Perubahan Terakhir",
      "KTP & NPWP Direksi",
      "NIB Perusahaan",
      "Email Perusahaan",
      "Nomor HP/WA Perusahaan",
      "NPWP Perusahaan",
      "Foto-foto Reklame",
      "Luas Reklame",
      "Tinggi Reklame",
      "Lokasi Reklame",
      "Posisi Reklame",
    ],
  },
  {
    serviceId: 8,
    type: "Restitusi Pajak Periode 1 Tahun",
    highlight: false,
    price: 30000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Restitusi%20Pajak%20Periode%201%20Tahun!",
    discount: 36,
    features: [
      { feature: "Review Kebenaran Pelaporan Pajak", status: true },
      { feature: "Review Kebenaran Laporan Keuangan Pajak", status: true },
      { feature: "Semua Pengurusan Permohonan", status: true },
      { feature: "Pendampingan Sidang Restitusi", status: true },
      { feature: "Pencairan Restitusi Pajak", status: true },
    ],
    requirements: [
      "Akun DJP Online",
      "Akun PKP",
      "Laporan Keuangan",
      "Buku Besar",
      "Mutasi Rekening Bank",
      "Bukti Dokumen Asli",
      "Akta Perusahaan Pendirian s/d Perubahan Terakhir",
      "SPT Tahunan Badan Usaha",
      "SPT PPh 21 Pegawai",
      "Bukti Potong PPh",
      "KTP & NPWP Direksi",
    ],
  },
  {
    serviceId: 8,
    type: "Pendampingan Pajak SP2DK",
    highlight: false,
    price: 1000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pendampingan%20Pajak%20SP2DK!",
    discount: 36,
    features: [
      { feature: "Pendampingan Pajak", status: true },
      { feature: "Review SPT Tahunan Badan Usaha", status: true },
      { feature: "Review Laporan Keuangan Pajak", status: true },
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Pembetulan Pajak", status: true },
    ],
    requirements: [
      "Surat Pajak SP2DK",
      "SPT Tahunan Badan Usaha",
      "Laporan Keuangan Pajak",
      "Bukti Pendukung Lainnya Menyesuaikan Temuan Pajak",
    ],
  },
  {
    serviceId: 8,
    type: "Brevet B & C (Kurang lebih 2.5 Bulan)",
    highlight: false,
    price: 3000000,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Brevet%20B%20%26%20C!",
    discount: 36,
    features: [
      { feature: "Materi KUP Tentang PPh 21", status: true },
      { feature: "Materi KUP Tentang PPh 23", status: true },
      { feature: "Materi KUP Tentang PPh Final", status: true },
      { feature: "Materi KUP Tentang PPN", status: true },
      { feature: "Materi KUP Tentang PPh Badan Usaha", status: true },
    ],
    requirements: ["KTP", "NPWP", "Nomor HP", "Email"],
  },
];

// Helper function to check if package exists
async function packageExists(
  serviceId: number,
  type: string
): Promise<boolean> {
  const existing = await prisma.package.findFirst({
    where: {
      serviceId,
      type,
    },
  });
  return !!existing;
}

// Helper function to remove duplicate packages
async function removeDuplicatePackages() {
  console.log("\n🧹 Checking for duplicate packages...");

  // Get all packages grouped by serviceId and type
  const packages = await prisma.package.findMany({
    orderBy: [
      { serviceId: "asc" },
      { type: "asc" },
      { createdAt: "asc" }, // Keep the oldest one
    ],
  });

  const seen = new Map<string, number>();
  const duplicates: number[] = [];

  for (const pkg of packages) {
    const key = `${pkg.serviceId}-${pkg.type}`;

    if (seen.has(key)) {
      duplicates.push(pkg.id);
    } else {
      seen.set(key, pkg.id);
    }
  }

  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} duplicate packages. Removing...`);

    // Delete package features first (due to foreign key)
    await prisma.packageFeature.deleteMany({
      where: {
        packageId: {
          in: duplicates,
        },
      },
    });

    // Then delete packages
    const deleted = await prisma.package.deleteMany({
      where: {
        id: {
          in: duplicates,
        },
      },
    });

    console.log(`✅ Removed ${deleted.count} duplicate packages`);
  } else {
    console.log("✅ No duplicate packages found");
  }
}

// Generic function to seed packages
async function seedPackages(
  packageData: any[],
  categoryName: string
): Promise<void> {
  console.log(`\n📦 Seeding ${categoryName} packages...`);

  let created = 0;
  let skipped = 0;

  for (const pkg of packageData) {
    // Check if package already exists
    const exists = await packageExists(pkg.serviceId, pkg.type);

    if (exists) {
      console.log(`⏭️  Skipped (already exists): ${pkg.type}`);
      skipped++;
      continue;
    }

    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
      // Debug log
      console.log(`📝 Processing: ${pkg.type}`);
      console.log(`   Has requirements: ${!!pkg.requirements}`);
      console.log(`   Requirements count: ${pkg.requirements?.length || 0}`);

      const createdPackage = await prisma.package.create({
        data: {
          serviceId: pkg.serviceId,
          type: pkg.type,
          highlight: pkg.highlight,
          price: pkg.price,
          discount: pkg.discount,
          priceOriginal: priceOriginal,
          link: pkg.link,
          features: {
            create: pkg.features.map((f: any) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
          // Add requirements if they exist
          ...(pkg.requirements &&
            pkg.requirements.length > 0 && {
              requirements: {
                create: pkg.requirements.map((req: string) => ({
                  requirement: {
                    connectOrCreate: {
                      where: { name: req },
                      create: { name: req },
                    },
                  },
                })),
              },
            }),
        },
      });
      console.log(`✅ Created: ${createdPackage.type}`);
      created++;
    } catch (error) {
      console.log(`❌ Error creating package: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log(`📊 Summary: ${created} created, ${skipped} skipped`);
}

async function main() {
  console.log("🌱 Starting seeding...\n");

  // Remove duplicates first
  await removeDuplicatePackages();

  // ==============================
  // SEED USERS
  // ==============================
  console.log("\n👤 Seeding users...");
  const users = [
    {
      name: "Admin",
      email: "admin@cms.com",
      password: await bcrypt.hash("P4ssw0rd", 10),
      role: Role.SUPER_ADMIN,
    },
    {
      name: "Gevira",
      email: "gevira@cms.com",
      password: await bcrypt.hash("ganesha2025!", 10),
      role: Role.ADMIN,
    },
    {
      name: "Guntur",
      email: "guntur@cms.com",
      password: await bcrypt.hash("ganesha2025!", 10),
      role: Role.ADMIN,
    },
  ];

  // for (const user of users) {
  //   const createdUser = await prisma.user.upsert({
  //     where: { email: user.email },
  //     update: {},
  //     create: user,
  //   });
  //   console.log(`✅ User: ${createdUser.email}`);
  // }

  // ==============================
  // SEED PACKAGES
  // ==============================
  // await seedPackages(websitePackagesData, "Website Development");
  // await seedPackages(socialMediaPackagesData, "Social Media Management");
  await seedPackages(PTPackagesData, "PT");
  // await seedPackages(CVPackagesData, "CV");
  // await seedPackages(VirtualOfficePackagesData, "Virtual Office");
  // await seedPackages(KonsultanPajakPackagesData, "Konsultan Pajak");
  // await seedPackages(BadanUsahaPackagesData, "Badan Usaha");
  // await seedPackages(HakiPackagesData, "HAKI");
  // await seedPackages(goSpacePackagesData, "Go Space");
  // await seedPackages(AccountantPackagesData, "Jasa Akuntansi");
  // await seedPackages(servicePackagesData, "Layanan Izin & Sertifikasi");

  // await seedPackages(NIBCVPackage, "nambah NIB PT");
  // await seedPackages(NIBPTPackage, "nambah NIB cv");

  // ==============================
  // SEED PACKAGE ↔ PROJECT RELATIONS (M to M)
  // ==============================
  console.log("\n🔗 Seeding PackageProject relations...");

  const packageId = 3;
  const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16];

  for (const projectId of projectIds) {
    try {
      await prisma.packageProject.upsert({
        where: {
          packageId_projectId: {
            packageId,
            projectId,
          },
        },
        update: {},
        create: {
          packageId,
          projectId,
        },
      });
      console.log(`✅ Linked package ${packageId} with project ${projectId}`);
    } catch (err) {
      console.error(`❌ Failed to link project ${projectId}:`, err);
    }
  }

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
