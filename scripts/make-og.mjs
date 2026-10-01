import sharp from 'sharp';
await sharp('src/assets/hero-stage.jpg').resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toFile('public/og.jpg');
