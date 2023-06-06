import "./App.css";
import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import Results from "./Results";
import { useRef } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [predictionResults, setPredictionResults] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    if (refreshPage) {
      window.location.reload();
    }
  }, [refreshPage]);
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setSelectedImage(e.target.files[0]);
      setPreviewOpen(true);

      // setUploadButtonText("Change Image");
    } else {
      setRefreshPage(true);
      setPreviewOpen(false);
      setUploadButtonText("Upload Image");
    }
  };

  function closePreview() {
    setPreviewOpen(false);
    setUploadButtonText("Upload Image");
    setRefreshPage(true);
  }
  const fileInput = React.createRef();

  const endpoints = [
    "http://164.90.225.105:5000/predict/ensemble",
    "http://164.90.225.105:5000/predict/cnn",
    "http://164.90.225.105:5000/predict/vit"
  ];
  
  const ensembleEndpoint = "http://164.90.225.105:5000/predict/ensemble";
  
  // function to handle changing the image
  const handleChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setPreviewOpen(true);
  };
  
  function handleUpload() {
    fileInput.current.click();
  }
  
  const onSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }
    setLoading(true);
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
      
      const ensembleResult = results[0];
      setPredictionResults([ensembleResult]); // update state with the ensemble results
      console.log(ensembleResult);
      // alert("Images submitted successfully!");
    } catch (error) {
      console.log("error", error);
      alert("Failed to submit images. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // const onSubmit = async () => {
  //   if (!selectedImage) {
  //     alert("Please select an image");
  //     return;
  //   }
  //   setLoading(true);
  //   setPredictionResults([]);
  //   var formdata = new FormData();
  //   formdata.append("image", selectedImage);
  
  //   var requestOptions = {
  //     method: "POST",
  //     body: formdata,
  //     redirect: "follow",
  //   };
  
  //   try {
  //     const results = [];
  //     for (const endpoint of endpoints) {
  //       const response = await fetch(endpoint, requestOptions);
  //       const result = await response.json();
  //       results.push(result);
  //     }
      
  //     const ensembleResponse = await fetch(endpoint[0], requestOptions);
  //     const ensembleResult = await ensembleResponse.json();
  //     results.push(ensembleResult);
      
  //     setPredictionResults(results); // update state with the results
  //     console.log(results);
  //     // alert("Images submitted successfully!");
  //   } catch (error) {
  //     console.log("error", error);
  //     alert("Failed to submit images. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const onSubmit = async () => {
  //   if (!selectedImage) {
  //     alert("Please select an image");
  //     return;
  //   }
  //   setLoading(true);
  //   setPredictionResults([]);
  //   var formdata = new FormData();
  //   formdata.append("image", selectedImage);

  //   var requestOptions = {
  //     method: "POST",
  //     body: formdata,
  //     redirect: "follow",
  //   };

  //   try {
  //     const results = [];
  //     // for (const endpoint of endpoints) {
  //     //   const response = await fetch(endpoint, requestOptions);
  //     //   const result = await response.json();
  //     //   results.push(result);
  //     // }
      
  //     const response = await fetch(endpoint, requestOptions);
  //     const result = await response.json();
  //     results.push(result);
      
  //     setPredictionResults(results); // update state with the results
  //     console.log(results);
  //     // alert("Images submitted successfully!");
  //   } catch (error) {
  //     console.log("error", error);
  //     alert("Failed to submit images. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="App">
      <header>
        <div class="header-content">
          <nav>
            <div class="logo">AI-DermaScanner</div>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#process">Process</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
          <div id="home" className="hero">
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
                  <img
                    height={270} width={270}
                    // height={380} width={380}
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                  />

                  {!predictionResults.length ? (
                    <div>
                      <button
                        onClick={closePreview}
                        style={{ margin: "40px 10px 0px 10px" }}
                      >
                        Close
                      </button>
                      <button
                        onClick={onSubmit}
                        style={{ margin: "40px 10px 0px 50px" }}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {predictionResults.map((result, index) => (
                          <div key={index}>
                            <h3>Skin lesion: {result.class}</h3>
                            {/* <h3>Risk percentage: {result.risk_percentage} %</h3> */}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={closePreview}
                        style={{ margin: "40px 10px 0px 10px" }}
                      >
                        Close
                      </button>

                      <a
                        href="https://www.osmosis.org/answers/skin-lesions"
                        target="_blank"
                      >
                        <button style={{ margin: "40px 10px 0px 10px" }}>
                          Primary Treatments
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <div id="about" className="heroin">
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
        <div id="process">
          <div className="heroo">
            <h2 style={{ marginLeft: "20px" }}>Take a photo</h2>
            <h4 style={{ marginRight: "20px" }}>
              Keep zoomed at the closest distance (less than 10 cm), keep in
              focus and center only the skin mark with good light condition.
            </h4>
          </div>
          <div className="heroo">
            <h2 style={{ marginLeft: "20px" }}>Identify and send</h2>
            <h4 style={{ marginRight: "20px" }}>
              Send your photo to the Artificial Intelligence. The system will
              analyze it and tell you the skin lesion type .
            </h4>
          </div>
          <div className="heroo">
            <h2 style={{ marginLeft: "20px" }}>Risk assessment</h2>
            <h4 style={{ marginRight: "20px" }}>
              Get the result within 60 seconds with the risk assesment View
              Results Online within 60 seconds 
            </h4>
          </div>
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
          <div id="contact" className="feature">
            <i className="fas fa-user-md"></i>
            <h3>Expert Support</h3>
            <p>
              If you need further assistance, our team of experts is here to
              help you.
              harshaniwanigasekara660@gmail.com
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
