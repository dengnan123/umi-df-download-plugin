const compressing = require('compressing');
const fetchPost = require('./utils/fetch');
const fs = require('fs-extra');

/**
 * 下载项目所需要的plugins
 */
const download = (api, opts) => {
  api.onBuildSuccess(async ({ stats }) => {
    const { url, data, outputPath } = opts;
    const { absOutputPath } = api.paths;
    const baseFilePath = outputPath || absOutputPath;
    fs.ensureDirSync(baseFilePath);
    const codeFilePath = `${baseFilePath}/plugin.zip`;
    console.log('baseFilePathbaseFilePath', baseFilePath);
    console.log('开始下载插件>>>>>>>');
    await fetchPost(url, data, codeFilePath);
    console.log('下载完成开始处理压缩包>>>>>');
    const unzipCodeFilePath = baseFilePath;
    await compressing.zip.uncompress(codeFilePath, unzipCodeFilePath);
    console.log('解压完成');
    //删除下载的plugin.zip
    fs.removeSync(codeFilePath);
  });
};

module.exports = download;
