import "./App.css";
import { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import Results from "./Results";

function App() {
  const [image, setImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [predictionResults, setPredictionResults] = useState([]);
  const [results, setResults] = useState([]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setSelectedImage(e.target.files[0]);
      setResults(["Result 1", "Result 2", "Result 3"]);
      setPreviewOpen(true);
      setUploadButtonText("Change Image");
    } else {
      setPreviewOpen(false);
      setUploadButtonText("Upload Image");
    }
  };

  function handleImageChange(e) {
    setSelectedImage(e.target.files[0]);
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
    setUploadButtonText("Upload Image");
  }

  const endpoints = [
    "http://localhost:5000/predict/cnn",
    "http://localhost:5000/predict/vit",
    "http://localhost:5000/predict/ensemble",
  ];

  const onSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }
    setPredictionResults([]);
    var formdata = new FormData();
    formdata.append("image", selectedImage);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const results = [];
      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, requestOptions);
        const result = await response.json();
        results.push(result);
      }
      setPredictionResults(results); // update state with the results
      console.log(results);
      alert("Images submitted successfully!");
      closePreview();
    } catch (error) {
      console.log("error", error);
      alert("Failed to submit images. Please try again.");
    }
  };

  return (
    <div className="App">
      <header>
        <div class="header-content">
          <nav>
            <div class="logo">AI-DermaScanner</div>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </nav>
          <div className="hero">
            <h2>Diagnose Skin Lesions Online</h2>
            <p>
              Our advanced algorithm can help you diagnose skin lesions
              accurately and quickly.
            </p>
            <div className="upload-button-container">
              <button
                className="upload-button"
                onClick={() => document.getElementById("image-upload").click()}
              >
                {uploadButtonText}
              </button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
            {selectedImage && previewOpen && (
              <div className="image-preview">
                <div className="preview-container">
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                  <button onClick={closePreview}>Close</button>
                  {!predictionResults.length ? (
                    <button onClick={onSubmit}>Submit</button>
                  ) : (
                    <div>
                      {predictionResults.map((result, index) => (
                        <div key={index}>
                          <p>{endpoints[index]}</p>
                          <p>{JSON.stringify(result)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="heroin">
          <h2>How does Artificial Intelligence analyze images?</h2>
          <p>
            AI Dermatologist uses a deep machine learning algorithm
            (AI-algorithm). The human ability to learn from examples and
            experiences has been transferred to a computer. For this purpose,
            the neural network has been trained using a dermoscopic imaging
            database containing tens of thousands of examples that have
            confirmed diagnosis and assessment by dermatologists.
          </p>
          {/* <button>Check your skin</button> */}
        </div>
        <section className="features">
          <div className="feature">
            <i className="fas fa-search"></i>
            <h3>Fast Diagnosis</h3>
            <p>
              Get a quick and accurate diagnosis of your skin lesion in just a
              few minutes.
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-shield-alt"></i>
            <h3>Secure and Private</h3>
            <p>Your data is safe with us. We take your privacy seriously.</p>
          </div>
          <div className="feature">
            <i className="fas fa-user-md"></i>
            <h3>Expert Support</h3>
            <p>
              If you need further assistance, our team of experts is here to
              help you.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <p>© 2023 Skin Lesion Web App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
