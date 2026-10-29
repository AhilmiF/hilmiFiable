import { useEffect, useState } from "react"
import Head from "../../components/Head"
import Footer from "../../components/sections/Footer"
import Navbar from "../../components/sections/Navbar"
import MemberCard from "../../components/team/MemberCard"
import { teamCategories } from "../../data/teamData"
import { fetchTeamMembers } from "../../services/api"

const Partner = () => {
  const initialPartners = teamCategories.find((cat) => cat.id === "partner")?.member || []
  const [partners, setPartners] = useState(initialPartners)

  useEffect(() => {
    const loadPartners = async () => {
      const res = await fetchTeamMembers("partner")
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          specialty: item.specialty,
          bio: item.bio,
          bioDua: item.bioDua,
          photo: initialPartners[idx % initialPartners.length]?.photo || item.photoUrl,
          instagramUrl: item.instagramUrl,
          linkedinUrl: item.linkedinUrl,
          portfolioUrl: item.portfolioUrl,
        }))
        setPartners(mapped)
      }
    }
    loadPartners()
  }, [])

  return (
    <>
      <Navbar />
      <Head>Partner Profile</Head>
      <div className="py-5"></div>
      <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-14.75">
        {partners.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      <div className="py-5"></div>
      <Footer />
    </>
  )
}

export default Partner