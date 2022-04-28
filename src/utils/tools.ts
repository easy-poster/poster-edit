export default {
  randomColor: () => {
    let color = '#';
    for (var i = 0; i < 6; i++)
      color += parseInt(Math.random() * 16).toString(16);
    return color;
  },
  // 判断资源名字是否重复，如果重复则增加index
  resourceRepeat: (resources, curTitle) => {
    let isExistResource = resources.find((item) => {
      return item.title === curTitle;
    });
    if (isExistResource) {
      let allRepeatIndex = [];
      let curTitleName = curTitle.substr(0, curTitle.lastIndexOf('.'));
      let curTitleSuffix = curTitle.substr(curTitle.lastIndexOf('.'));
      resources.forEach((item) => {
        let itemName = item.title.substr(0, item.title.lastIndexOf('.'));

        if (itemName.indexOf(curTitleName) !== -1) {
          let repeatIndex = itemName.substring(
            itemName.lastIndexOf('[') + 1,
            itemName.lastIndexOf(']'),
          );
          allRepeatIndex.push(repeatIndex);
        }
      });
      allRepeatIndex.sort((a, b) => {
        return b - a;
      });
      return `${curTitleName}[${allRepeatIndex[0] / 1 + 1}]${curTitleSuffix}`;
    } else {
      return curTitle;
    }
  },
  compressImg: (img, type) => {
    // 获取base64的文件大小
    function getBase64ImgSize(base64DataStr) {
      var tag = 'base64,';
      // 截取字符串 获取"base64,"后面的字符串
      base64DataStr = base64DataStr.substring(
        base64DataStr.indexOf(tag) + tag.length,
      );

      // 根据末尾等号（'='）来再次确认真实base64图片字符串
      var eqTagIndex = base64DataStr.indexOf('=');
      base64DataStr =
        eqTagIndex != -1
          ? base64DataStr.substring(0, eqTagIndex)
          : base64DataStr;

      // 计算大小
      var strLen = base64DataStr.length;
      var fileSize = strLen - (strLen / 8) * 2;
      return fileSize;
    }

    // 图片等比缩放
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let imgAspectRatio = img.width / img.height;
    let Maxbd = img.width / 1920 > img.height / 1080 ? 'width' : 'height';
    switch (Maxbd) {
      case 'width':
        canvas.width = 1920;
        canvas.height = canvas.width / imgAspectRatio;
        break;
      case 'height':
        canvas.height = 1080;
        canvas.width = canvas.height * imgAspectRatio;
        break;
      default:
        break;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let base64 = canvas.toDataURL(type, 1);
    let cutBlob = tools.dataURLtoBlob(base64);
    let fileSize = getBase64ImgSize(base64);

    return {
      base64,
      fileSize,
      width: canvas.width,
      height: canvas.height,
      cutBlob,
    };
  },
};
