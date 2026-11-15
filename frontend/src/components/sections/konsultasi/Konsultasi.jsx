import { useState } from "react"
import konsultasi from "../../../assets/icons/konsultasi.svg"
import mail from "../../../assets/icons/mail.svg"
import Button from "../../ui/Button"
import { submitKonsultasiForm } from "../../../services/api"

const Konsultasi = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    kronologi: "",
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: "", message: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ type: "", message: "" })

    if (!formData.name || !formData.email || !formData.phone || !formData.kronologi) {
      setFeedback({ type: "error", message: "Harap isi semua kolom sebelum mengirim." })
      return
    }

    setLoading(true)
    const result = await submitKonsultasiForm(formData)
    setLoading(false)

    if (result.success) {
      setFeedback({ type: "success", message: result.message || "Pengajuan konsultasi berhasil dikirim." })
      setFormData({ name: "", email: "", phone: "", kronologi: "" })
    } else {
      setFeedback({ type: "error", message: result.message || "Gagal mengirimkan pengajuan konsultasi." })
    }
  }

  return (
    <section className="bg-background px-5 py-16 sm:px-10 sm:py-24 lg:px-14.75 lg:py-32.75">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 lg:gap-10">
        <img src={konsultasi} alt="Konsultasi Header" className="max-w-full" />
        
        {feedback.message && (
          <div
            className={`w-full p-4 text-center font-medium rounded ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid w-full gap-5 lg:grid-cols-3 lg:gap-8">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="h-16.75 w-full bg-white p-5 focus:outline-none focus:ring-2 focus:ring-oren"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="h-16.75 w-full bg-white p-5 focus:outline-none focus:ring-2 focus:ring-oren"
            placeholder="E-mail*"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="h-16.75 w-full bg-white p-5 focus:outline-none focus:ring-2 focus:ring-oren"
            placeholder="No Telepon*"
          />
        </div>
        <textarea
          name="kronologi"
          value={formData.kronologi}
          onChange={handleChange}
          className="h-64 w-full bg-white p-5 lg:h-74.25 focus:outline-none focus:ring-2 focus:ring-oren"
          placeholder="Kronologi/Posisi Kasus"
        ></textarea>
        <Button
          type="submit"
          disabled={loading}
          className="flex w-full max-w-57.75 justify-center gap-4 text-xl uppercase sm:text-[25px] disabled:opacity-50"
          variant="secondary"
        >
          {loading ? "MENGIRIM..." : "kirim"} <img src={mail} alt="Submit Icon" />
        </Button>
      </form>
    </section>
  )
}

export default Konsultasi