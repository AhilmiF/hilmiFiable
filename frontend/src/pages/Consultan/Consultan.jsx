import { useEffect, useState } from "react"
import Head from "../../components/Head"
import Footer from "../../components/sections/Footer"
import Navbar from "../../components/sections/Navbar"
import MemberCard from "../../components/team/MemberCard"
import { teamCategories } from "../../data/teamData"
import { fetchTeamMembers } from "../../services/api"

const Consultan = () => {
  const initialConsultants = teamCategories.find((cat) => cat.id === "legalConsultan")?.members || []
  const [consultants, setConsultants] = useState(initialConsultants)

  useEffect(() => {
    const loadConsultants = async () => {
      const res = await fetchTeamMembers("legalConsultan")
      if (res.success && res.data && res.data.length > 0) {
        const dbMap = new Map(res.data.map((item) => [item.name.toLowerCase().trim(), item]))

        const merged = initialConsultants.map((init) => {
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

        setConsultants(merged)
      }
    }
    loadConsultants()
  }, [])

  return (
    <>
      <Navbar />
      <Head>Legal Consultant Profile</Head>
      <div className="py-5"></div>
      <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14.75">
        {consultants.map((member, index) => (
          <MemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
      <div className="py-5"></div>
      <Footer />
    </>
  )
}

export default Consultan
