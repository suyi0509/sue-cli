// 创建一个 http.js 专门处理模板和版本信息的获取

// 通过axios处理请求
import axios from 'axios';

axios.interceptors.response.use((res) => {
  return res.data;
});

/**
 * 获取模板列表
 * @returns Promise
 * */
const getRepoList = async () => {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos');
};

/** 获取版本信息
 *  @returns Promise
 */
const getTagList = async (repo) => {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`);
};

export { getRepoList, getTagList };
