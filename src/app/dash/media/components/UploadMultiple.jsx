import { useState } from "react";
import "./UploadMultiple.css";
export default function MultiFileUpload(props) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadsuccess, setUploadSuccess] = useState(false);

  const { refreshcallback, currentpath, currentfolder } = props; // Destructure refreshcallback from props if needed

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  function getCsrfToken() {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1];
    }
    return null; // Return null if running on the server
  }
  const csrfToken = getCsrfToken();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append("currentpath", currentpath || "");
    formData.append("currentfolder", currentfolder || "");
    console.log("Submitting files:", selectedFiles);
    console.log(formData, "formData");


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/uploadmultiple`, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include CSRF token in the request headers
        },
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();
      console.log("Upload result:", result);
      if (!response.ok) {
        console.log("Upload failed:", result.error || "Unknown error");
      }
      else {
        setSelectedFiles([]);
        document.querySelector(".uploadmultipleinput").value = ""; // Clear the file input
        refreshcallback()
      }


    }
    catch (err) {
      console.log("Upload error:", err);
    }
  };

  return (
    <div
      className="uploadmultipleform">
      <div className="uploadmultipleformdiv">
        <input className="uploadmultipleinput cursor-pointer" type="file" multiple onChange={handleFileChange} />
        <button type="button" className="button button-primary ml-3" onClick={(e) => handleSubmit(e)}>Upload </button>
      </div>

      <div className="selectedfileslistdiv">
        {selectedFiles.map((file, idx) => (
          <div key={idx}>
            {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        ))}
      </div>
    </div>
  );
}
