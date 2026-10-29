import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // 1. Create Default Admin
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@fiablelawyers.com" },
    update: {},
    create: {
      name: "Admin Fiable",
      email: "admin@fiablelawyers.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created/found:", admin.email)

  // 2. Seed Contact Info
  await prisma.contactInfo.deleteMany()
  await prisma.contactInfo.create({
    data: {
      address: "Jalan Padang Pasir IX No. 55, Kel. Padang Pasir, Kec. Padang Barat, Kota Padang, Provinsi Sumatera Barat",
      email: "info@fiablelawyers.com",
      phone: "085375917227",
      mapEmbedUrl: "https://www.openstreetmap.org/export/embed.html?bbox=100.345%2C-0.955%2C100.375%2C-0.925&layer=mapnik&marker=-0.94%2C100.36",
    },
  })
  console.log("Contact info seeded.")

  // 2.5 Seed Positions (Categories)
  await prisma.position.deleteMany()
  const positionList = [
    { name: "Hukum", slug: "hukum" },
    { name: "Keadilan", slug: "keadilan" },
    { name: "Lirik", slug: "lirik" },
    { name: "Pilo", slug: "pilo" },
  ]
  for (const item of positionList) {
    await prisma.position.create({ data: item })
  }
  console.log("Positions/Categories seeded.")

  // 3. Seed Articles
  await prisma.artikel.deleteMany()
  const artikelList = [
    {
      judul: "Menavigasi Proses Hukum Bisnis untuk Pemula",
      slug: "menavigasi-proses-hukum-bisnis-untuk-pemula",
      keterangan: "Bagi pengusaha pemula, panduan lengkap ini akan membimbing Anda melalui kompleksitas legalitas usaha, perjanjian bisnis, serta perlindungan kekayaan intelektual.",
      konten: "Menjalankan bisnis baru memerlukan pemahaman dasar hukum yang kuat agar dapat tumbuh dengan aman dan berkelanjutan. Mulai dari pendaftaran badan hukum (PT/CV), pembuatan kontrak kerjasama, hingga kepatuhan terhadap regulasi perpajakan dan ketenagakerjaan.",
      photoUrl: "/src/assets/image/artikel/artikelSatu.png",
    },
    {
      judul: "Aspek Hukum dalam Transaksi Properti",
      slug: "aspek-hukum-dalam-transaksi-properti",
      keterangan: "Dalam dunia transaksi properti yang dinamis, ahli hukum kami berbagi tips dan trik untuk memastikan keabsahan sertifikat dan kelancaran proses AJB.",
      konten: "Transaksi properti melibatkan potensi risiko legal yang tidak kecil jika tidak diteliti dengan baik. Pemeriksaan keabsahan sertifikat tanah di BPN, verifikasi status perpajakan (BPHTB & PPh), serta draft PPJB yang menguntungkan kedua belah pihak sangatlah krusial.",
      photoUrl: "/src/assets/image/artikel/artikelDua.png",
    },
    {
      judul: "Strategi Efektif Menghadapi Sengketa Bisnis",
      slug: "strategi-efektif-menghadapi-sengketa-bisnis",
      keterangan: "Sengketa bisnis bisa menjadi ujian, tetapi dengan solusi terpercaya dari Fiable Law Office, Anda dapat menyelesaikannya secara litigasi maupun non-litigasi.",
      konten: "Ketika konflik bisnis tidak terelakkan, pilihan antara mediasi, negosiasi, arbitrase, atau gugatan perdata di Pengadilan Negeri menjadi penentu kelangsungan aset bisnis Anda. Fiable Law Office siap mendampingi di setiap tahap perundingan.",
      photoUrl: "/src/assets/image/artikel/artikelTiga.png",
    },
  ]

  for (const item of artikelList) {
    await prisma.artikel.create({ data: item })
  }
  console.log("Articles seeded.")

  // 4. Seed Team Members
  await prisma.teamMember.deleteMany()
  const teamList = [
    // Partners
    {
      name: "Kevin Pratama Putra, S.H.",
      category: "partner",
      role: "Managing Partner",
      specialty: "Litigator",
      bio: "Kevin Pratama Putra adalah pendiri dan mitra manajemen dari Fiable Law Office, telah menapaki perjalanan karier yang menginspirasi. Setelah meraih gelar dari Fakultas Hukum Universitas Andalas, Kevin memulai langkahnya sebagai Associates Lawyer di Kantor Hukum Endang Suparta & Partners yang dikenal sebagai salah satu kantor hukum terbaik di Pekanbaru, Riau. Selain itu, ia juga mengejar pengalaman berharga sebagai Pengacara Pos Pelayanan Hukum di Pengadilan Negeri Pekanbaru.",
      bioDua: "",
      photoUrl: "/src/assets/image/timKami/PartnerProfile/partnerSatu.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/kevin.pdf",
    },
    {
      name: "Muhammad Arief Azmi, S.H.",
      category: "partner",
      role: "Partner",
      specialty: "Litigator",
      bio: "Muhammad Arief Azmi adalah partner senior di Fiable Law Office dengan rekam jejak panjang dalam menangani perkara hukum pidana maupun perdata di tingkat Pengadilan Negeri hingga Mahkamah Agung.",
      bioDua: "",
      photoUrl: "/src/assets/image/timKami/PartnerProfile/partnerSatu.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/arief.pdf",
    },
    {
      name: "Vino Oktavia, S.H., M.H.",
      category: "partner",
      role: "Partner",
      specialty: "Environmental Resources Lawyer & Customary Land",
      bio: "Vino Oktavia menyelesaikan pendidikan Sarjana dan Pascasarjana pada Fakultas Hukum Universitas Andalas dengan Predikat Summa Cumlaude. Vino merupakan seorang Pengacara Senior yang telah mempunyai sertifikasi sebagai Mediator oleh Mahkamah Agung RI.",
      bioDua: "Pengalaman berharga Vino juga meliputi peran sebagai Dosen Luar Biasa di UIN Imam Bonjol Padang serta Direktur LBH Padang.",
      photoUrl: "/src/assets/image/timKami/PartnerProfile/partnerDua.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/vino.pdf",
    },
    // Legal Consultants
    {
      name: "Andre Fitra Anwar, S.H",
      category: "legalConsultan",
      role: "Legal Consultant",
      specialty: "General Corporate & Commercial",
      bio: "Andre Fitra Anwar adalah mitra legal manajemen dari Fiable Law Office. Setelah meraih gelar dari Fakultas Hukum Universitas Andalas, Andre memulai langkah karirnya sebagai Asisten Pengacara Publik di LBH Jakarta.",
      bioDua: "Andre meluncurkan karir korporatnya sebagai Head of Legal di BenihBaik.com, sebuah startup crowdfunding ternama.",
      photoUrl: "/src/assets/image/timKami/consultan/consultanSatu.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/andre.pdf",
    },
    {
      name: "Giffary Syarlas, S.H., M.H.",
      category: "legalConsultan",
      role: "Legal Consultant",
      specialty: "General Corporate & Commercial",
      bio: "Giffary Syarlas meraih gelar Sarjana di Universitas Andalas dan Magister Hukum di Universitas Indonesia. Berpengalaman di bidang korporat, kepatuhan, transaksi bisnis, dan Initial Public Offering (IPO).",
      bioDua: "",
      photoUrl: "/src/assets/image/timKami/consultan/consultanDua.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/giffary.pdf",
    },
    // Lawyers
    {
      name: "Mirza Ardila, S.H.",
      category: "lawyer",
      role: "Associate Lawyer",
      specialty: "Family Law Litigator",
      bio: "Mirza Ardila berpengalaman dalam menangani kasus hukum keluarga, perceraian, sengketa hak asuh anak, dan waris.",
      bioDua: "",
      photoUrl: "/src/assets/image/timKami/lawyer/lawyerSatu.png",
      instagramUrl: "https://instagram.com/...",
      linkedinUrl: "https://linkedin.com/in/...",
      portfolioUrl: "/portfolio/mirza.pdf",
    },
  ]

  for (const item of teamList) {
    await prisma.teamMember.create({ data: item })
  }
  console.log("Team members seeded.")
  console.log("Seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
