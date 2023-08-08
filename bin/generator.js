import inquirer from 'inquirer';
import { getRepoList, getTagList } from './http.js';
import ora from 'ora';
import downloadGitRepo from 'download-git-repo';
import util from 'util';
import path from 'path';
import chalk from 'chalk';

// lib/Generator.js
const wrapLoading = async (fn, message, ...args) => {
  // 使用ora初始化，传入提示信息message
  const spinner = ora(message);
  // 动画
  spinner.start();

  try {
    // 执行传入方法fn
    const result = await fn(...args);
    // 状态修改为成功
    spinner.succeed();
    return result;
  } catch (err) {
    console.log('err:' + err);
    spinner.fail('Request failed, refetch ...');
  }
};

class Generators {
  constructor(name, targetFile) {
    this.name = name; // 目录名称
    this.targetFile = targetFile; // 创建位置
    // promise化
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  // 核心创建逻辑
  //   1. 获取模板名称
  //   2. 获取tag名称
  //   3. 下载模板到模板目录
  async create() {
    // 1. 获取模板名称
    const repo = await this.getRepo();
    // 2. 获取tag名称
    const tag = await this.getTag(repo);
    //   3. 下载模板到模板目录
    await this.download(repo, tag);
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log('\r\n  npm i ');
    console.log(' npm run serve\r\n');
  }

  async getRepo() {
    // 1.从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;

    // 过滤我们需要得模板名称
    const repos = repoList.map((item) => item.name);

    // 2.用户自己选择下载模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择你要下载得模板',
    });
    return repo;
  }

  async getTag(repo) {
    const tagList = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tagList) return;

    const tags = tagList.map((item) => item.name);

    // 2.用户自己选择下载tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: '请选择你要下载得tag',
    });

    return tag;
  }

  // 下载远程模板
  async download(repo, tag) {
    // 1）拼接下载地址
    const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`;
    // 2) 调用下载方法
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetFile) // 参数2: 创建位置
    );
  }
}

export { Generators };
