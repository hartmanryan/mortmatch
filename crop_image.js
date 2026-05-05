const sharp = require('sharp');

async function processImages() {
  const input = 'public/mortlogo.jpg';
  
  // Create Mort Icon (Boy only) - Assuming boy is top 75% of the center
  // Image is 2816x1536. Center width ~1200px.
  await sharp(input)
    .extract({ left: 808, top: 100, width: 1200, height: 1100 })
    .toFile('public/mort_icon.jpg');

  // Create Mort Text only
  await sharp(input)
    .extract({ left: 808, top: 1200, width: 1200, height: 300 })
    .toFile('public/mort_text.jpg');

  // Composite them side by side
  await sharp({
    create: {
      width: 1200 + 1200,
      height: 1100,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: 'public/mort_icon.jpg', left: 0, top: 0 },
    { input: 'public/mort_text.jpg', left: 1200, top: 400 } // Center text vertically
  ])
  .toFile('public/mort_header.jpg');
  
  console.log("Images processed.");
}

processImages().catch(console.error);
