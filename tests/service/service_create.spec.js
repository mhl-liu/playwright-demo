import { test } from '@playwright/test';
import { ServicePage } from '../../pages/servicePage.js';
import { ServiceDetailPage } from '../../pages/serviceDetailPage.js';
import { DataProcessor } from '../../utils/helper.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../utils/globalConfig.js';
import rawData from '../data/serviceData.json' assert { type: 'json' };


test.describe('Kong Service Creation ', () => {
    // const dataset1 = JSON.stringify(DataProcessor.replaceDynamicValues(raw_data));
    const dataset = rawData.validCases
    dataset.forEach((data, i) => {
        test(`should create service successfully - ${data.testcasename} [#${i + 1}]`, async ({ page, request }) => {
            const sp = new ServicePage(page);
            const urlNewService = `${config.baseUrl}` + '/services/create?cta=new-user';
            const baseurlService = 'http://localhost:8001/default/services';
            const date_now = DataProcessor.replaceDynamicValues("${date(MMM DD, YYYY, hh:mm A)}");
            let serviceId;

            logger.info('STEP1:🚀Navigating to Service page' + urlNewService);
            await sp.goto('/services/create?cta=new-user');

            logger.info('STEP2:⌨️create a norml service');
            const response = await sp.createService(data);

            logger.info('STEP3: check the response after clicking "save" button');
            await sp.expectSoft(response?.ok?.() ?? false, 'toBe', true, 'verify whether the response is ok')
            await sp.expectSoft(page, 'toHaveURL', /\/[a-z0-9_-]+\/services\/([a-z0-9-]+)$/, 'verify whether the page has navigated to detail page')
            logger.info('current page url: ' + page.url())

            serviceId = DataProcessor.extractByRegex(page.url(), /\/services\/([a-z0-9-]+)$/, 1)


            logger.info('STEP4:🚀Navigating to ServiceDetail page');
            const sdp = new ServiceDetailPage(page);

            logger.info('STEP5:validate service name in the page');
            const actualServiceName = await sdp.getServiceName();
            const expectedServiceName = data.name;
            await sdp.expectSoft(actualServiceName?.trim() ?? '', 'toBe', expectedServiceName)

            logger.info('STEP6:validate service id in the page');
            const actualServiceID = await sdp.getServiceID()
            const expectedServiceID = serviceId
            await sdp.expectSoft(actualServiceID?.trim() ?? '', 'toBe', expectedServiceID)

            logger.info('STEP7:validate timestamp in the page');
            const actualCreated = await sdp.getCreatedAt()
            const expectedCreated = date_now
            await sdp.expectSoft(actualCreated?.trim() ?? '', 'toBe', expectedCreated)

            logger.info('STEP8: clean data');
            await DataProcessor.deleteService(request, baseurlService, serviceId);


        });

    });


});
