import { BasePage } from './basePage.js';

/**
 * ServiceDetailPage represents the service detail page in the application.
 * Provides methods to interact with the service detail form (getname, getmethod, etc.).
 * Extends BasePage for common page operations.
 */
export class ServiceDetailPage extends BasePage {
    /**
     * @param {import('playwright').Page} page - The Playwright Page object.
     */
    constructor(page) {
        super(page);
        this.serviceID = page.locator('.copy-text.monospace');
        this.serviceName = page.getByTestId('name-plain-text');
        this.timeSpanUpdated = page.getByTestId('updated_at-date');
        this.timeSpanCreated = page.getByTestId('created_at-date');
        this.routeTab = page.getByTestId('service-routes');
        this.addRouteButton = page.getByRole('button', { name: 'Add a Route' });
        this.newRouteButtonBar = page.getByTestId('toolbar-add-route');

        this.tableLocator = page.locator('table.table.has-hover.is-clickable');
        this.cellMethodsPath = '[data-testid="methods]';
        this.cellNamePath = '[data-testid="name"]';
        this.cellPathPath = '[data-testid="paths"]';

    }

    /**
    * get path value of the first row in route table
    */
    async getPathsColVal() {
        return await this.getRouteCellSingVal(this.cellPathPath);

    }

    /**
    * get name value of the first row in route table
    */
    async getNameColVal() {
        return await this.getRouteCellSingVal(this.cellNamePath);

    }

    /**
    * get method value of the first row in route table
    */
    async getMethodColVal() {
        return await this.getRouteCellMultiVal(this.cellMethodsPath);

    }

    /**
    * get the value of the cell which only has one value 
    * @param {string} elementColPath the path of specific column in the first row
    */
    async getRouteCellSingVal(elementColPath) {
        const targetRowCol = await this.getTableFirstRow(this.tableLocator, elementColPath);
        const cellVal = await this.getCellSingleValue(targetRowCol);
        return cellVal;
    }

    /**
    * get the value of the cell which only has multiple values 
    * @param {string} elementColPath the path of specific column in the first row
    */
    async getRouteCellMultiVal(elementColPath) {
        const targetRowCol = this.getTableFirstRow(this.tableLocator, elementColPath);
        const cellVal = this.getCellSingleValue(targetRowCol);
        return cellVal;
    }

    /**
    * click 'New Route' button in service detail page
    */
    async clickNewRouteButton() {
        return this.click(this.newRouteButtonBar, "new route")
    }

    /**
    * click 'Route' tab in service detail page
    */
    async clickRouteTab() {
        return this.click(this.routeTab, "switch to route tab")
    }

    /**
    * click 'Add a Route' button in route tab
    */
    async clickAddRouteButton() {
        return this.click(this.addRouteButton, "Add a route")
    }

    async getServiceID() {
        return this.getText(this.serviceID, "actualServiceID");
    }

    /**
    * get service name in service detail page
    */
    async getServiceName() {
        return this.getText(this.serviceName, "actualServiceName");
    }

    /**
    * get 'update time' in service detail page
    */
    async getUpdatedAt() {
        return this.getText(this.timeSpanUpdated, "actualupdatetime");
    }

    /**
    * get 'create time' in service detail page
    */
    async getCreatedAt() {
        return this.getText(this.timeSpanCreated, "actualCreateTime");
    }

}
