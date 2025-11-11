import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// 创建邮件传输器
const createTransporter = () => {
  // 如果配置了邮件服务，创建传输器
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 授权码，不是QQ密码
      },
    })
  }
  return null
}

// 发送订单通知邮件
export const sendOrderNotificationEmail = async (orderData) => {
  try {
    const transporter = createTransporter()
    
    // 如果没有配置邮件服务，不发送邮件（开发环境）
    if (!transporter) {
      console.log('⚠️  邮件服务未配置，跳过发送邮件')
      console.log('📧 订单通知数据:', {
        订单号: orderData.orderNo,
        订单总额: orderData.totalAmount,
        用户: orderData.user?.username || orderData.user,
        商品数量: orderData.items?.length || 0,
      })
      return { success: true, message: '邮件服务未配置，已记录日志' }
    }

    // 管理员邮箱
    const adminEmail = process.env.ADMIN_EMAIL || '379005109@qq.com'
    
    // 构建邮件内容
    const itemsList = orderData.items?.map((item, index) => {
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.productName || '商品'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">¥${item.price?.toFixed(2) || '0.00'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">¥${((item.price || 0) * item.quantity).toFixed(2)}</td>
        </tr>
      `
    }).join('') || ''

    const mailOptions = {
      from: `"家居电商系统" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `【新订单通知】订单号：${orderData.orderNo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
            }
            .order-info {
              background-color: white;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
              border-left: 4px solid #4CAF50;
            }
            .order-info h3 {
              margin-top: 0;
              color: #4CAF50;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              background-color: white;
            }
            th {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              color: #d32f2f;
              text-align: right;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 新订单通知</h1>
            </div>
            <div class="content">
              <div class="order-info">
                <h3>订单信息</h3>
                <p><strong>订单号：</strong>${orderData.orderNo}</p>
                <p><strong>下单时间：</strong>${new Date(orderData.createdAt).toLocaleString('zh-CN')}</p>
                <p><strong>订单状态：</strong><span style="color: #ff9800;">待确认</span></p>
              </div>

              <div class="order-info">
                <h3>客户信息</h3>
                <p><strong>用户名：</strong>${orderData.user?.username || '未知'}</p>
                <p><strong>邮箱：</strong>${orderData.user?.email || '未提供'}</p>
                <p><strong>电话：</strong>${orderData.user?.phone || orderData.shippingAddress?.phone || '未提供'}</p>
              </div>

              <div class="order-info">
                <h3>收货信息</h3>
                <p><strong>收货人：</strong>${orderData.shippingAddress?.name || '未提供'}</p>
                <p><strong>联系电话：</strong>${orderData.shippingAddress?.phone || '未提供'}</p>
                <p><strong>收货地址：</strong>${orderData.shippingAddress?.address || 
                  (orderData.shippingAddress?.province && orderData.shippingAddress?.city && orderData.shippingAddress?.district && orderData.shippingAddress?.detail
                    ? `${orderData.shippingAddress.province} ${orderData.shippingAddress.city} ${orderData.shippingAddress.district} ${orderData.shippingAddress.detail}`
                    : '未提供')}</p>
              </div>

              <div class="order-info">
                <h3>商品明细</h3>
                <table>
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>商品名称</th>
                      <th>数量</th>
                      <th>单价</th>
                      <th>小计</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>
                <div class="total">
                  订单总额：¥${orderData.totalAmount?.toFixed(2) || '0.00'}
                </div>
              </div>

              ${orderData.notes ? `
              <div class="order-info">
                <h3>备注信息</h3>
                <p>${orderData.notes}</p>
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #d32f2f; font-weight: bold;">⚠️ 有客户有订单需要确认，请及时处理！</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders" class="button">
                  前往订单管理
                </a>
              </div>
            </div>
            <div class="footer">
              <p>此邮件由系统自动发送，请勿回复。</p>
              <p>家居电商系统 © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
新订单通知

订单号：${orderData.orderNo}
下单时间：${new Date(orderData.createdAt).toLocaleString('zh-CN')}
订单状态：待确认

客户信息：
- 用户名：${orderData.user?.username || '未知'}
- 邮箱：${orderData.user?.email || '未提供'}
- 电话：${orderData.user?.phone || orderData.shippingAddress?.phone || '未提供'}

收货信息：
- 收货人：${orderData.shippingAddress?.name || '未提供'}
- 联系电话：${orderData.shippingAddress?.phone || '未提供'}
- 收货地址：${orderData.shippingAddress?.address || 
  (orderData.shippingAddress?.province && orderData.shippingAddress?.city && orderData.shippingAddress?.district && orderData.shippingAddress?.detail
    ? `${orderData.shippingAddress.province} ${orderData.shippingAddress.city} ${orderData.shippingAddress.district} ${orderData.shippingAddress.detail}`
    : '未提供')}

商品明细：
${orderData.items?.map((item, index) => 
  `${index + 1}. ${item.productName || '商品'} x ${item.quantity} = ¥${((item.price || 0) * item.quantity).toFixed(2)}`
).join('\n') || '无'}

订单总额：¥${orderData.totalAmount?.toFixed(2) || '0.00'}

${orderData.notes ? `备注：${orderData.notes}\n` : ''}
⚠️ 有客户有订单需要确认，请及时处理！
      `.trim(),
    }

    // 发送邮件
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ 订单通知邮件已发送:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ 发送订单通知邮件失败:', error)
    // 不抛出错误，避免影响订单创建
    return { success: false, error: error.message }
  }
}

export default {
  sendOrderNotificationEmail,
}

