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
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: "You are Sarah's private assistant to help her build and improve her UX/UI portfolio website. Help her with layout decisions, writing case studies, structuring her work, choosing what to include, and giving feedback on her designs. Be direct and give actionable advice.",
        messages: [{ role: "user", content: message }]
      })
    })

    const data = await response.json()
    res.json({ reply: data.content[0].text })

  } catch (error) {
    res.status(500).json({ reply: "Sorry, something went wrong. Please try again." })
  }
}
