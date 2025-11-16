import { logger } from '../utils/logger.js';
import { expect } from '@playwright/test';

/**
 * BasePage serves as the base class for all page objects.
 * Provides common utilities and access to the Playwright Page instance.
 */
export class BasePage {

    /**
     * @param {import('playwright').Page} page - The Playwright Page object.
     */
    constructor(page) {
        this.page = page;
    }

    /**
    * Navigate to specific page 
    * @param {url} 
    */
    async goto(url) {
        try {
            logger.info(`🧭 Navigating to: ${url}`);
            await this.page.goto(url);
        } catch (error) {
            logger.error(`❌ Failed to navigate to ${url}: ${error}`);
            throw error;
        }
    }

    /**
     * Get text from a specific column of the first row in a table.
     *
     * @param {Locator} targetTable - Locator of the table element.
     * @param {string} elementPath - selector for the specific column inside the first row.
     * @param {string} [desc="get a table's first row"] - Description for logging.
     * @param {number} [timeout=5000] - Timeout in milliseconds for waiting operations.
     * @returns {Locator|null} Locator for the first row, or null if not available.
     */
    async getTableFirstRow(targettable, elementPath, desc = "get a table's first row", timeout = 5000) {
        try {
            logger.info(`🧭 Fetching the first row of a table`);
            await this.waitForVisible(targettable, timeout);
            await targettable.scrollIntoViewIfNeeded();
            const visibleTable = await targettable.isVisible().catch(() => false);
            if (!visibleTable) {
                logger.warn(`❌ the table ${targettable} not visible, skipping get a table`);
                return null;
            }
            //get specific column eg:'[data-testid="methods"]'
            const specColValFirstRow = await targettable.locator('tbody tr').first().locator(elementPath);
            await this.waitForVisible(specColValFirstRow, timeout);
            const visibleRow = await specColValFirstRow.isVisible().catch(() => false);
            if (!visibleRow) {
                logger.warn(`❌ first row's specific cloumn ${elementPath} not visible, skipping get a table's first row`);
                return null;
            }
            return specColValFirstRow;
        } catch (error) {
            logger.error(`❌ Failed ${desc} : ${error}`);

        }
    }

    /**
     * Get text from cell with single value
     *
     * @param {Locator} targetRowCol - Locator of the specific column in the first row
     * @returns {Promise<string|null>}} the value of the cell which only has one value 
     */
    async getCellSingleValue(targetRowCol) {
        try {
            logger.info(`🧭 get cell's single value ${targetRowCol}`);
            // const firstRowName = tableLocator.locator('tbody tr').first().locator('[data-testid="name"]');
            // const nameText = await targetRow.textContent();
            const cellVal = this.getText(targetRowCol, '1 row column', 5000);
            return cellVal;

        } catch (error) {
            logger.error(`❌ Failed to gell cell's single value: ${targetRowCol}: ${error}`);
        }
    }

    /**
     * Get text from cell with single value
     *
     * @param {Locator} targetRowCol - Locator of the specific column in the first row
     * @returns {Promise<string>} the value of the cell which only has multiple values
     */
    async getCellMultiValue(targetRowCol) {
        try {
            logger.info(`🧭 get cell's multiple values ${targetRowCol}`);
            // const firstRowName = tableLocator.locator('tbody tr').first().locator('[data-testid="name"]');
            // const nameText = await targetRow.textContent();
            const badgeTexts = await targetRowCol.locator('.k-badge .badge-content-wrapper').allTextContents();
            // console.log(badgeTexts.toString()); // ['http', 'https']
            return badgeTexts.toString();

        } catch (error) {
            logger.error(`❌ Failed to gell cell's multiple values: ${targetRowCol}: ${error}`);
        }
    }

    /**
    * Safe click on a locator
    * @param {Locator} locator - Playwright locator
    * @param {string} desc - Description for logging
    * @returns {string}  'invisible' | 'disabled' | 'done' | 'error' 
    */
    async click(locator, desc = 'click element', timeout = 10000) {
        try {
            logger.info(`🖱️ Clicking element: ${desc || locator}`);
            await this.waitForVisible(locator, timeout);
            await locator.scrollIntoViewIfNeeded();
            const visible = await locator.isVisible().catch(() => false);
            if (!visible) {
                logger.warn(`❌ ${desc} not visible, skipping click`);
                return "invisible";
            }

            const isDisabled = await locator.isDisabled().catch(() => false);
            if (isDisabled) {
                logger.warn(`❌ ${desc} is disabled, cannot click`);
                return "disabled";
            }
            await locator.click();
            return "done";

        } catch (error) {
            logger.error(`❌ Click failed on ${desc || locator}: ${error}`);
            return "error";
        }
    }

    /**
    * fill value for locator
    * @param {Locator} locator - Playwright locator
    * @param {string} value - the value to be filled
    * @param {string} desc - Description for logging
    * @returns {string}  'invisible' | 'done' | 'error' 
    */
    async fill(locator, value, desc = 'fill a value', timeout = 10000) {
        try {
            logger.info(`⌨️ Filling ${desc || locator} with value: ${value}`);
            await this.waitForVisible(locator, timeout);
            await locator.scrollIntoViewIfNeeded();
            const visible = await locator.isVisible().catch(() => false);
            if (!visible) {
                logger.warn(`❌ ${desc || locator} not visible, skipping fill`);
                return "invisible";
            }
            await locator.fill(value);
            return "done";

        } catch (error) {
            logger.error(`❌ Fill failed on ${desc || locator}: ${error}`);
            return "error";

        }
    }

    /**
     * Safe get text from a locator
     * @param {Locator} locator - Playwright locator
     * @param {string} desc - Description for logging
     * @returns {Promise<string|null>} - Returns the text of the locator or null if failed
     */
    async getText(locator, desc = 'element', timeout = 10000) {
        let text;

        try {
            if (typeof locator === 'string') {
                text = await this.page.textContent(locator);
            } else {
                // await locator.waitFor({ state: 'visible', timeout: 5000 });
                await this.waitForVisible(locator, timeout);
                await locator.scrollIntoViewIfNeeded();
                const visible = await locator.isVisible().catch(() => false);
                if (!visible) {
                    logger.warn(`❌ ${desc} not visible, skipping getText`);
                    return null;
                }
                text = await locator.textContent();

            }

            logger.info(`📋 Got text from ${desc || locator}: ${text}`);
            return text;
        } catch (error) {
            logger.error(`❌ Failed to get text from ${desc || locator}: ${error}`);
            return null;
        }
    }

    /**
     * Get text from a specific column of the first row in a table.
     * @param {Locator} locator - Playwright locator
     * @param {number} [timeout=5000] - Timeout in milliseconds for waiting operations.
     */
    async waitForVisible(locator, timeout) {
        try {
            logger.info(`⏳ Waiting for ${locator} to be visible`);
            await locator.waitFor({ state: 'visible', timeout });
        } catch (error) {
            logger.error(`❌ Element not visible: ${locator}`);

        }
    }

    /**
     * @param {*} actual - 实际值 / Locator / Page / APIResponse
     * @param {string} matcher - 'toBe' | 'toContain' | 'toMatch' | 'toHaveURL' | 'toBeVisible'
     * @param {*} expected - 期望值 / 正则对象
     * @param {string} description - 日志描述
     */
    async expectSoft(actual, matcher, expected, description = '') {
        try {
            let pass = true;
            switch (matcher) {
                case 'toBe':
                    pass = actual === expected;
                    expect.soft(actual).toBe(expected);
                    break;
                case 'toContain':
                    pass = actual.includes(expected);
                    expect.soft(actual).toContain(expected);
                    break;
                case 'toMatch':
                    if (expected instanceof RegExp) {
                        pass = expected.test(actual);
                    } else {
                        pass = actual === expected;
                    }
                    expect.soft(actual).toMatch(expected);
                    break;
                case 'toHaveURL':
                    let url = actual.url();
                    logger.info("testttttt" + url);
                    pass = expected instanceof RegExp ? expected.test(actual.url()) : actual === expected;
                    await expect.soft(actual).toHaveURL(expected);
                    break;
                case 'toBeVisible':
                    pass = await actual.isVisible();
                    await expect.soft(actual).toBeVisible();
                    break;
                default:
                    throw new Error(`Unsupported matcher: ${matcher}`);
            }

            logger.info(`${pass ? '✅' : '❌'} ${description || matcher} ${pass ? 'passed' : 'failed'}${!pass ? `, actual: ${actual}, expected: ${expected}` : ''}`);
        } catch (error) {
            logger.error(`❌ ${description || matcher} failed: ${error.message}`);

        }

    }

    /**
     * Sends a keyboard key press to the page.
     *
     * @param {string} keyVal - The key to press (e.g., "Enter", "ArrowDown").
     * @returns {Promise<void>} Resolves when the key press is completed.
     */
    async sendKey(keyVal) {
        try {
            logger.info(`🚀 sending the key: ${keyVal} `);
            await this.page.keyboard.press(keyVal);
        } catch (error) {
            logger.error(`❌ Failed to send key ${keyVal}: ${error}`);
        }
    }


    // // 验证页面上的表格
    // async verifyTable({
    //     page,
    //     tableLocator,          // table 定位器，如：page.getByTestId('service-table')
    //     expectedHeaders = [],  // 预期表头数组
    //     expectedFirstRow = []  // 预期第一行数据数组
    // }) {
    //     try {
    //         // 1⃣️ 等待表格加载可见
    //         await tableLocator.waitFor({ state: 'visible', timeout: 5000 });

    //         // 2⃣️ 验证表头
    //         const headerCells = tableLocator.locator('thead th');
    //         const headerCount = await headerCells.count();

    //         const actualHeaders = [];
    //         for (let i = 0; i < headerCount; i++) {
    //             actualHeaders.push((await headerCells.nth(i).innerText()).trim());
    //         }

    //         if (JSON.stringify(actualHeaders) !== JSON.stringify(expectedHeaders)) {
    //             return {
    //                 status: 'failed',
    //                 errorType: 'header mismatch',
    //                 expected: expectedHeaders,
    //                 actual: actualHeaders
    //             };
    //         }

    //         // 3⃣️ 验证第一行
    //         const firstRowCells = tableLocator.locator('tbody tr').first().locator('td');
    //         const firstRowCount = await firstRowCells.count();

    //         const actualFirstRow = [];
    //         for (let i = 0; i < firstRowCount; i++) {
    //             actualFirstRow.push((await firstRowCells.nth(i).innerText()).trim());
    //         }

    //         if (JSON.stringify(actualFirstRow) !== JSON.stringify(expectedFirstRow)) {
    //             return {
    //                 status: 'failed',
    //                 errorType: 'first row mismatch',
    //                 expected: expectedFirstRow,
    //                 actual: actualFirstRow
    //             };
    //         }

    //         return { status: 'passed' };

    //     } catch (error) {
    //         return { status: 'error', message: error.message };
    //     }
    // }











}
