import prisma from "../config/prisma.js"

// Public: Get all positions
export const getPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { createdAt: "asc" },
    })
    res.json({ success: true, data: positions })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data posisi.", error: error.message })
  }
}

// Admin: Create position
export const createPosition = async (req, res) => {
  try {
    const { name, slug } = req.body
    if (!name) {
      return res.status(400).json({ success: false, message: "Nama posisi wajib diisi." })
    }

    const position = await prisma.position.create({ data: { name, slug: slug || null } })
    res.status(201).json({ success: true, message: "Posisi berhasil ditambahkan.", data: position })
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Nama posisi sudah ada." })
    }
    res.status(500).json({ success: false, message: "Gagal menambahkan posisi.", error: error.message })
  }
}

// Admin: Update position
export const updatePosition = async (req, res) => {
  try {
    const { id } = req.params
    const { name, slug } = req.body

    const position = await prisma.position.update({
      where: { id },
      data: { name, slug: slug || null },
    })
    res.json({ success: true, message: "Posisi berhasil diperbarui.", data: position })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui posisi.", error: error.message })
  }
}

// Admin: Delete position
export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.position.delete({ where: { id } })
    res.json({ success: true, message: "Posisi berhasil dihapus." })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus posisi.", error: error.message })
  }
}
