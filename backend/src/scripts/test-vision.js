import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../config/google-credentials.json')
});

async function testVisionAPI() {
  try {
    console.log('Probando conexión con Google Vision API...');
    console.log('Buscando credenciales en:', path.join(__dirname, '../config/google-credentials.json'));
    
    const imageUrl = 'https://cdn.pixabay.com/photo/2018/05/21/01/24/parrot-3417217_1280.jpg';
    
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;
    
    console.log('Conexión exitosa!');
    console.log('Etiquetas detectadas:');
    
    labels.forEach(label => {
      console.log(`   - ${label.description} (${Math.round(label.score * 100)}% confianza)`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Asegúrate de que el archivo google-credentials.json existe en la ruta correcta');
  }
}

testVisionAPI();