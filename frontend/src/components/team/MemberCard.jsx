import ig from "../../assets/icons/ig.svg"
import linkind from "../../assets/icons/linkind.svg"
import { getFileUrl } from "../../services/api"

export default function MemberCard({ member }) {
  const hasValidPortfolio =
    member.portfolioUrl &&
    member.portfolioUrl.trim() !== "" &&
    member.portfolioUrl !== "..." &&
    !member.portfolioUrl.includes("undefined")

  const portfolioDownloadUrl = hasValidPortfolio ? getFileUrl(member.portfolioUrl) : null

  return (
    <div className="flex flex-col gap-6 sm:gap-10 lg:flex-row mb-12" key={member.id}>
      <img
        src={member.photo || (member.photoUrl ? getFileUrl(member.photoUrl) : "/assets/image/placeholder.png")}
        alt={member.name}
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
