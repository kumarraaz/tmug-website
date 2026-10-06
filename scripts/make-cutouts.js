const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImage(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= 244 && g >= 244 && b >= 244;
  }

  // Seed boundary
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { visited[0 * width + x] = 1; queue.push(x, 0); }
    if (isWhite(x, height - 1)) { visited[(height - 1) * width + x] = 1; queue.push(x, height - 1); }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y)) { visited[y * width + 0] = 1; queue.push(0, y); }
    if (isWhite(width - 1, y)) { visited[y * width + (width - 1)] = 1; queue.push(width - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (let i = 0; i < neighbors.length; i++) {
      const [nx, ny] = neighbors[i];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx] && isWhite(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Apply alpha with gentle edge feathering
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIndex = y * width + x;
      const dIndex = pIndex * 4;
      if (visited[pIndex]) {
        data[dIndex + 3] = 0; // Transparent
      }
    }
  }

  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ quality: 90 })
  .toFile(outputPath);

  console.log('Processed:', outputPath);
}

const items = [
  'butterfly-pea-50g-jar-front',
  'butterfly-pea-100g-pouch-front',
  'chamomile-50g-jar-front',
  'chamomile-100g-pouch-front',
  'hibiscus-50g-jar-front',
  'hibiscus-100g-pouch-front',
  'gold-250g-pouch-front',
  'darjeeling-100g-jar-front',
  'lemongrass-50g-jar-front',
  'lemongrass-100g-pouch-front',
  'premium-250g-pouch-front'
];

async function run() {
  for (const name of items) {
    const src = path.join(__dirname, '../public/products', `${name}.jpg`);
    const dst = path.join(__dirname, '../public/hero', `${name}.png`);
    await processImage(src, dst);
  }
}

run().catch(console.error);
