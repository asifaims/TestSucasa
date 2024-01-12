const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

// Create a new instance of the WebDriver
const driver = new Builder().forBrowser('chrome').build();

// Navigate to a specific URL
async function navigateToWebsite() {
    try {
        await driver.get('https://www.staysucasa.com');
        console.log('Successfully navigated to the website.');

        // Wait for the element to be clickable using XPath with a timeout of 10 seconds
        const sectionElement = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(), "The Sucasa Standard")]'), 10000));
        await driver.wait(until.elementIsVisible(sectionElement), 10000);
        await driver.wait(until.elementIsEnabled(sectionElement), 10000);

        // Scroll to the section using JavaScript
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'start' });", sectionElement);

        console.log('Successfully scrolled to "The Sucasa Standard" section.');

        // Verify if the section contains the specified text
        const sectionText = await sectionElement.getText();
        assertTextInSection(sectionText, 'Work From Anywhere');
        assertTextInSection(sectionText, 'Transparent Prices');
        assertTextInSection(sectionText, 'Premium Properties');

        console.log('Text verification passed.');

        // Locate the link or button associated with "Work From Anywhere" and click on it
        const workFromAnywhereLink = await driver.findElement(By.linkText('Work From Anywhere'));
        await workFromAnywhereLink.click();

        console.log('Successfully clicked on "Work From Anywhere" link.');

        // Locate the "Find Stays" button and click on it
        const findStaysButton = await driver.findElement(By.linkText('Find Stays'));
        await findStaysButton.click();

        console.log('Successfully clicked on "Find Stays" button.');

        // Verify the page URL
        const expectedUrl = 'https://www.staysucasa.com/index?#featured';
        const actualUrl = await driver.getCurrentUrl();
        if (actualUrl === expectedUrl) {
            console.log('Page URL is as expected.');
        } else {
            throw new Error(`Page URL mismatch. Expected: ${expectedUrl}, Actual: ${actualUrl}`);
        }

        // Take a screenshot and save with timestamped name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotName = `FIRST_${timestamp}.png`;
        const screenshotData = await driver.takeScreenshot();
        fs.writeFileSync(screenshotName, screenshotData, 'base64');
        console.log(`Screenshot captured: ${screenshotName}`);
    } catch (error) {
        console.error('Error navigating to the website:', error.message);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Function to assert if the specified text is present in the section
function assertTextInSection(sectionText, expectedText) {
    if (!sectionText.includes(expectedText)) {
        throw new Error(`Text "${expectedText}" not found in the section.`);
    }
}

// Execute the function to navigate to the website
navigateToWebsite();
