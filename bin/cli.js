#!/usr/bin/env node

import { program } from 'commander';

console.log('sue-cli,working');

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f,--force', 'overwirte target directory if it exist')
  .action((name, options) => {
    console.log('name:' + name, 'options', options);
  });

program.version('v1.0.0').usage('<command> [option]');

// 解析用户执行命令传入参数
program.parse(process.argv);
