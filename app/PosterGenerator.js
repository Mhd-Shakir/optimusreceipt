"use client";

import { useState, useRef, useEffect } from 'react';

export default function PosterGenerator() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(''); 
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default Image Path
  const [imageSrc, setImageSrc] = useState('/optimus receipt.jpg');

  // --- FINAL COORDINATES ---
  const TEXT_COLOR = "#ffffff"; 

  // 1. PRICE POSITION (Left Aligned)
  // X=0.18: Aligns with the start of "Gratefully"
  // Y=0.15: Sits above the text
  const PRICE_X_POS = 0.18; 
  const PRICE_Y_POS = 0.15; 
  
  // 2. NAME POSITION (Left Aligned)
  // X=0.24: Starts right after the pre-printed "Dear"
  // Y=0.533: Sits perfectly on the dotted line after "Dear"
  const NAME_X_POS = 0.25; 
  const NAME_Y_POS = 0.527;
  // ---------------------

  // Initialize Canvas when Image loads or changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      document.fonts.ready.then(() => {
        ctx.drawImage(img, 0, 0);
        setIsLoaded(true);
        drawPoster(img); 
      });
    };
  }, [imageSrc]);

  // Redraw when Name or Price changes
  useEffect(() => {
    if (isLoaded) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => drawPoster(img);
    }
  }, [name, price, isLoaded]);

  const drawPoster = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Reset Canvas
    ctx.drawImage(img, 0, 0);

    ctx.textBaseline = "middle";
    ctx.fillStyle = TEXT_COLOR;

    // 2. Draw Price (Left Aligned, Above Text)
    if (price.trim()) {
      ctx.textAlign = "left"; // Left Align
      const priceFontSize = canvas.width * 0.08; // Big Font
      ctx.font = `800 ${priceFontSize}px sans-serif`; 
      const priceText = `₹ ${price.trim()}`;
      ctx.fillText(priceText, canvas.width * PRICE_X_POS, canvas.height * PRICE_Y_POS);
    }

    // 3. Draw Name (Left Aligned, On dotted line after "Dear")
    if (name.trim()) {
      ctx.textAlign = "left"; // Left Align
      const nameFontSize = canvas.width * 0.035; // Bigger font size than "Dear"
      ctx.font = `700 ${nameFontSize}px sans-serif`; // Bold font
      // Draws text after "Dear"
      ctx.fillText(name, canvas.width * NAME_X_POS, canvas.height * NAME_Y_POS);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    if (!name.trim() && !price.trim()) {
      alert("Please enter details first.");
      return;
    }
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    let fileName = 'Optimus-Receipt';
    if (name.trim()) fileName += `-${name.trim().replace(/\s+/g, '-')}`;
    link.download = fileName + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#b50014] p-6 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Optimus Receipt</h1>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">

          {/* UPLOAD OPTION */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-sm text-gray-500 font-semibold">
              Tap to Upload / Change Poster Template
            </p>
          </div>
          
          {/* Inputs Row */}
          <div className="flex gap-4">
            <div className="w-1/3 space-y-2">
                <label className="text-xs font-bold text-gray-700 block uppercase">Amount</label>
                <input
                type="number"
                placeholder="₹"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-2 py-3 text-lg font-bold text-center text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-[#b50014] focus:outline-none"
                />
            </div>

            <div className="w-2/3 space-y-2">
                <label className="text-xs font-bold text-gray-700 block uppercase">Donor Name</label>
                <input
                type="text"
                placeholder="Muhammed Shakir"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-lg font-semibold text-center text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-[#b50014] focus:outline-none"
                />
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-gray-50 p-2 border border-gray-200 rounded-lg">
            <canvas ref={canvasRef} className="w-full h-auto block rounded" />
          </div>

          {/* Download Button */}
          <button
            onClick={downloadImage}
            disabled={!isLoaded || (!name.trim() && !price.trim())}
            className="w-full bg-[#b50014] hover:bg-[#960010] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}