export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()

  try {
    const { message } = req.body

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system: "You are Sarah's private assistant helping with her UX/UI portfolio website.",
        messages: [{ role: "user", content: message || "test" }]
      })
    })

    const data = await response.json()
    
    // This will show us the exact error
    if (data.error) {
      return res.json({ reply: "API Error: " + data.error.message })
    }

    res.json({ reply: data.content[0].text })

  } catch (error) {
    res.status(500).json({ reply: "Error: " + error.message })
  }
}
