import prisma from "../config/prisma.js"

// Public: Submit consultation request form
export const submitKonsultasi = async (req, res) => {
  try {
    const { name, email, phone, kronologi } = req.body

    if (!name || !email || !phone || !kronologi) {
      return res.status(400).json({
        success: false,
        message: "Semua kolom (Nama, Email, No Telepon, Kronologi) wajib diisi.",
      })
    }

    const konsultasi = await prisma.konsultasi.create({
      data: {
        name,
        email,
        phone,
        kronologi,
        status: "PENDING",
      },
    })

    res.status(201).json({
      success: true,
      message: "Pengajuan konsultasi berhasil terkirim. Tim Fiable Law Office akan segera menghubungi Anda.",
      data: konsultasi,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengirimkan pengajuan konsultasi.", error: error.message })
  }
}

// Admin: Get all consultation submissions
export const getAllKonsultasi = async (req, res) => {
  try {
    const konsultasiList = await prisma.konsultasi.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json({ success: true, data: konsultasiList })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data konsultasi.", error: error.message })
  }
}

// Admin: Update consultation status
export const updateKonsultasiStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ success: false, message: "Status wajib diisi." })
    }

    const updated = await prisma.konsultasi.update({
      where: { id },
      data: { status },
    })

    res.json({ success: true, message: "Status konsultasi berhasil diperbarui.", data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui status konsultasi.", error: error.message })
  }
}
