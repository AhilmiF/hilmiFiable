import { useEffect, useState } from "react"
import { artikelData as initialData } from "../../../data/artikelData"
import ArtikelCart from "../../ArtikelCart"
import { fetchArtikels } from "../../../services/api"

const ArtikelLay = () => {
  const [articles, setArticles] = useState([...initialData, ...initialData])

  useEffect(() => {
    const loadArticles = async () => {
      const res = await fetchArtikels()
      if (res.success && res.data && res.data.length > 0) {
        // Map backend fields to frontend props if needed
        const mapped = res.data.map((item) => ({
          id: item.id,
          judul: item.judul,
          keterangan: item.keterangan,
          photo: item.photoUrl || initialData[0].photo,
        }))
        setArticles(mapped)
      }
    }
    loadArticles()
  }, [])

  return (
    <section className="bg-[#f5f5f5] px-5 py-16 sm:px-10 sm:py-24 lg:px-14.75 lg:py-32.75">
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {articles.map((item, index) => (
          <ArtikelCart key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  )
}

export default ArtikelLay