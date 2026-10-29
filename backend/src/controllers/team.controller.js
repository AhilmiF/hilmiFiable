import prisma from "../config/prisma.js"

// Public: Get all team members, optionally filtered by category
export const getTeamMembers = async (req, res) => {
  try {
    const { category } = req.query
    const where = category ? { category } : {}

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { createdAt: "asc" },
    })

    res.json({ success: true, data: teamMembers })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data tim.", error: error.message })
  }
}

// Public: Get team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params
    const member = await prisma.teamMember.findUnique({ where: { id } })

    if (!member) {
      return res.status(404).json({ success: false, message: "Anggota tim tidak ditemukan." })
    }

    res.json({ success: true, data: member })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil profil anggota tim.", error: error.message })
  }
}

// Admin: Create team member
export const createTeamMember = async (req, res) => {
  try {
    const { name, category, role, specialty, bio, bioDua, instagramUrl, linkedinUrl } = req.body
    const photoUrl = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : req.body.photoUrl || ""
    const portfolioUrl = req.files?.portfolio ? `/uploads/${req.files.portfolio[0].filename}` : req.body.portfolioUrl || ""

    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Nama dan kategori wajib diisi." })
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        category,
        role: role || "",
        specialty: specialty || "",
        bio: bio || "",
        bioDua: bioDua || "",
        photoUrl,
        instagramUrl: instagramUrl || "",
        linkedinUrl: linkedinUrl || "",
        portfolioUrl,
      },
    })

    res.status(201).json({ success: true, message: "Anggota tim berhasil ditambahkan.", data: member })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambahkan anggota tim.", error: error.message })
  }
}

// Admin: Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, role, specialty, bio, bioDua, instagramUrl, linkedinUrl } = req.body
    const photoUrl = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : req.body.photoUrl
    const portfolioUrl = req.files?.portfolio ? `/uploads/${req.files.portfolio[0].filename}` : req.body.portfolioUrl

    const member = await prisma.teamMember.update({
      where: { id },
      data: { name, category, role, specialty, bio, bioDua, photoUrl, instagramUrl, linkedinUrl, portfolioUrl },
    })

    res.json({ success: true, message: "Data anggota tim berhasil diperbarui.", data: member })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui data anggota tim.", error: error.message })
  }
}

// Admin: Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.teamMember.delete({ where: { id } })
    res.json({ success: true, message: "Anggota tim berhasil dihapus." })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus anggota tim.", error: error.message })
  }
}
