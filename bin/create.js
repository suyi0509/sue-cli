/*
 * @Author: suyi
 * @Date: 2023-08-07 16:54:26
 * @LastEditTime: 2023-08-07 18:03:47
 * @LastEditors: suyi
 * @Description: 如果代码不是为了制造bug，那将毫无意义
 * @FilePath: \sue-cli\bin\create.js
 */

import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

const create = async (name, options) => {
  console.log('name:' + name, 'options', options);
  // 执行创建
  // 1.选择目录
  const cwd = process.cwd();
  // 2.创建目录地址
  const targetFile = path.join(cwd, name);
  console.log(cwd, targetFile, '11', fs.pathExists(targetFile), options);

  if (fs.pathExists(targetFile)) {
    // 存在，是否强制创建
    if (options.force) {
        console.log('强制删除')
      await fs.remove(targetFile,(err) =>{
        console.log(err,'err')
    });
    } else {
      // TODO： 询问用户是否需要强行覆盖
      // 1.是否需要覆盖
      await askForce(targetFile);
    }
  }
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
