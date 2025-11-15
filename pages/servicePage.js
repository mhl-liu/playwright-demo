import { logger } from '../utils/logger.js';
import { BasePage } from './basePage.js';

/**
 * ServicePage represents the service creation page in the application.
 * Provides methods to interact with the service form (fill, save, etc.).
 * Extends BasePage for common page operations.
 */
export class ServicePage extends BasePage {

    /**
     * @param {import('playwright').Page} page - The Playwright Page object.
     */
    constructor(page) {
        super(page);
        this.fullURLOption = page.getByTestId('gateway-protocol-radio-http'); //full url radio button
        this.custURLOption = page.getByTestId('gateway-service-url-radio');//cust url radio button
        this.fullURLInput = page.getByTestId('gateway-service-url-input');//url input in full url
        this.saveButton = page.getByTestId('service-create-form-submit');//save service button
        this.nameInput = page.getByTestId('gateway-service-name-input');//name input in full url
    }

    /**
     * Fill the service form.
     *
     * @param {{name?: string, url?: string}} data - Form data.
     * @returns {Promise<void>} Resolves when the form is filled.
     */
    async fillServiceForm(data) {
        try {
            logger.info(`🚀 filling the form ${data.name}`);
            if (data.name) this.fill(this.nameInput, data.name, 'Service Name');
            if (data.url) this.fill(this.fullURLInput, data.url, 'Service URL');
        } catch (error) {
            logger.error(`❌ Failed to fill the form: ${error}`);
            throw error;
        }
    }


    /**
     * Create a service.
     *
     * @param {{name?: string, url?: string}} data - Form data to fill the service form.
     * @returns {Promise<import('playwright').APIResponse>} The HTTP response object for the created service.
     */
    async createService(data) {
        try {
            logger.info(`🚀 Creating service`);
            await this.fillServiceForm(data);
            const [response] = await Promise.all([
                this.page.waitForResponse(r => r.url().includes('/services') && r.status() === 201),
                this.saveButton.click()
            ]);
            await this.page.waitForURL(/\/services\/[a-z0-9-]+$/);

            logger.info(`✅ Service created successfully: ${response.url()}`);
            return response;
        } catch (error) {
            logger.error(`❌ Failed to create service: ${error}`);
            throw error;
        }
    }

}
