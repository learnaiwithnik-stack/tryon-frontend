import { useState } from "react";

/* 👗 SAMPLE CATALOG (you can change later) */
const PRODUCTS = [
  {
    id: 1,
    name: "Red Party Dress",
    image: "https://via.placeholder.com/200x260?text=Red+Dress",
    prompt: "red party dress"
  },
  {
    id: 2,
    name: "Casual Blue Top",
    image: "https://via.placeholder.com/200x260?text=Blue+Top",
    prompt: "casual blue top"
  },
  {
    id: 3,
    name: "Traditional Saree",
    image: "https://via.placeholder.com/200x260?text=Saree",
    prompt: "traditional indian saree"
  }
];

export default function App() {
  const [file, setFile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTryOn(product) {
    if (!file) {
      alert("Please upload your photo first");
      return;
    }

    setSelectedProduct(product);
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("userImage", file);
    formData.append("garmentPrompt", product.prompt);

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
    } catch {
      alert("Try-on failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Virtual Try On</h2>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <hr style={{ margin: "20px 0" }} />

      {/* Catalog */}
      <h3>Select a Product</h3>

      <div style={{ display: "flex", gap: 20 }}>
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              width: 200,
              textAlign: "center"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%" }}
            />
            <p>{product.name}</p>
            <button onClick={() => handleTryOn(product)}>
              Try On
            </button>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && <p>Processing try-on...</p>}

      {/* Result */}
      {typeof result === "string" && result.startsWith("data:image") && (
        <div style={{ marginTop: 30 }}>
          <h3>Result</h3>
          <img src={result} alt="Result" style={{ maxWidth: 300 }} />
        </div>
      )}

      {typeof result === "string" && !result.startsWith("data:image") && (
        <p>{result}</p>
      )}
    </div>
  );
}
