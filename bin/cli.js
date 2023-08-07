#!/usr/bin/env node

import { program } from 'commander';
import { create } from './create.js';
import chalk from 'chalk';
import figlet from 'figlet';

console.log('sue-cli,working');

// 一、添加命令

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f,--force', 'overwirte target directory if it exist')
  .action((name, options) => {
    // console.log('name:' + name, 'options', options);
    create(name, options);
  });

program
  // 监听 --help 执行
  .on('--help', () => {
    // 新增说明信息
    console.log(
      '\r\n' +
        figlet.textSync('sue', {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true,
        })
    );
    console.log(
      `\r\nRun ${chalk.cyan(
        `sue <command> --help`
      )} for detailed usage of given command\r\n`
    );
  });

program.version('v1.0.0').usage('<command> [option]');

// 解析用户执行命令传入参数
program.parse(process.argv);
