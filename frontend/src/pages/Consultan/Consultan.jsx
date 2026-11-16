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
        const mapped = res.data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          specialty: item.specialty,
          bio: item.bio,
          bioDua: item.bioDua,
          photo: initialConsultants[idx % initialConsultants.length]?.photo,
          photoUrl: item.photoUrl,
          instagramUrl: item.instagramUrl,
          linkedinUrl: item.linkedinUrl,
          portfolioUrl: item.portfolioUrl,
        }))
        setConsultants(mapped)
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
