const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/upload');

// Excel模板下载
router.get('/template/download', productController.downloadTemplate);

// Excel导入
router.post('/import', upload.single('file'), productController.importExcel);

// Excel导出
router.get('/export', productController.exportExcel);

// 产品CRUD操作
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
