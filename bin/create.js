/*
 * @Author: suyi
 * @Date: 2023-08-07 16:54:26
 * @LastEditTime: 2023-08-08 14:29:20
 * @LastEditors: suyi
 * @Description: 如果代码不是为了制造bug，那将毫无意义
 * @FilePath: \sue-cli\bin\create.js
 */

import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { Generators } from './generator.js';

const create = async (name, options) => {
  // 执行创建
  // 1.选择目录
  const cwd = process.cwd();
  // 2.创建目录地址
  const targetFile = await path.join(cwd, name);
  if (fs.existsSync(targetFile)) {
    // 存在，是否强制创建
    if (options.force) {
      console.log('强制删除');
      await fs.remove(targetFile); // 删除文件夹
    } else {
      // 1.是否需要覆盖
      await askForce(targetFile);
    }
  }

  // 创建项目
  const generator = new Generators(name, targetFile);
  // 开始创建
  generator.create();
};

const askForce = async (targetFile) => {
  let { force } = await inquirer.prompt([
    {
      name: 'force',
      type: 'list',
      message: '你确定要覆盖吗',
      choices: [
        {
          name: '覆盖',
          value: true,
        },
        {
          name: '取消',
          value: false,
        },
      ],
    },
  ]);

  if (force) {
    // 移除
    console.log(`\r\nRemoving.........`);
    await fs.remove(targetFile);
  }
};

export { create };
