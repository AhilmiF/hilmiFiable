import ig from "../../assets/icons/ig.svg"
import linkind from "../../assets/icons/linkind.svg"
import { getFileUrl } from "../../services/api"
import lawyerSatu from "../../assets/image/timKami/lawyer/lawyerSatu.png"
import lawyerDua from "../../assets/image/timKami/lawyer/lawyerdua.png"

const FALLBACK_LAWYER_IMAGES = [lawyerSatu, lawyerDua]

const LawyerCard = ({ member, index = 0 }) => {
  const hasValidPortfolio =
    member.portfolioUrl &&
    member.portfolioUrl.trim() !== "" &&
    member.portfolioUrl !== "..." &&
    !member.portfolioUrl.includes("undefined")

  const portfolioDownloadUrl = hasValidPortfolio ? getFileUrl(member.portfolioUrl) : null

  const getImageSrc = () => {
    if (member.photo && typeof member.photo === "object") return member.photo
    if (typeof member.photo === "string") {
      if (member.photo.includes("lawyerSatu")) return lawyerSatu
      if (member.photo.includes("lawyerdua") || member.photo.includes("lawyerDua")) return lawyerDua
      if (member.photo.startsWith("http://") || member.photo.startsWith("https://")) return member.photo
      if (member.photo.startsWith("/uploads/") || member.photo.startsWith("uploads/")) return getFileUrl(member.photo)
    }
    if (member.photoUrl) {
      if (member.photoUrl.includes("lawyerSatu")) return lawyerSatu
      if (member.photoUrl.includes("lawyerdua") || member.photoUrl.includes("lawyerDua")) return lawyerDua
      if (member.photoUrl.startsWith("http://") || member.photoUrl.startsWith("https://")) return member.photoUrl
      if (member.photoUrl.startsWith("/uploads/") || member.photoUrl.startsWith("uploads/")) return getFileUrl(member.photoUrl)
    }
    return FALLBACK_LAWYER_IMAGES[index % FALLBACK_LAWYER_IMAGES.length]
  }

  const defaultFallback = FALLBACK_LAWYER_IMAGES[index % FALLBACK_LAWYER_IMAGES.length]

  return (
    <div className="flex w-full max-w-100.75 flex-col justify-baseline">
      <img
        src={getImageSrc()}
        alt={member.name}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = defaultFallback
        }}
        className="h-auto w-full object-cover"
      />
      <div className="mt-4">
        <h3 className="text-xl font-bold text-heading sm:text-[25px]">
          {member.name}
        </h3>
        {member.specialty && (
          <p className="text-lg sm:text-[23px]">
            <span className="text-paragraf">Spesialisasi: {member.specialty}</span>
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
  )
}

export default LawyerCard
