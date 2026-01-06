import App from "./App.jsx";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("userImage", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://vmtteevjfwprbjezkiuj.supabase.co/functions/v1/vmodel-tryon",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();
      setResult(data.output || data.message);
    } catch (e) {
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Virtual Try On</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "See it on me"}
      </button>

      <br /><br />

      {typeof result === "string" && result.startsWith("data:image") && (
        <img src={result} style={{ maxWidth: 300 }} />
      )}

      {typeof result === "string" && !result.startsWith("data:image") && (
        <p>{result}</p>
      )}
    </div>
  );
}
