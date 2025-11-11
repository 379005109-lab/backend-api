# 产品管理 API 文档

## 基础信息

- **Base URL**: `http://localhost:5000/api/products`
- **公网URL**: `https://your-domain.sealoshzh.site/api/products`（配置后）

---

## API 端点列表

### 1. 下载Excel模板

**端点**: `GET /api/products/template/download`

**描述**: 下载商品导入的Excel模板，包含示例数据

**请求示例**:
```bash
curl -O -J http://localhost:5000/api/products/template/download
```

**响应**: Excel文件下载（商品导入模板.xlsx）

**表格字段说明**:
| 字段名 | 说明 | 是否必填 | 示例 |
|--------|------|---------|------|
| 商品名称 | 产品名称 | ✅ 是 | 写化斯 |
| 型号 | 产品型号 | ✅ 是 | A100 |
| 类别 | 产品类别 | ✅ 是 | 沙发 |
| 规格 | 规格描述 | 否 | 三人位 |
| 长宽高 | 尺寸信息 | 否 | 长3000宽980高680mm |
| 面料 | 材料/面料 | 否 | 布料 |
| 填元 | 填充物 | 否 | 乳胶 |
| 框架 | 框架材质 | 否 | 实木框架 |
| 脚架 | 脚架材质 | 否 | 实木脚架 |
| 标价 | 原价 | ✅ 是 | 4400 |
| 折扣价 | 优惠价格 | 否 | 3960 |
| 库存 | 库存数量 | 否 | 101 |
| PRO | 是否PRO版 | 否 | 是/否 |
| PRO特性 | PRO版特性描述 | 否 | 升级版高密度海绵 |

---

### 2. 导入Excel文件

**端点**: `POST /api/products/import`

**描述**: 上传Excel文件批量导入商品数据

**请求头**:
```
Content-Type: multipart/form-data
```

**请求参数**:
- `file`: Excel文件（.xlsx 或 .xls）

**请求示例**:
```bash
curl -X POST \
  http://localhost:5000/api/products/import \
  -F "file=@商品数据.xlsx"
```

**JavaScript示例**:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/api/products/import', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**成功响应**:
```json
{
  "success": true,
  "message": "成功导入 3 条记录",
  "count": 3,
  "data": [...]
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "导入数据验证失败",
  "errors": [
    {
      "row": 2,
      "message": "商品名称、型号和类别为必填项"
    }
  ]
}
```

---

### 3. 导出商品数据

**端点**: `GET /api/products/export`

**描述**: 导出所有商品数据为Excel文件

**请求示例**:
```bash
curl -O -J http://localhost:5000/api/products/export
```

**响应**: Excel文件下载（商品数据.xlsx）

---

### 4. 获取商品列表

**端点**: `GET /api/products`

**描述**: 获取商品列表，支持分页和筛选

**查询参数**:
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 10）
- `category`: 类别筛选
- `isPro`: PRO筛选（true/false）

**请求示例**:
```bash
# 获取第1页，每页10条
curl "http://localhost:5000/api/products?page=1&limit=10"

# 筛选沙发类别
curl "http://localhost:5000/api/products?category=沙发"

# 筛选PRO产品
curl "http://localhost:5000/api/products?isPro=true"
```

**成功响应**:
```json
{
  "success": true,
  "data": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### 5. 获取单个商品

**端点**: `GET /api/products/:id`

**描述**: 根据ID获取商品详情

**请求示例**:
```bash
curl http://localhost:5000/api/products/6733d4f2e3b1c2a4d5e6f7a8
```

**成功响应**:
```json
{
  "success": true,
  "data": {
    "_id": "6733d4f2e3b1c2a4d5e6f7a8",
    "productName": "写化斯",
    "model": "A100",
    "category": "沙发",
    "listPrice": 4400,
    "stock": 101,
    ...
  }
}
```

---

### 6. 创建商品

**端点**: `POST /api/products`

**描述**: 创建单个商品

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "productName": "写化斯",
  "model": "A100",
  "category": "沙发",
  "specifications": "三人位",
  "dimensions": "长3000宽980高680mm",
  "material": "布料",
  "frame": "实木框架",
  "legs": "实木脚架",
  "listPrice": 4400,
  "stock": 101,
  "isPro": true
}
```

**请求示例**:
```bash
curl -X POST \
  http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "测试产品",
    "model": "TEST001",
    "category": "沙发",
    "listPrice": 5000,
    "stock": 10
  }'
```

**成功响应**:
```json
{
  "success": true,
  "message": "产品创建成功",
  "data": {...}
}
```

---

### 7. 更新商品

**端点**: `PUT /api/products/:id`

**描述**: 更新商品信息

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "listPrice": 5000,
  "discountPrice": 4500,
  "stock": 50
}
```

**请求示例**:
```bash
curl -X PUT \
  http://localhost:5000/api/products/6733d4f2e3b1c2a4d5e6f7a8 \
  -H "Content-Type: application/json" \
  -d '{"listPrice": 5000}'
```

**成功响应**:
```json
{
  "success": true,
  "message": "产品更新成功",
  "data": {...}
}
```

---

### 8. 删除商品

**端点**: `DELETE /api/products/:id`

**描述**: 删除商品

**请求示例**:
```bash
curl -X DELETE http://localhost:5000/api/products/6733d4f2e3b1c2a4d5e6f7a8
```

**成功响应**:
```json
{
  "success": true,
  "message": "产品删除成功"
}
```

---

## 前端集成示例

### React 示例

```javascript
import React, { useState } from 'react';

function ProductImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 下载模板
  const downloadTemplate = () => {
    window.open('http://localhost:5000/api/products/template/download', '_blank');
  };

  // 导入文件
  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('请选择文件');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`成功导入 ${result.count} 条记录`);
        setFile(null);
      } else {
        alert(`导入失败: ${result.message}`);
      }
    } catch (error) {
      console.error('导入错误:', error);
      alert('导入失败');
    } finally {
      setLoading(false);
    }
  };

  // 导出数据
  const handleExport = () => {
    window.open('http://localhost:5000/api/products/export', '_blank');
  };

  return (
    <div>
      <h2>商品管理</h2>
      
      {/* 下载模板 */}
      <button onClick={downloadTemplate}>
        下载导入模板
      </button>

      {/* 导入文件 */}
      <form onSubmit={handleImport}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? '导入中...' : '导入数据'}
        </button>
      </form>

      {/* 导出数据 */}
      <button onClick={handleExport}>
        导出所有数据
      </button>
    </div>
  );
}

export default ProductImport;
```

### HTML + JavaScript 示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>商品导入</title>
</head>
<body>
  <h1>商品管理</h1>
  
  <!-- 下载模板 -->
  <button onclick="downloadTemplate()">下载导入模板</button>
  
  <!-- 导入文件 -->
  <form id="importForm">
    <input type="file" id="fileInput" accept=".xlsx,.xls" required>
    <button type="submit">导入数据</button>
  </form>
  
  <!-- 导出数据 -->
  <button onclick="exportData()">导出所有数据</button>

  <script>
    const API_BASE = 'http://localhost:5000/api/products';

    // 下载模板
    function downloadTemplate() {
      window.open(`${API_BASE}/template/download`, '_blank');
    }

    // 导入文件
    document.getElementById('importForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('请选择文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_BASE}/import`, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        
        if (result.success) {
          alert(`成功导入 ${result.count} 条记录`);
          fileInput.value = '';
        } else {
          alert(`导入失败: ${result.message}`);
          if (result.errors) {
            console.error('错误详情:', result.errors);
          }
        }
      } catch (error) {
        console.error('导入错误:', error);
        alert('导入失败');
      }
    });

    // 导出数据
    function exportData() {
      window.open(`${API_BASE}/export`, '_blank');
    }
  </script>
</body>
</html>
```

---

## 错误处理

### 常见错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

---

## 注意事项

1. **文件大小限制**: Excel文件最大5MB
2. **文件格式**: 仅支持 .xlsx 和 .xls 格式
3. **必填字段**: 商品名称、型号、类别、标价
4. **PRO字段**: 填写"是"或"否"，其他值视为"否"
5. **价格**: 标价必须大于0
6. **库存**: 默认为0
7. **批量导入**: 跳过表头（第1行），从第2行开始读取数据

---

## 测试建议

1. **先下载模板**: 使用模板了解正确的格式
2. **验证数据**: 导入前检查必填字段
3. **小批量测试**: 先导入少量数据测试
4. **查看日志**: 如有错误，检查后端日志

---

## 技术支持

如有问题，请查看：
- 后端日志: `pm2 logs backend-api`
- API健康检查: `http://localhost:5000/health`
- 服务状态: `pm2 list`
