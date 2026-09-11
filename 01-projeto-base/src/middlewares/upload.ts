/**
 * ============================================================
 * TODO 12 (Encontro 2) -- Configuracao do multer
 * ============================================================
 * multer.diskStorage: destino "uploads/", nome de arquivo GERADO
 * pelo servidor (nunca o nome original do cliente -- e o que
 * previne path traversal).
 *
 * fileFilter: so aceitar image/jpeg e image/png.
 * limits.fileSize: 2 * 1024 * 1024 (2MB).
 *
 * export const uploadPhoto = multer({ storage, limits, fileFilter });
 * ============================================================
 */
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),

});

const ALLOWED = ['image/jpeg', 'image/png'];

export const uploadPhoto = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => cb(null, ALLOWED.includes(file.mimetype))
});
