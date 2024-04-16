import { diskStorage } from 'multer';

export const multerOptions = {
    storage: diskStorage({
      destination: './uploads', // Ruta de la carpeta donde se guardarán los archivos
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${extension}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|png|gif)$/)) {
        // Rechazar el archivo si no tiene una de las extensiones permitidas
        return cb(new Error('Solo se permiten imágenes .jpg, .png, .gif'), false);
      }
      // Aceptar el archivo si tiene una de las extensiones permitidas
      cb(null, true);
    },
  };
  