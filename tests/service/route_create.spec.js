import { test, expect } from '@playwright/test';
import { ServicePage } from '../../pages/servicePage.js';
import rawData from '../data/routeData.json' assert { type: 'json' };
import { DataProcessor } from '../../utils/helper.js';
import { config } from '../../utils/globalConfig.js';
import { logger } from '../../utils/logger.js';
import { ServiceDetailPage } from '../../pages/serviceDetailPage.js';
import { RoutePage } from '../../pages/routePage.js';


test.describe('Kong Service add a route', () => {
    let serviceId;
    let urlServiceDetail;
    let rp;
    let sdp;
    let context;
    let page;
    const baseUrl = 'http://localhost:8001/default/services/';
    test.beforeAll(async ({ browser }) => {
        logger.info('🚀 Running before all tests to prepare the premise of testing route');
        context = await browser.newContext();
        page = await context.newPage();

        const routeDemoData = { "path": "/" };
        const sp = new ServicePage(page);
        const urlNewService = `${config.baseUrl}` + '/services/create?cta=new-user';
        const dataService = { "url": "http://www.baidu.com" };
        await page.goto(urlNewService);
        const response = await sp.createService(dataService);
        await sp.expectSoft(response?.ok?.() ?? false, 'toBe', true, 'verify whether the response is ok')
        await sp.expectSoft(page, 'toHaveURL', /\/[a-z0-9_-]+\/services\/([a-z0-9-]+)$/, 'verify whether the page has navigated to detail page')
        logger.info('current page url: ' + page.url())
        serviceId = DataProcessor.extractByRegex(page.url(), /\/services\/([a-z0-9-]+)$/, 1)
        logger.info('✅ Created service:', serviceId);
        urlServiceDetail = baseUrl + serviceId;
        sdp = new ServiceDetailPage(page);
        const addRouteButtonStatus = await sdp.clickAddRouteButton()
        await sdp.expectSoft(addRouteButtonStatus, 'toBe', 'done')
        rp = new RoutePage(page)
        logger.info('✅ current Page is ROUTE');
        await rp.fillRouteForm(routeDemoData);
        const saveRouteButtonStatus = await rp.clickSaveRouteButton();
        await sdp.expectSoft(saveRouteButtonStatus, 'toBe', 'done')
        logger.info('✅ has navigared to route list page');
    });

    const dataset = rawData.validCases
    for (const [i, data] of dataset.entries()) {
        test(`should create route successfully - ${data.testcasename} [#${i + 1}]`, async ({ browser, request }) => {

            logger.info('STEP1:🖱️ clicking new route tab');
            await sdp.clickRouteTab();

            logger.info('STEP2:🖱️ clicking new route button');
            await sdp.clickNewRouteButton();

            logger.info('STEP3: ⌨️ filling route form');
            await rp.fillRouteForm(data);
            await rp.clickSaveRouteButton();

            logger.info('STEP4: validate filled route name');
            const actualCreatedName = await sdp.getNameColVal();
            await sdp.expectSoft(actualCreatedName?.trim() ?? '', 'toBe', data.name?.trim() ?? '-');
            // const actualCreatedPath = await sdp.getPathsColVal();
            // await sdp.expectSoft(actualCreatedPath?.trim() ?? '', 'toBe', data.path?.trim() ?? '-');

        });

    }


});
