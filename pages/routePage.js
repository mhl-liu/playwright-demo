import { log } from 'console';
import { logger } from '../utils/logger.js';
import { BasePage } from './basePage.js';

/**
 * RoutePage represents the route creation page in the application.
 * Provides methods to interact with the route form (fill, save, etc.).
 * Extends BasePage for common page operations.
 */
export class RoutePage extends BasePage {

    /**
     * @param {import('playwright').Page} page - The Playwright Page object.
     */
    constructor(page) {
        super(page);
        this.pathInput = page.getByTestId('route-form-paths-input-1');
        this.hostInput = page.getByTestId('route-form-hosts-input-1');
        this.saveRouteButton = page.getByTestId('route-create-form-submit');
        this.methodSelectButton = page.getByTestId('multiselect-trigger');
        this.postSelectButton = page.getByTestId('multiselect-item-POST');
        this.methodInput = page.getByTestId('multiselect-dropdown-input');
        this.nameInput = page.getByTestId('route-form-name');

    }

    /**
    * input method in the list
    */
    async inputAMethod(method) {
        const methodSelectButtonStatus = await this.click(this.methodSelectButton, 'select method button');
        if (methodSelectButtonStatus === 'done') {
            logger.info('✅ method select has been displayed');
            return await this.fill(this.methodInput, method, 'input method value');
        }
        logger.info(`❌ failed in displaying method select list,status is: ${methodSelectButtonStatus}`);
        return "error";
    }

    /**
    * select post from the list as the method 
    */
    async seclectPostMethod() {
        const methodSelectButtonStatus = await this.click(this.methodSelectButton);
        if (methodSelectButtonStatus === 'done') {
            await this.click(this.postSelectButton, "Select Post as a method");
        }
        return "error"
    }

    /**
    * click 'save Route' button in route detail page
    */
    async clickSaveRouteButton() {
        return await this.click(this.saveRouteButton, "Save route");
    }


    /**
     * Fill the route form.
     *
     * @param {{name?: string, path?: string, host?: string, method?: string}} data - Form data.
     * @returns {Promise<void>} Resolves when the form is filled.
     */
    async fillRouteForm(data) {
        try {
            logger.info(`🚀 filling the route form `);
            if (data.name) await this.fill(this.nameInput, data.name, 'Name Value');
            if (data.path) await this.fill(this.pathInput, data.path, 'Path Value');
            if (data.host) await this.fill(this.hostInput, data.host, 'Host Value');
            if (data.method) {
                await this.inputAMethod(data.method);
                await this.sendKey('ArrowDown');
                await this.sendKey('Enter');
            }

        } catch (error) {
            logger.error(`❌ Failed to fill the form: ${error}`);
            throw error;
        }
    }



}

