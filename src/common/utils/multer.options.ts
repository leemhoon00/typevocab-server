import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerOption = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'uploads'),
    filename: (req: any, file, cb) => {
      cb(null, req.user.userId + extname(file.originalname));
    },
  }),
};
