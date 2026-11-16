import { useEffect, useState } from "react"
import Head from "../../components/Head"
import Footer from "../../components/sections/Footer"
import Navbar from "../../components/sections/Navbar"
import LawyerCard from "../../components/team/LawyerCard"
import { teamCategories } from "../../data/teamData"
import { fetchTeamMembers } from "../../services/api"

const Lawyer = () => {
  const initialLawyers = teamCategories.find((cat) => cat.id === "lawyer")?.members || []
  const [lawyers, setLawyers] = useState(initialLawyers)

  useEffect(() => {
    const loadLawyers = async () => {
      const res = await fetchTeamMembers("lawyer")
      if (res.success && res.data && res.data.length > 0) {
        // Gabungkan data dari DB dengan initial static data jika data DB lebih sedikit dari template
        const dbMap = new Map(res.data.map((item) => [item.name.toLowerCase().trim(), item]))
        
        const merged = initialLawyers.map((init, idx) => {
          const matchedDb = dbMap.get(init.name.toLowerCase().trim())
          if (matchedDb) {
            dbMap.delete(init.name.toLowerCase().trim())
            return {
              ...init,
              ...matchedDb,
              photo: matchedDb.photoUrl || init.photo,
            }
          }
          return init
        })

        // Tambahkan sisa data baru dari admin DB yang belum ada di initial
        for (const extra of dbMap.values()) {
          merged.push({
            id: extra.id,
            name: extra.name,
            role: extra.role,
            specialty: extra.specialty,
            bio: extra.bio,
            bioDua: extra.bioDua,
            photo: extra.photoUrl,
            photoUrl: extra.photoUrl,
            instagramUrl: extra.instagramUrl,
            linkedinUrl: extra.linkedinUrl,
            portfolioUrl: extra.portfolioUrl,
          })
        }

        setLawyers(merged)
      }
    }
    loadLawyers()
  }, [])

  return (
    <>
      <Navbar />
      <Head>Lawyer Profile</Head>
      <div className="py-5"></div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-10 px-5 sm:px-10 lg:px-14.75">
        {lawyers.map((member, index) => (
          <LawyerCard key={member.id} member={member} index={index} />
        ))}
      </div>
      <div className="py-5"></div>
      <Footer />
    </>
  )
}

export default Lawyer
