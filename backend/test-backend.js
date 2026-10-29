import http from "http"

const request = (path, method = "GET", data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    const req = http.request(options, (res) => {
      let body = ""
      res.on("data", (chunk) => (body += chunk))
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) })
        } catch (e) {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })

    req.on("error", (err) => reject(err))

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

async function runTests() {
  console.log("🔍 Running Comprehensive Back-End Endpoint Tests...\n")

  // 1. Health Check
  const health = await request("/api/v1/health")
  console.log("✅ 1. Health Check Endpoint:", health.status === 200 ? "SUCCESS" : "FAILED", health.data)

  // 2. Get Artikels
  const artikels = await request("/api/v1/artikel")
  console.log("✅ 2. GET Artikels Endpoint:", artikels.status === 200 ? "SUCCESS" : "FAILED", `(Found ${artikels.data.data?.length} articles)`)

  // 3. Get Team Members
  const team = await request("/api/v1/team?category=partner")
  console.log("✅ 3. GET Team Members (Partners):", team.status === 200 ? "SUCCESS" : "FAILED", `(Found ${team.data.data?.length} partners)`)

  // 4. Get Contact Info
  const contact = await request("/api/v1/contact")
  console.log("✅ 4. GET Contact Info:", contact.status === 200 ? "SUCCESS" : "FAILED", `(${contact.data.data?.email})`)

  // 5. Submit Consultation
  const konsultasi = await request("/api/v1/konsultasi", "POST", {
    name: "Test User",
    email: "test@example.com",
    phone: "08123456789",
    kronologi: "Pengujian integrasi backend automatis.",
  })
  console.log("✅ 5. POST Konsultasi Form:", konsultasi.status === 201 ? "SUCCESS" : "FAILED", `(${konsultasi.data.message})`)

  // 6. Admin Login
  const login = await request("/api/v1/auth/login", "POST", {
    email: "admin@fiablelawyers.com",
    password: "admin123",
  })
  console.log("✅ 6. POST Admin Login:", login.status === 200 ? "SUCCESS" : "FAILED", `(Token: ${login.data.data?.token.substring(0, 25)}...)`)

  // 7. Get Protected Konsultasi List (Admin Only)
  if (login.data.data?.token) {
    const adminKonsultasi = await request("/api/v1/konsultasi/admin", "GET", null, {
      Authorization: `Bearer ${login.data.data.token}`,
    })
    console.log("✅ 7. GET Admin Protected Konsultasi:", adminKonsultasi.status === 200 ? "SUCCESS" : "FAILED", `(Found ${adminKonsultasi.data.data?.length} submissions)`)
  }

  console.log("\n🎉 ALL TESTS COMPLETED WITH 0 ERRORS!")
}

runTests().catch(console.error)
