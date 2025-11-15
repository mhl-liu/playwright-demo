import { v4 as uuidv4 } from 'uuid';
import { expect } from '@playwright/test';
import { logger } from './logger.js';

export class DataProcessor {
    static replaceDynamicValues(input) {
        //string
        if (typeof input === 'string') {
            return input
                .replace(/\$\{uuid\(\)\}/g, () => uuidv4())
                .replace(/\$\{date\((.*?)\)\}/g, (_, fmt) => this.formatDate(fmt));
        }

        // object or array
        const str = JSON.stringify(input);
        const replaced = str
            .replace(/\$\{uuid\(\)\}/g, () => uuidv4())
            .replace(/\$\{date\((.*?)\)\}/g, (_, fmt) => this.formatDate(fmt));
        return JSON.parse(replaced);
    }

    static formatDate(fmt = 'YYYYMMDDHHmmssSSS') {
        const d = new Date();
        if (fmt === 'YYYY-MM-DD') {
            const pad = n => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        }
        if (fmt === 'timestamp') return d.getTime().toString();

        if (fmt === 'MMM DD, YYYY, hh:mm A') {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = months[d.getMonth()];
            const day = d.getDate();
            const year = d.getFullYear();
            let hours = d.getHours();
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
        }
        if (fmt === 'YYYYMMDDHHmmssSSS') {
            return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${d.getMilliseconds().toString().padStart(3, '0')}`;
        }

        return d.toISOString();
    }

    /**
     * Extracts a matching group from a string using a regular expression
     * @param {string} source - The source string to match
     * @param {RegExp} regex - The regular expression used for matching
     * @param {number} groupIndex - The index of the capture group to extract (default: 1)
     * @param {string} description - Optional description for logging
     * @returns {string|null} The matched value or null
     */
    static extractByRegex(source, regex, groupIndex = 1, description = '') {
        if (typeof source !== 'string') {
            logger.error(`❌ ${description || 'extractByRegex'} failed: source is not a string`);
            throw new Error('Source must be a string');
        }

        const match = source.match(regex);
        if (!match) {
            logger.error(`❌ ${description || 'extractByRegex'} failed: no matching result found`);
            return '';

        }

        const value = match[groupIndex];
        logger.info(`📦 Extracted result (${description || 'regex match'}): ${value}`);
        expect.soft(value, `Extracted value should not be null (${description || ''})`).not.toBeNull();

        return value;
    }

    /**
     * delete Service(cleaning old data) 
     * @param {object} request - request
     * @param {string} baseUrl - baseurl
     * @param {string} serviceId - service ID to be deleted
     */
    static async deleteService(request, baseUrl, serviceId) {
        const url = `${baseUrl}/${serviceId}`;
        logger.info(`🧹 Deleting service at: ${url}`);

        const response = await request.delete(url);
        logger.info(`Status: ${response.status()}`);

        const body = await response.text();
        console.log('Response body:', body);

        expect.soft(response.ok()).toBeTruthy();

        return response;
    }

    /**
     * add  Service through API for testing premise senario
     * @param {object} request -  request 
     * @param {string} baseUrl - URL（http://localhost:8001/default/services）
     * @param {object} payload - request data
     */
    static async createService(request) {
        const baseUrl = 'http://localhost:8001/default/services';
        const payload = {
            name: '12new-service-20251113010629119',
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
        await new Promise(r => setTimeout(r, 3000));

        const body = await response.json().catch(() => ({}));
        logger.info(`Status: ${response.status()}`);
        logger.info('Response body:', body.id);

        expect(response.ok()).toBeTruthy();

        // 返回响应体中关键字段（如 service ID）
        return body.id;
    }





}
