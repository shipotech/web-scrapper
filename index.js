// @ts-check
const { chromium } = require('playwright');

const shops = [
  {
    vendor: 'Microsoft',
    url: 'https://www.xbox.com/es-ES/configure/8WJ714N3RBTL',
    checkStock: async ({ page }) => {
      const content = await page.textContent('[aria-label="Finalizar la compra del pack"]');
      return content.includes('Sin existencias') === false;
    }
  },
  {
    vendor: 'Mercado Libre',
    url: 'https://www.mercadolibre.com.co/microsoft-xbox-series-x-1tb-standard-color-negro/p/MCO16160759',
    checkStock: async ({ page }) => {
      const content = await page.textContent('div.ui-pdp-actions span.andes-button__content');
      return (content.includes('Stock disponible') !== true || content.includes('¡Última disponible!') !== true);
    }
  }
]

const start = async () => {
  const browser = await chromium.launch();

  // Iterate over the shops
  for (const shop of shops) {
    const { vendor, url, checkStock } = shop;

    const page = await browser.newPage();
    await page.goto(url);

    const hasStock = await checkStock({ page });
    console.log(`${vendor}: ${hasStock ? 'in stock' : 'out of stock'}`);
    await page.screenshot({ path: `screenshots/${ vendor }.png` });
    await page.close();
  }

  // Close the browser
  await browser.close();
}

start();