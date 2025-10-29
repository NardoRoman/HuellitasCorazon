import vision from '@google-cloud/vision';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createVisionClient() {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    // PRODUCCIÓN: desde variable de entorno
    console.log('🔧 Producción: Usando credenciales de variable de entorno');
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    return new vision.ImageAnnotatorClient({
      credentials: credentials,
      projectId: process.env.GCLOUD_PROJECT || 'hc-vision-api'
    });
  } else {
    // DESARROLLO: desde archivo local
    console.log('🔧 Desarrollo: Usando credenciales de archivo local');
    return new vision.ImageAnnotatorClient({
      keyFilename: path.join(__dirname, 'google-credentials.json')
    });
  }
}