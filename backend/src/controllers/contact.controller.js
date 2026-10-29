import prisma from "../config/prisma.js"

// Public: Get office contact information
export const getContactInfo = async (req, res) => {
  try {
    const contact = await prisma.contactInfo.findFirst()
    res.json({ success: true, data: contact })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data kontak.", error: error.message })
  }
}

// Admin: Update contact info
export const updateContactInfo = async (req, res) => {
  try {
    const { address, email, phone, mapEmbedUrl } = req.body
    const contact = await prisma.contactInfo.findFirst()

    let updated
    if (contact) {
      updated = await prisma.contactInfo.update({
        where: { id: contact.id },
        data: { address, email, phone, mapEmbedUrl },
      })
    } else {
      updated = await prisma.contactInfo.create({
        data: { address, email, phone, mapEmbedUrl },
      })
    }

    res.json({ success: true, message: "Informasi kontak berhasil diperbarui.", data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui informasi kontak.", error: error.message })
  }
}
