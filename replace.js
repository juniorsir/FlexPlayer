const fs = require('fs');
const path = require('path');

const files = [
  'public/index.html',
  'public/docs.html',
  'components/component.html.js',
  'components/component.script.js',
  'public/player.js',
  'api/generate.js',
  'README.md',
  'metadata.json'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/ChromaPlayer Studio/g, 'FlexPlayer Studio');
    content = content.replace(/ChromaPlayer/g, 'FlexPlayer');
    content = content.replace(/chroma-player/g, 'flex-player');
    content = content.replace(/chroma/g, 'flex');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Replaced in ' + file);
  }
});
