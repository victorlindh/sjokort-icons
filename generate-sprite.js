#!/usr/bin/env node

/**
 * generate-sprite.js
 *
 * Reads all SVGs from `icons/` and outputs sprites into an output directory:
 *   - sprite.json      (layout for 1×)
 *   - sprite.png       (image for 1×)
 *   - sprite@2x.json   (layout for 2×)
 *   - sprite@2x.png    (image for 2×)
 *
 * Usage:
 *   ./generate-sprite.js [outputDir]
 */

const spritezero = require('@mapbox/spritezero');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// Use CLI argument as output directory, default to 'dist/sprites'
const outputDir = 'sprite-sheets';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load all SVG files from icons/
const svgs = glob.sync('icons/*.svg').map(file => ({
  id: path.basename(file, '.svg'),
  svg: fs.readFileSync(file)
}));

// Generate sprites for each ratio
[1, 2].forEach(ratio => {
  const suffix = ratio > 1 ? `@${ratio}x` : '';
  const jsonPath = path.join(outputDir, `sprite${suffix}.json`);
  const imgPath = path.join(outputDir, `sprite${suffix}.png`);

  // Generate JSON layout
  spritezero.generateLayout({ imgs: svgs, pixelRatio: ratio, format: true }, (err, dataLayout) => {
    if (err) {
      console.error(`Error generating layout for ratio ${ratio}:`, err);
      process.exit(1);
    }
    fs.writeFileSync(jsonPath, JSON.stringify(dataLayout, null, 2));
    console.log(`Wrote ${jsonPath}`);
  });

  // Generate image layout and PNG
  spritezero.generateLayout({ imgs: svgs, pixelRatio: ratio, format: false }, (err, imageLayout) => {
    if (err) {
      console.error(`Error generating image layout for ratio ${ratio}:`, err);
      process.exit(1);
    }
    spritezero.generateImage(imageLayout, (err2, image) => {
      if (err2) {
        console.error(`Error generating image for ratio ${ratio}:`, err2);
        process.exit(1);
      }
      fs.writeFileSync(imgPath, image);
      console.log(`Wrote ${imgPath}`);
    });
  });
});
