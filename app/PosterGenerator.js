'use client';

import { useState, useRef, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import styles from './PosterGenerator.module.css';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function PosterGenerator() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('100'); 
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // --- CONFIGURATION ---
  const PRIMARY_COLOR = "#0b4627"; 
  const TEXT_Y_POSITION = 0.54;    
  
  const PRICE_X = 0.29;   // 29% from left
  const PRICE_Y = 0.185;  // 18.5% from top

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImageLoaded(true);
          setTimeout(() => drawPoster(), 0); 
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawPoster = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // 1. Draw Background
    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;

    // 2. Draw Price Text (No Background Box)
    if (price) {
        const priceFontSize = w * 0.045; 
        ctx.font = `bold ${priceFontSize}px ${poppins.style.fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff"; // White text
        ctx.fillText(`₹ ${price}`, PRICE_X * w, PRICE_Y * h);
    }

    // 3. Draw Name
    if (name) {
      const nameFontSize = w * 0.035; 
      ctx.font = `bold ${nameFontSize}px ${poppins.style.fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = PRIMARY_COLOR; 
      ctx.fillText(name.toUpperCase(), w / 2, h * TEXT_Y_POSITION);
    }
  };

  useEffect(() => {
    if (imageLoaded) {
      drawPoster();
    }
  }, [name, price, imageLoaded]);

  const handleDownload = () => {
    if (!imageLoaded) return alert("Please upload template first.");
    if (!name.trim()) return alert("Please enter a name.");

    const link = document.createElement('a');
    const fileName = name.trim().replace(/\s+/g, '-').toLowerCase();
    link.download = `sadaqah-${fileName}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`${styles.bodyContainer} ${poppins.className}`}>
      <div className={styles.mainCard}>
        <div className={styles.header}>
          <h1>Poster Generator</h1>
          <p>Update Name & Price</p>
        </div>

        <div className={styles.content}>
          
          {!imageLoaded && (
            <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0b4627" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p>Tap to Upload Template</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.inputGroup}>
                <label>Amount (₹)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="100" 
                />
            </div>
            
            <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Donor Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Muhammed Shakir" 
                  autoComplete="off"
                />
            </div>
          </div>

          <div className={styles.previewArea} style={{ display: imageLoaded ? 'flex' : 'none' }}>
            <canvas ref={canvasRef} />
          </div>

          <button onClick={handleDownload} className={styles.downloadBtn}>
            Download Poster
          </button>
        </div>
      </div>
    </div>
  );
}