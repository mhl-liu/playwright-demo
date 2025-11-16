// expected = /\/[a-z0-9_-]+\/services\/([a-z0-9-]+)$/;
// pass = expected instanceof RegExp ? expected.test("http://localhost:8002/default/services/create?cta=new-user") : actual === expected;
// console.log("hhhh" + pass)
// import raw_data from '../data/serviceData.json' assert { type: 'json' };
// import { DataProcessor } from '../../utils/helper.js';



// const data = DataProcessor.replaceDynamicValues(raw_data);
// console.log(data.validCases)
// import { logger } from '../../utils/logger.js';
// import { test, expect } from '@playwright/test';
// const users = [
//     { name: 'admin', password: '123456' },
//     { name: 'guest', password: 'guest' },
// ];

// test.describe('Kong Service Creation ', () => {
//     for (const user of users) {
//         test(`用户 ${user.name} 登录`, async ({ page }) => {
//             await page.goto('https://example.com/login');
//             await page.fill('#username', user.name);
//             await page.fill('#password', user.password);
//             await page.click('#submit');
//             console.log("hhhhhhh");
//             await expect(page.locator('.welcome')).toBeVisible();
//         });
//     }
// });



import { test, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage.js';


test('check route table', async ({ page }) => {
    await page.goto('http://localhost:8002/default/services/f28c7e6d-6bbd-416f-845e-3e18f7963a4d/routes');
    // await page.getByTestId('service-routes').click();
    const bp = new BasePage(page);
    const tableLocator = page.locator('table.table.has-hover.is-clickable');
    const visible = await tableLocator.isVisible().catch(() => false);
    console.log(visible)
    tableLocator.waitFor({ state: 'visible', timeout: 5000 });
    const expectedHeaders = ['Name', 'Protocols', 'Hosts', 'Methods', 'Paths', 'Tags', 'Last Modified'];
    const expectedFirstRow = ['-', 'http https', '-', '-', '/', '-', 'Last Modified'];

    // const result = bp.verifyTable(tableLocator, expectedHeaders, expectedFirstRow);
    // console.log(result);

    await tableLocator.waitFor({ state: 'visible', timeout: 5000 });

    // 2⃣️ 验证表头
    // const headerCells = tableLocator.locator('[data-testid^="table-header-"] .table-header-label');
    // const headerCount = await headerCells.count();
    // console.log('the number is:' + headerCount);
    // const actualHeaders = [];

    // for (let i = 0; i < headerCount; i++) {
    //     actualHeaders.push((await headerCells.nth(i).innerText()).trim());
    // }

    // if (JSON.stringify(actualHeaders) !== JSON.stringify(expectedHeaders)) {
    //     const jsons = {
    //         status: 'failed',
    //         errorType: 'header mismatch',
    //         expected: expectedHeaders,
    //         actual: actualHeaders
    //     };
    //     console.log(jsons);
    // }

    //first row's multiple values   protocols
    const firstRowProtocols = tableLocator.locator('tbody tr').first().locator('[data-testid="methods"]');

    // 获取所有 badge 文本
    const badgeTexts = await firstRowProtocols.locator('.k-badge .badge-content-wrapper').allTextContents();
    console.log(badgeTexts.toString()); // ['http', 'https']

    // 方法2：根据 data-testid（如果有的话）
    const firstRowName = tableLocator.locator('tbody tr').first().locator('[data-testid="paths"]');
    const nameText = await firstRowName.textContent();
    console.log(nameText);





});




test('delete service by ID', async ({ request }) => {
    const baseUrl = 'http://localhost:8001/default/services';
    const serviceId = '63750861-092c-4cd4-a5b6-cd98f4c60f7d';

    // 发送 DELETE 请求
    const response = await request.delete(`${baseUrl}/${serviceId}`);

    // 打印响应状态
    console.log(`Status: ${response.status()}`);

    // 打印响应体
    const body = await response.text();
    console.log('Response body:', body);

    // 验证返回码
    expect(response.ok()).toBeTruthy(); // 等价于 status ∈ [200..299]
});


test('add service by ID', async ({ request }) => {
    const baseUrl = 'http://localhost:8001/default/services';
    const payload = {
        name: '20new-service-20251113010629119',
        tags: null,
        read_timeout: 60000,
        retries: 5,
        connect_timeout: 60000,
        ca_certificates: null,
        client_certificate: null,
        write_timeout: 60000,
        port: 80,
        url: 'http://www.baidu.com',
        enabled: true
    };

    console.log(`🚀 Creating service at: ${baseUrl}`);
    console.log('Payload:', payload);

    const response = await request.post(baseUrl, {
        data: payload,
    });

    const body = await response.json().catch(() => ({}));
    console.log(`Status: ${response.status()}`);
    console.log('Response body:', body.id);

    expect(response.ok()).toBeTruthy(); // 确认状态码 2xx

    // 返回响应体中关键字段（如 service ID）
    return body;
});





