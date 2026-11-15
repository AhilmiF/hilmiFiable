import { getFileUrl } from "../../services/api"
import artikelSatu from "../../assets/image/artikel/artikelSatu.png"
import artikelDua from "../../assets/image/artikel/artikelDua.png"
import artikelTiga from "../../assets/image/artikel/artikelTiga.png"

const FALLBACK_IMAGES = [artikelSatu, artikelDua, artikelTiga]

const ArtikelCart = ({ item, index = 0 }) => {
  const getImageSrc = () => {
    if (!item.photo) {
      return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
    }

    // Jika path berupa string path lokal vite dev yang tersimpan di DB
    if (typeof item.photo === "string") {
      if (item.photo.includes("artikelSatu")) return artikelSatu
      if (item.photo.includes("artikelDua")) return artikelDua
      if (item.photo.includes("artikelTiga")) return artikelTiga

      // Jika hasil upload dari backend (/uploads/...)
      if (item.photo.startsWith("/uploads/") || item.photo.startsWith("uploads/")) {
        return getFileUrl(item.photo)
      }

      if (item.photo.startsWith("http://") || item.photo.startsWith("https://")) {
        return item.photo
      }
    }

    // Jika objek impor bundler
    return item.photo || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }

  return (
    <div className="flex h-auto min-h-96 w-full max-w-128.25 flex-col overflow-hidden bg-white font-artikel shadow-sm rounded-sm lg:h-153 lg:min-h-0">
      <div className="w-full">
        <img
          src={getImageSrc()}
          alt={item.judul}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
          }}
        />
        <h1 className="p-5 text-xl font-bold text-heading sm:text-[28px]">{item.judul}</h1>
        <p className="px-5 pb-5 text-lg font-normal text-paragraf sm:text-[24px]">{item.keterangan}</p>
      </div>
    </div>
  )
}

export default ArtikelCart
