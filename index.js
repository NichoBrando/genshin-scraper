const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const Promise = require('bluebird');

const generateJSON = async() => {
  const driver = await new Builder().forBrowser('firefox').build();

  const getList = async (className) => {
    const list = await driver.findElements(By.className(className));
    itemList = [];
    for (item of list) {
      itemList.push({
        name: await item.getAttribute('alt'),
        src: await item.getAttribute('src')
      });
    }
    return itemList;
  }

  try {
    const targets = [
      {
        url: 'https://genshin.gg/',
        className: 'character-icon'
      },
      {
        url: 'https://genshin.gg/weapons',
        className: 'table-image'
      }
    ];
    const itemsData = [];
    await Promise.each(
      targets, 
      async target => {
        await driver.get(target.url);
        const newItems = await getList(target.className);
        itemsData.push(...newItems);
      }
    );
    fs.writeFile('items.json', JSON.stringify(itemsData), 'utf8', () => 1);
  } finally {
    await driver.quit();
  }
};

generateJSON();