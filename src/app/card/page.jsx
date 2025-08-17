'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function EditCard() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log("id:", id);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchCard/${id}`);
      if (!response.ok) {
        console.error("Failed to fetch card data");
        return;
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        console.error("No card data found");
        return;
      }
      console.log(data, "Fetched card data");
      setFormData(data[0]);
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/cards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    alert("Card updated successfully!");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Word:</label>
        <input
          type="text"
          name="word"
          value={formData.word || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>meaningEn:</label>
        <input
          type="text"
          name="meaningEn"
          value={formData.meaningEn || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Explanation:</label>
        <textarea
          name="explanation"
          value={formData.explanation || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Difficulty Level:</label>
        <input
          type="text"
          name="Meaning.DifficultyLevel"
          value={formData.Meaning?.DifficultyLevel || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              Meaning: { ...formData.Meaning, DifficultyLevel: e.target.value },
            })
          }
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
