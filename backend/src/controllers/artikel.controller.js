import prisma from "../config/prisma.js"

// Public: Get all articles
export const getArtikels = async (req, res) => {
  try {
    const { search } = req.query
    const where = search
      ? {
          OR: [
            { judul: { contains: search } },
            { keterangan: { contains: search } },
          ],
        }
      : {}

    const artikels = await prisma.artikel.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, data: artikels })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data artikel.", error: error.message })
  }
}

// Public: Get article by ID or Slug
export const getArtikelByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params
    const artikel = await prisma.artikel.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    })

    if (!artikel) {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan." })
    }

    res.json({ success: true, data: artikel })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil rincian artikel.", error: error.message })
  }
}

// Admin: Create article
export const createArtikel = async (req, res) => {
  try {
    const { judul, slug, keterangan, kategori, konten } = req.body
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photoUrl || ""

    if (!judul || !keterangan) {
      return res.status(400).json({ success: false, message: "Judul dan keterangan wajib diisi." })
    }

    const generatedSlug = slug || judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")

    const artikel = await prisma.artikel.create({
      data: {
        judul,
        slug: generatedSlug,
        keterangan,
        kategori: kategori || "",
        konten: konten || "",
        photoUrl,
      },
    })

    res.status(201).json({ success: true, message: "Artikel berhasil dibuat.", data: artikel })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal membuat artikel.", error: error.message })
  }
}

// Admin: Update article
export const updateArtikel = async (req, res) => {
  try {
    const { id } = req.params
    const { judul, slug, keterangan, kategori, konten } = req.body
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photoUrl

    const artikel = await prisma.artikel.update({
      where: { id },
      data: { judul, slug, keterangan, kategori, konten, photoUrl },
    })

    res.json({ success: true, message: "Artikel berhasil diperbarui.", data: artikel })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui artikel.", error: error.message })
  }
}

// Admin: Delete article
export const deleteArtikel = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.artikel.delete({ where: { id } })
    res.json({ success: true, message: "Artikel berhasil dihapus." })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus artikel.", error: error.message })
  }
}
