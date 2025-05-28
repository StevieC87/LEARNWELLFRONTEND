'use client'
import { useState } from "react";

export default function GptRenderPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {


      const url = `${process.env.NEXT_PUBLIC_API_URL}/chatgptui`
      console.log(url, 'url')
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include", // Include cookies in the request
      });
      const data = await res.json();
      console.log(data, 'data')
      console.log(data.data, 'data.data')
      setResult(data.data || "No result");
    } catch (err) {
      setResult("Error fetching result");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your prompt:
          <input
            type="text"
            value={prompt}
            name="userprompt"
            onChange={(e) => setPrompt(e.target.value)}
            style={{ width: "100%", margin: "10px 0", padding: 8 }}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <div style={{ marginTop: 30 }}>
        <h3>Result:</h3>
        <div
          style={{
            minHeight: 60,
            border: "1px solid #ccc",
            padding: 12,
            background: "#fafafa",
          }}
          dangerouslySetInnerHTML={{ __html: result }}
        />
        <h4 style={{ marginTop: 20 }}>Raw HTML:</h4>
        <textarea
          style={{ width: "100%", minHeight: 80, marginTop: 8, fontFamily: "monospace" }}
          value={result}
          readOnly
        />
      </div>
    </div>
  );
}
