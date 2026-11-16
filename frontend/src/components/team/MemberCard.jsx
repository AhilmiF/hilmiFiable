import ig from "../../assets/icons/ig.svg"
import linkind from "../../assets/icons/linkind.svg"
import { getFileUrl } from "../../services/api"
import partnerSatu from "../../assets/image/timKami/PartnerProfile/partnerSatu.png"
import partnerDua from "../../assets/image/timKami/PartnerProfile/partnerDua.png"
import consultanSatu from "../../assets/image/timKami/consultan/consultanSatu.png"
import consultanDua from "../../assets/image/timKami/consultan/consultanDua.png"

const FALLBACK_MEMBER_IMAGES = [partnerSatu, partnerDua, consultanSatu, consultanDua]

export default function MemberCard({ member, index = 0 }) {
  const hasValidPortfolio =
    member.portfolioUrl &&
    member.portfolioUrl.trim() !== "" &&
    member.portfolioUrl !== "..." &&
    !member.portfolioUrl.includes("undefined")

  const portfolioDownloadUrl = hasValidPortfolio ? getFileUrl(member.portfolioUrl) : null

  const getImageSrc = () => {
    // 1. Jika objek import lokal sudah valid
    if (member.photo && typeof member.photo === "object") return member.photo

    // 2. Jika string import Vite dev atau nama file aset lokal
    if (typeof member.photo === "string") {
      if (member.photo.includes("partnerSatu")) return partnerSatu
      if (member.photo.includes("partnerDua")) return partnerDua
      if (member.photo.includes("consultanSatu")) return consultanSatu
      if (member.photo.includes("consultanDua")) return consultanDua
      if (member.photo.startsWith("http://") || member.photo.startsWith("https://")) return member.photo
      if (member.photo.startsWith("/uploads/") || member.photo.startsWith("uploads/")) return getFileUrl(member.photo)
    }

    // 3. Jika ada photoUrl dari database
    if (member.photoUrl) {
      if (member.photoUrl.includes("partnerSatu")) return partnerSatu
      if (member.photoUrl.includes("partnerDua")) return partnerDua
      if (member.photoUrl.includes("consultanSatu")) return consultanSatu
      if (member.photoUrl.includes("consultanDua")) return consultanDua
      if (member.photoUrl.startsWith("http://") || member.photoUrl.startsWith("https://")) return member.photoUrl
      if (member.photoUrl.startsWith("/uploads/") || member.photoUrl.startsWith("uploads/")) return getFileUrl(member.photoUrl)
    }

    // 4. Fallback ke gambar default
    return FALLBACK_MEMBER_IMAGES[index % FALLBACK_MEMBER_IMAGES.length]
  }

  const defaultFallback = FALLBACK_MEMBER_IMAGES[index % FALLBACK_MEMBER_IMAGES.length]

  return (
    <div className="flex flex-col gap-6 sm:gap-10 lg:flex-row mb-12" key={member.id}>
      <img
        src={getImageSrc()}
        alt={member.name}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = defaultFallback
        }}
        className="h-auto w-full max-w-93 object-cover sm:w-2/3 lg:shrink-0"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-heading sm:text-[25px]">
          {member.name} {member.role && `(${member.role})`}
        </h3>
        {member.specialty && (
          <p className="text-lg sm:text-[23px]">
            <span className="text-paragraf">Spesialisasi: {member.specialty}</span>
          </p>
        )}
        <div className="h-auto w-full">
          {member.bio && (
            <p className="mt-2 text-justify text-base font-normal leading-relaxed text-heading sm:text-[23px]">
              {member.bio}
            </p>
          )}
          {member.bioDua && (
            <p className="mt-2 text-justify text-base font-normal leading-relaxed text-heading sm:text-[23px]">
              {member.bioDua}
            </p>
          )}
          <div className="flex items-center gap-3 mt-10">
            {member.instagramUrl && member.instagramUrl !== "https://" && (
              <a
                href={member.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center transition-opacity hover:opacity-80"
              >
                <img src={ig} alt="Instagram" />
              </a>
            )}

            {member.linkedinUrl && member.linkedinUrl !== "https://" && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-biru flex items-center justify-center transition-opacity hover:opacity-80"
              >
                <img src={linkind} alt="LinkedIn" className="color-white" />
              </a>
            )}

            {hasValidPortfolio ? (
              <a
                href={portfolioDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-oren w-full max-w-70 px-4 py-2 text-center text-xs font-bold uppercase text-biru transition-colors hover:bg-orange-600 hover:text-white sm:text-[18px]"
              >
                Download Portfolio
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Portfolio belum diunggah"
                className="bg-gray-300 w-full max-w-70 px-4 py-2 text-center text-xs font-bold uppercase text-gray-500 cursor-not-allowed sm:text-[18px]"
              >
                Portfolio Belum Tersedia
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
