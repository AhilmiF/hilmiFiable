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
        const mapped = res.data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          specialty: item.specialty,
          bio: item.bio,
          bioDua: item.bioDua,
          photo: initialLawyers[idx % initialLawyers.length]?.photo,
          photoUrl: item.photoUrl,
          instagramUrl: item.instagramUrl,
          linkedinUrl: item.linkedinUrl,
          portfolioUrl: item.portfolioUrl,
        }))
        setLawyers(mapped)
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
