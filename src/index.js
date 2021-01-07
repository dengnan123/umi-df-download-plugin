const compressing = require('compressing');
const fetchPost = require('./utils/fetch');
const fs = require('fs-extra');
const path = require('path');

/**
 * 下载项目所需要的plugins
 */
const download = (api, opts) => {
  api.onBuildSuccess(async ({ stats }) => {
    const { url, data, outputPath } = opts;
    const { absOutputPath } = api.paths;
    console.log('absOutputPathabsOutputPath', absOutputPath);
    const baseFilePath = outputPath || absOutputPath;
    fs.ensureDirSync(baseFilePath);
    const codeFilePath = `${baseFilePath}/plugin.zip`;
    console.log('baseFilePathbaseFilePath', baseFilePath);
    console.log('开始下载插件>>>>>>>');
    await fetchPost(url, data, codeFilePath);
    console.log('下载完成开始处理压缩包>>>>>');
    await compressing.zip.uncompress(codeFilePath, baseFilePath);
    console.log('解压完成');
    //删除下载的plugin.zip
    const newFiles = await fs.readdir(baseFilePath);
    console.log('newFilesnewFilesnewFiles', newFiles);
    let fileName;
    for (const v of newFiles) {
      if (v.includes('tmp')) {
        fileName = v;
      }
    }
    const pluginBasePath = `${baseFilePath}/${fileName}`;
    const pluginFiles = await fs.readdir(pluginBasePath);
    for (const file of pluginFiles) {
      fs.moveSync(`${pluginBasePath}/${file}`, `${baseFilePath}/${file}`);
    }
    fs.removeSync(codeFilePath);
    fs.removeSync(pluginBasePath);
  });
};

module.exports = download;
