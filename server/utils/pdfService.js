import puppeteer from 'puppeteer'

const COMPANY_DETAILS = {
  name: process.env.COMPANY_NAME || 'AK ENTERPRISES',
  tagline: process.env.COMPANY_TAGLINE || 'A COMPLETE SOLUTION PROVIDER',
  gstin: process.env.COMPANY_GSTIN || '33DZ5PS1263R1ZE',
  address:
    process.env.COMPANY_ADDRESS ||
    '# 33-GD, Viswamelu Towers, Chitlapakkam Main Road, Nehru Nagar, Chromepet, Chennai - 600 044.',
  phone: process.env.COMPANY_PHONE || '044 - 4860 0223',
  mobile: process.env.COMPANY_MOBILE || '88257 94286',
  email: process.env.COMPANY_EMAIL || 'akenterprises0307@gmail.com',
  logoUrl:
    process.env.COMPANY_LOGO_URL ||
    'https://dummyimage.com/400x120/ffffff/000000&text=AK+Enterprises',
}

function createItemsRows(order) {
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return `
      <tr>
        <td class="sl-cell">1</td>
        <td colspan="4" class="empty-cell">No items were provided</td>
      </tr>
    `
  }

  return order.items
    .map(
      (item, index) => `
        <tr>
          <td class="sl-cell">${index + 1}</td>
          <td>${item.product_name || 'Unnamed Product'}</td>
          <td>${item.brand || '—'}</td>
          <td class="qty-cell">${item.quantity || 0}</td>
        </tr>
      `
    )
    .join('')
}

function buildHtml(order) {
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Request Copy - ${order._id}</title>
      <style>
        * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-sizing: border-box; }
        body { margin: 0; padding: 24px; background: #f5f5f5; color: #1f2937; }
        .sheet { background: #fff; padding: 24px; border: 1px solid #e5e7eb; }
        .heading-table, .items-table { width: 100%; border-collapse: collapse; }
        .heading-table th, .heading-table td { border: 1px solid #111; padding: 12px; text-align: left; }
        .heading-table th { text-transform: uppercase; font-size: 18px; }
        .heading-table td { font-size: 14px; }
        .logo-container { text-align: center; padding: 20px 16px; }
        .logo-container img { max-width: 420px; width: 80%; margin-bottom: 12px; }
        .company-info { font-size: 13px; line-height: 1.4; color: #6b7280; }
        .items-table th, .items-table td { border: 1px solid #111; padding: 10px; font-size: 13px; }
        .items-table th { background: #f8f8f8; text-transform: uppercase; letter-spacing: 0.04em; }
        .sl-cell { width: 60px; text-align: center; }
        .qty-cell { width: 80px; text-align: center; font-weight: 600; }
        .empty-cell { text-align: center; color: #9ca3af; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="sheet">
        <table class="heading-table">
          <tbody>
            <tr>
              <th colspan="2">Request Copy</th>
              <th style="width: 170px;">Order Id:</th>
              <td style="width: 170px;">${order._id}</td>
              <th style="width: 120px;">Date:</th>
              <td style="width: 150px;">${orderDate}</td>
            </tr>
          </tbody>
        </table>

        <div class="logo-container">
          <img src="${COMPANY_DETAILS.logoUrl}" alt="Company logo" />
          <div class="company-info">
            <div style="color:#b91c1c;font-weight:600;margin-bottom:4px;">
              ${COMPANY_DETAILS.name} - ${COMPANY_DETAILS.tagline}
            </div>
            <div style="margin-bottom:4px;">GSTIN : ${COMPANY_DETAILS.gstin}</div>
            <div>${COMPANY_DETAILS.address}</div>
            <div>Ph.: ${COMPANY_DETAILS.phone}  Mobile : ${COMPANY_DETAILS.mobile}  E-mail : ${COMPANY_DETAILS.email}</div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width:60px;">SL.NO</th>
              <th>PRODUCT NAME</th>
              <th style="width:140px;">BRAND</th>
              <th style="width:80px;">QTY</th>
            </tr>
          </thead>
          <tbody>
            ${createItemsRows(order)}
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `
}

export async function generateOrderPdf(order) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    const html = buildHtml(order)
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    })
    return pdfBuffer
  } finally {
    await browser.close()
  }
}

