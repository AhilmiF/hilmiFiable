import ig from "../../assets/icons/ig.svg"
import linkind from "../../assets/icons/linkind.svg"
import { getFileUrl } from "../../services/api"

const LawyerCard = ({ member }) => {
  const hasValidPortfolio =
    member.portfolioUrl &&
    member.portfolioUrl.trim() !== "" &&
    member.portfolioUrl !== "..." &&
    !member.portfolioUrl.includes("undefined")

  const portfolioDownloadUrl = hasValidPortfolio ? getFileUrl(member.portfolioUrl) : null

  return (
    <div className="flex w-full max-w-100.75 flex-col justify-baseline">
      <img
        src={member.photo || (member.photoUrl ? getFileUrl(member.photoUrl) : "/assets/image/placeholder.png")}
        alt={member.name}
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
