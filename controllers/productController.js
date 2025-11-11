const Product = require('../models/Product');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

/**
 * 下载Excel模板
 */
exports.downloadTemplate = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('商品信息模板');

    // 设置列定义
    worksheet.columns = [
      { header: '商品名称', key: 'productName', width: 15 },
      { header: '型号', key: 'model', width: 10 },
      { header: '类别', key: 'category', width: 10 },
      { header: '规格', key: 'specifications', width: 15 },
      { header: '长宽高', key: 'dimensions', width: 25 },
      { header: '面料', key: 'material', width: 10 },
      { header: '填元', key: 'filling', width: 10 },
      { header: '框架', key: 'frame', width: 12 },
      { header: '脚架', key: 'legs', width: 12 },
      { header: '标价', key: 'listPrice', width: 12 },
      { header: '折扣价', key: 'discountPrice', width: 12 },
      { header: '库存', key: 'stock', width: 10 },
      { header: 'PRO', key: 'isPro', width: 8 },
      { header: 'PRO特性', key: 'proFeatures', width: 20 }
    ];

    // 设置表头样式
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // 添加示例数据（参考图片中的数据）
    const exampleData = [
      {
        productName: '写化斯',
        model: 'A100',
        category: '沙发',
        specifications: '三人位',
        dimensions: '长3000宽980高680mm',
        material: '布料',
        filling: '',
        frame: '实木框架',
        legs: '实木脚架',
        listPrice: 4400,
        discountPrice: '',
        stock: 101,
        isPro: '是',
        proFeatures: ''
      },
      {
        productName: '芳化斯',
        model: 'A100',
        category: '沙发',
        specifications: '固定型',
        dimensions: '长3600宽1120*680mm',
        material: '布料',
        filling: '乳胶',
        frame: '实木框架',
        legs: '实木脚架',
        listPrice: 4400,
        discountPrice: 3960,
        stock: 101,
        isPro: '是',
        proFeatures: '升级版高密度海绵'
      },
      {
        productName: '绿娅缓',
        model: 'A101',
        category: '沙发',
        specifications: '固定脚带台',
        dimensions: '长3100*1100*680mm',
        material: '白色',
        filling: '海绵',
        frame: '实木框架',
        legs: '实木脚架',
        listPrice: 4400,
        discountPrice: 3960,
        stock: 102,
        isPro: '否',
        proFeatures: ''
      }
    ];

    // 添加示例数据到表格
    exampleData.forEach((data) => {
      worksheet.addRow(data);
    });

    // 设置数据行样式
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // 跳过表头
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { vertical: 'middle' };
        });
      }
    });

    // 设置响应头
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('商品导入模板.xlsx')
    );

    // 将工作簿写入响应
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('下载模板失败:', error);
    res.status(500).json({
      success: false,
      message: '下载模板失败',
      error: error.message
    });
  }
};

/**
 * 导入Excel文件
 */
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传Excel文件'
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return res.status(400).json({
        success: false,
        message: 'Excel文件格式错误'
      });
    }

    const products = [];
    const errors = [];

    // 辅助函数：安全获取单元格文本值
    const getCellText = (cell) => {
      const value = cell.value;
      if (value === null || value === undefined) return '';
      
      // 处理富文本对象
      if (value.richText) {
        return value.richText.map(rt => rt.text).join('');
      }
      
      // 处理其他对象类型（如超链接）
      if (typeof value === 'object' && value.text) {
        return String(value.text);
      }
      
      // 处理普通对象（转为JSON字符串然后提取值）
      if (typeof value === 'object') {
        // 如果是简单的键值对对象，提取所有值并连接
        const values = Object.values(value).filter(v => v !== null && v !== undefined);
        return values.join(' ');
      }
      
      return String(value);
    };

    // 从第2行开始读取（第1行是表头）
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // 跳过表头

      try {
        const productData = {
          productName: getCellText(row.getCell(1)),
          model: getCellText(row.getCell(2)),
          category: getCellText(row.getCell(3)),
          specifications: getCellText(row.getCell(4)),
          dimensions: getCellText(row.getCell(5)),
          material: getCellText(row.getCell(6)),
          filling: getCellText(row.getCell(7)),
          frame: getCellText(row.getCell(8)),
          legs: getCellText(row.getCell(9)),
          listPrice: parseFloat(row.getCell(10).value) || 0,
          discountPrice: parseFloat(row.getCell(11).value) || undefined,
          stock: parseInt(row.getCell(12).value) || 0,
          isPro: row.getCell(13).value === '是' || row.getCell(13).value === true,
          proFeatures: getCellText(row.getCell(14))
        };

        // 验证必填字段
        if (!productData.productName || !productData.model || !productData.category) {
          errors.push({
            row: rowNumber,
            message: '商品名称、型号和类别为必填项'
          });
          return;
        }

        if (!productData.listPrice || productData.listPrice <= 0) {
          errors.push({
            row: rowNumber,
            message: '标价必须大于0'
          });
          return;
        }

        products.push(productData);
      } catch (error) {
        errors.push({
          row: rowNumber,
          message: `数据解析错误: ${error.message}`
        });
      }
    });

    // 删除上传的临时文件
    fs.unlinkSync(req.file.path);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: '导入数据验证失败',
        errors
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有找到有效的数据'
      });
    }

    // 批量插入数据库
    const result = await Product.insertMany(products, { ordered: false });

    res.json({
      success: true,
      message: `成功导入 ${result.length} 条记录`,
      count: result.length,
      data: result
    });

  } catch (error) {
    // 删除上传的临时文件（如果存在）
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('导入Excel失败:', error);
    res.status(500).json({
      success: false,
      message: '导入失败',
      error: error.message
    });
  }
};

/**
 * 获取所有产品
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isPro } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (isPro !== undefined) query.isPro = isPro === 'true';

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品列表失败',
      error: error.message
    });
  }
};

/**
 * 获取单个产品
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品详情失败',
      error: error.message
    });
  }
};

/**
 * 创建产品
 */
exports.createProduct = async (req, res) => {
  try {
    // 打印接收到的数据用于调试
    console.log('收到创建产品请求，数据:', JSON.stringify(req.body, null, 2));
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: '产品创建成功',
      data: product
    });
  } catch (error) {
    console.error('创建产品失败:', error);
    console.error('请求数据:', req.body);
    
    // 提取更详细的验证错误信息
    let errorMessage = '创建产品失败';
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => {
        return `${key}: ${error.errors[key].message}`;
      });
      errorMessage = `数据验证失败: ${errors.join(', ')}`;
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

/**
 * 更新产品
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    res.json({
      success: true,
      message: '产品更新成功',
      data: product
    });
  } catch (error) {
    console.error('更新产品失败:', error);
    res.status(400).json({
      success: false,
      message: '更新产品失败',
      error: error.message
    });
  }
};

/**
 * 删除产品
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    res.json({
      success: true,
      message: '产品删除成功'
    });
  } catch (error) {
    console.error('删除产品失败:', error);
    res.status(500).json({
      success: false,
      message: '删除产品失败',
      error: error.message
    });
  }
};

/**
 * 导出产品数据为Excel
 */
exports.exportExcel = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('商品信息');

    // 设置列定义
    worksheet.columns = [
      { header: '商品名称', key: 'productName', width: 15 },
      { header: '型号', key: 'model', width: 10 },
      { header: '类别', key: 'category', width: 10 },
      { header: '规格', key: 'specifications', width: 15 },
      { header: '长宽高', key: 'dimensions', width: 25 },
      { header: '面料', key: 'material', width: 10 },
      { header: '填元', key: 'filling', width: 10 },
      { header: '框架', key: 'frame', width: 12 },
      { header: '脚架', key: 'legs', width: 12 },
      { header: '标价', key: 'listPrice', width: 12 },
      { header: '折扣价', key: 'discountPrice', width: 12 },
      { header: '库存', key: 'stock', width: 10 },
      { header: 'PRO', key: 'isPro', width: 8 },
      { header: 'PRO特性', key: 'proFeatures', width: 20 }
    ];

    // 设置表头样式
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, size: 11 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // 添加数据
    products.forEach((product) => {
      worksheet.addRow({
        productName: product.productName,
        model: product.model,
        category: product.category,
        specifications: product.specifications,
        dimensions: product.dimensions,
        material: product.material,
        filling: product.filling,
        frame: product.frame,
        legs: product.legs,
        listPrice: product.listPrice,
        discountPrice: product.discountPrice,
        stock: product.stock,
        isPro: product.isPro ? '是' : '否',
        proFeatures: product.proFeatures
      });
    });

    // 设置数据行样式
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { vertical: 'middle' };
        });
      }
    });

    // 设置响应头
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('商品数据.xlsx')
    );

    // 将工作簿写入响应
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('导出Excel失败:', error);
    res.status(500).json({
      success: false,
      message: '导出失败',
      error: error.message
    });
  }
};
