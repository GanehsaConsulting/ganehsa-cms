import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// Website Development Packages Data (serviceId: 3)
export const websitePackagesData = [
  {
    serviceId: 3,
    type: "Mini Web Company Profile",
    highlight: false,
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
    highlight: true,
    price: 33183500,
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
export const socialMediaPackagesData = [
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
export const PTPackagesData = [
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
export const CVPackagesData = [
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
export const VirtualOfficePackagesData = [
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

// Konsultan Pajak Packages Data (serviceId: 8)
export const KonsultanPajakPackagesData = [
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Non Pegawai Nihil) 1 Tahun",
    highlight: false,
    price: 100000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Non%20Pegawai%20Nihil)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Non Pegawai Omzet) 1 Tahun",
    highlight: false,
    price: 200000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Non%20Pegawai%20Omzet)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Pribadi (Pegawai) 1 Tahun",
    highlight: false,
    price: 100000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Pribadi%20(Pegawai)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Badan Usaha (Nihil) 1 Tahun",
    highlight: false,
    price: 500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Badan%20Usaha%20(Nihil)%201%20Tahun!",
    features: [
      { feature: "Laporan keuangan", status: true },
      { feature: "Review Laporan Keuangan", status: true },
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
      { feature: "SPT Masa Tahunan Badan", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Pelaporan SPT Masa Tahunan Badan Usaha (Omzet) 1 Tahun",
    highlight: false,
    price: 1000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Pelaporan%20SPT%20Masa%20Tahunan%20Badan%20Usaha%20(Omzet)%201%20Tahun!",
    features: [
      { feature: "Laporan keuangan", status: true },
      { feature: "Review Laporan Keuangan", status: true },
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
      { feature: "SPT Masa Tahunan Badan", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet Kurang dari 5M",
    highlight: true,
    price: 1000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%20Kurang%20dari%205M!",
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
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 5M s/d 15M",
    highlight: false,
    price: 1500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%205M%20s/d%2015M!",
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
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet 15M s/d 50M",
    highlight: false,
    price: 2500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%2015M%20s/d%2050M!",
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
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Badan PMDN (Kontrak 1 Tahun) Omzet Lebih dari 50M",
    highlight: false,
    price: 5000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Badan%20PMDN%20(Kontrak%201%20Tahun)%20Omzet%20Lebih%20dari%2050M!",
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
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Pribadi (Non Pegawai Nihil) 1 Tahun",
    highlight: false,
    price: 500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Pribadi%20(Non%20Pegawai%20Nihil)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Pribadi (Non Pegawai Omzet) 1 Tahun",
    highlight: false,
    price: 750000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Pribadi%20(Non%20Pegawai%20Omzet)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultan Pajak Pribadi (Pegawai) 1 Tahun",
    highlight: false,
    price: 500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultan%20Pajak%20Pribadi%20(Pegawai)%201%20Tahun!",
    features: [
      { feature: "Perencanaan Pajak", status: true },
      { feature: "Bukti Pelaporan Elektronik", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Laporan Keuangan UMKM (Sederhana) 1 Tahun",
    highlight: false,
    price: 300000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Laporan%20Keuangan%20UMKM%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Laporan Keuangan UMKM (Kompleks) 1 Tahun",
    highlight: false,
    price: 600000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Laporan%20Keuangan%20UMKM%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Laporan Keuangan Badan (Sederhana) 1 Tahun",
    highlight: false,
    price: 800000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Laporan%20Keuangan%20Badan%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan Pajak", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Laporan Keuangan Badan (Kompleks) 1 Tahun",
    highlight: false,
    price: 1500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Laporan%20Keuangan%20Badan%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan Pajak", status: true },
      { feature: "Laporan SPT", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultasi Pajak UMKM (Sederhana) 1 Tahun",
    highlight: false,
    price: 500000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultasi%20Pajak%20UMKM%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultasi Pajak UMKM (Kompleks) 1 Tahun",
    highlight: false,
    price: 1000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultasi%20Pajak%20UMKM%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan SPT", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultasi Pajak Badan (Sederhana) 1 Tahun",
    highlight: false,
    price: 1000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultasi%20Pajak%20Badan%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan Pajak", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Konsultasi Pajak Badan (Kompleks) 1 Tahun",
    highlight: false,
    price: 2000000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Konsultasi%20Pajak%20Badan%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Jurnal Keuangan", status: true },
      { feature: "Laporan Neraca", status: true },
      { feature: "Laporan Laba / Rugi", status: true },
      { feature: "Rekonsiliasi Bank", status: true },
      { feature: "Laporan Pajak", status: true },
      { feature: "Laporan SPT", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Anggaran Keuangan UMKM (Sederhana) 1 Tahun",
    highlight: false,
    price: 400000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Anggaran%20Keuangan%20UMKM%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Penyusunan Anggaran", status: true },
      { feature: "Analisis Anggaran", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Anggaran Keuangan UMKM (Kompleks) 1 Tahun",
    highlight: false,
    price: 800000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Anggaran%20Keuangan%20UMKM%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Penyusunan Anggaran", status: true },
      { feature: "Analisis Anggaran", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Anggaran Keuangan Badan (Sederhana) 1 Tahun",
    highlight: false,
    price: 600000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Anggaran%20Keuangan%20Badan%20(Sederhana)%201%20Tahun!",
    features: [
      { feature: "Penyusunan Anggaran", status: true },
      { feature: "Analisis Anggaran", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
  },
  {
    serviceId: 8,
    type: "Penyusunan Anggaran Keuangan Badan (Kompleks) 1 Tahun",
    highlight: false,
    price: 1200000,
    discount: 36,
    link: "https://api.whatsapp.com/send?phone=628887127000&text=Halo!%20Saya%20mau%20konsultasi%20terkait%20Penyusunan%20Anggaran%20Keuangan%20Badan%20(Kompleks)%201%20Tahun!",
    features: [
      { feature: "Penyusunan Anggaran", status: true },
      { feature: "Analisis Anggaran", status: true },
      { feature: "Perencanaan Pajak", status: true },
    ],
  },
];

// Badan Usaha Packages Data (serviceId: 4)
export const BadanUsahaPackagesData = [
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
export const HakiPackagesData = [
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
export const goSpacePackagesData = [
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

// Jasa Akuntansi Packages Data (serviceId: 9)
export const AccountantPackagesData = [
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet Kurang dari 2,5 M (1 Tahun)",
    highlight: true,
    price: 800000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 2,5M s/d 5M (1 Tahun)",
    highlight: false,
    price: 1300000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 5M s/d 7,5M (1 Tahun)",
    highlight: false,
    price: 1800000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 7,5M s/d 10M (1 Tahun)",
    highlight: false,
    price: 2300000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 10M s/d 12,5M (1 Tahun)",
    highlight: false,
    price: 2800000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 12,5M s/d 15M (1 Tahun)",
    highlight: false,
    price: 3300000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 15M s/d 17,5M (1 Tahun)",
    highlight: false,
    price: 3800000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 17,5M s/d 20M (1 Tahun)",
    highlight: false,
    price: 4300000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 20M s/d 25M (1 Tahun)",
    highlight: false,
    price: 4800000,
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
  },
  {
    serviceId: 9,
    type: "Jasa Akuntansi (Kontrak) Omzet 25M s/d 30M (1 Tahun)",
    highlight: false,
    price: 5300000,
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
  },
];

// Layanan Izin & Sertifikasi Packages Data (serviceId: 6)
export const servicePackagesData = [
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

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...\n");

  // Seed Users
  console.log("👤 Seeding users...");
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

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`✅ User created or already exists: ${createdUser.email}`);
  }

  // Seed Website Development Packages
  // console.log("\n📦 Seeding Website Development packages...");

  // for (const pkg of websitePackagesData) {
  //   // Calculate priceOriginal
  //   const priceOriginal =
  //     pkg.discount > 0
  //       ? Math.round(pkg.price / (1 - pkg.discount / 100))
  //       : pkg.price;

  //   try {
  //     const createdPackage = await prisma.package.create({
  //       data: {
  //         serviceId: pkg.serviceId,
  //         type: pkg.type,
  //         highlight: pkg.highlight,
  //         price: pkg.price,
  //         discount: pkg.discount,
  //         priceOriginal: priceOriginal,
  //         link: pkg.link,
  //         features: {
  //           create: pkg.features.map((f) => ({
  //             status: f.status,
  //             feature: {
  //               connectOrCreate: {
  //                 where: { name: f.feature },
  //                 create: { name: f.feature },
  //               },
  //             },
  //           })),
  //         },
  //       },
  //     });
  //     console.log(`✅ Package created: ${createdPackage.type}`);
  //   } catch (error) {
  //     console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
  //     console.error(error);
  //   }
  // }

  // Seed Social Media Packages
  // console.log("\n📦 Seeding Socmed Management packages...");

  // for (const pkg of socialMediaPackagesData) {
  //   // Calculate priceOriginal
  //   const priceOriginal =
  //     pkg.discount > 0
  //       ? Math.round(pkg.price / (1 - pkg.discount / 100))
  //       : pkg.price;

  //   try {
  //     const createdPackage = await prisma.package.create({
  //       data: {
  //         serviceId: pkg.serviceId,
  //         type: pkg.type,
  //         highlight: pkg.highlight,
  //         price: pkg.price,
  //         discount: pkg.discount,
  //         priceOriginal: priceOriginal,
  //         link: pkg.link,
  //         features: {
  //           create: pkg.features.map((f) => ({
  //             status: f.status,
  //             feature: {
  //               connectOrCreate: {
  //                 where: { name: f.feature },
  //                 create: { name: f.feature },
  //               },
  //             },
  //           })),
  //         },
  //       },
  //     });
  //     console.log(`✅ Package created: ${createdPackage.type}`);
  //   } catch (error) {
  //     console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
  //     console.error(error);
  //   }
  // }

  console.log("\n📦 Seeding PT Packages Data...");

  for (const pkg of PTPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding CV Packages Data...");

  for (const pkg of CVPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding VO Packages Data...");

  for (const pkg of VirtualOfficePackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding Konsultan Pajak Packages Data...");

  for (const pkg of KonsultanPajakPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding Badan Usaha Packages Data...");

  for (const pkg of BadanUsahaPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding HAKI Packages Data...");

  for (const pkg of HakiPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding Go Space Packages Data...");

  for (const pkg of goSpacePackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding Akuntansi Packages Data...");

  for (const pkg of AccountantPackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
    }
  }

  console.log("\n📦 Seeding Service Packages Data...");

  for (const pkg of servicePackagesData) {
    // Calculate priceOriginal
    const priceOriginal =
      pkg.discount > 0
        ? Math.round(pkg.price / (1 - pkg.discount / 100))
        : pkg.price;

    try {
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
            create: pkg.features.map((f) => ({
              status: f.status,
              feature: {
                connectOrCreate: {
                  where: { name: f.feature },
                  create: { name: f.feature },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Package created: ${createdPackage.type}`);
    } catch (error) {
      console.log(`⚠️  Package might already exist or error: ${pkg.type}`);
      console.error(error);
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
