import prisma from "../config/prisma.js"

// Public: Get all gallery photos
export const getGalleries = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json({ success: true, data: galleries })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data galeri.", error: error.message })
  }
}

// Admin: Upload gallery photo
export const createGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File foto wajib diupload." })
    }

    const photoUrl = `/uploads/${req.file.filename}`
    const gallery = await prisma.gallery.create({ data: { photoUrl } })

    res.status(201).json({ success: true, message: "Foto berhasil ditambahkan.", data: gallery })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambahkan foto.", error: error.message })
  }
}

// Admin: Delete gallery photo
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.gallery.delete({ where: { id } })
    res.json({ success: true, message: "Foto berhasil dihapus." })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus foto.", error: error.message })
  }
}
