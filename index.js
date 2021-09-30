const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');

const getThings = async() => {
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
    await driver.get('https://genshin.gg/');
    const characters = await getList('character-icon');
    await driver.get('https://genshin.gg/weapons');
    const weapons = await getList('table-image');
    const itemsData = [...characters, ...weapons];
    fs.writeFile('items.json', JSON.stringify(itemsData), 'utf8', () => 1);
  } finally {
    await driver.quit();
  }
};

getThings();