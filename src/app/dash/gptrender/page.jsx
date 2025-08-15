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
    <>
      <div className="gpt-container">
        <form onSubmit={handleSubmit}>
          <label>
            Enter your prompt:
            <input
              type="text"
              value={prompt}
              name="userprompt"
              onChange={(e) => setPrompt(e.target.value)}
              className="gpt-input"
              required
            />
          </label>
          <button type="submit" disabled={loading} className="gpt-button">
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        <div className="gpt-result-container">
          <h3>Result:</h3>
          <div
            className="gpt-result"
            dangerouslySetInnerHTML={{ __html: result }}
          />
          <h4 className="gpt-raw-html-title">Raw HTML:</h4>
          <textarea
            className="gpt-raw-html"
            value={result}
            readOnly
          />
        </div>
      </div>

      {/*   <style jsx nonce={nonce}>{`
        .gpt-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        .gpt-input {
          width: 100%;
          margin: 10px 0;
          padding: 8px;
        }
        .gpt-button {
          padding: 8px 16px;
        }
        .gpt-result-container {
          margin-top: 30px;
        }
        .gpt-result {
          min-height: 60px;
          border: 1px solid #ccc;
          padding: 12px;
          background: #fafafa;
        }
        .gpt-raw-html-title {
          margin-top: 20px;
        }
        .gpt-raw-html {
          width: 100%;
          min-height: 80px;
          margin-top: 8px;
          font-family: monospace;
        }
      `}</style> */}
    </>
  );
}
