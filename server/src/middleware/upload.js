import multer from 'multer'
import path from 'path'

// 使用内存存储，文件会保存在 req.file.buffer 中
const storage = multer.memoryStorage()

// 文件过滤器 - 只允许图片
const fileFilter = (req, file, cb) => {
  // 允许的图片类型
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('只支持图片格式 (jpeg, jpg, png, gif, webp, svg)'))
  }
}

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 默认5MB
  },
  fileFilter: fileFilter,
})

// 单个文件上传
export const uploadSingle = upload.single('image')

// 多个文件上传（最多10个）
export const uploadMultiple = upload.array('images', 10)

// 多个字段的文件上传
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'thumbnail', maxCount: 1 },
])

export default upload
