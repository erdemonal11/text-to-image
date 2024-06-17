import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_img from "../Assets/default.svg";

export const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function query(data) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/fluently/Fluently-XL-Final",
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch image");
      }

      const result = await response.blob();
      return result;
    } catch (error) {
      console.error("Error querying the API:", error);
      throw error;
    }
  }

  const generateImage = async () => {
    if (inputRef.current.value === "") {
      setErrorMessage("Please enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      const response = await query({ inputs: inputRef.current.value });
      const imageUrl = URL.createObjectURL(response);
      setImageUrl(imageUrl);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("An error occurred while generating the image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUrl("/");
    setErrorMessage("");
    inputRef.current.value = "";
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ai">
      <div className="header">
        AI image <span>generator</span>
      </div>
      <div className="img-load">
        <div className="image">
          <img src={imageUrl === "/" ? default_img : imageUrl} alt="Generated" />
          {imageUrl === "/" && (
            <div className="search-bar">
              <input
                type="text"
                ref={inputRef}
                className="search-input"
                placeholder="What would you like to visualize?"
                disabled={loading}
              />
            </div>
          )}
          {loading ? (
            <div className="loading-bar-container">
              <div className="loading-bar"></div>
            </div>
          ) : (
            <div>
              {imageUrl === "/" ? (
                <div className="generate-btn" onClick={generateImage}>Generate</div>
              ) : (
                <div>
                  <div className="back-btn" onClick={reset}>Go Back</div>
                  <div className="download-btn" onClick={downloadImage}>Download</div>
                </div>
              )}
            </div>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
      <div className="erdemlabel"><a href="https://github.com/erdemonal11" target="_blank" className="erdemlabel">erdemapps.</a></div>
      <div>Due to high API maintenance, you may encounter errors while generating images. </div>
    </div>
  );
};
