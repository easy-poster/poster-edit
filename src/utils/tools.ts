const tools = {
    /**
     * @name 十六进制颜色随机
     * @returns
     */
    randomColor16() {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += parseInt(Math.random() * 16 + '').toString(16);
        }
        return color;
    },
    addEventHandler: (target, type, fn) => {
        if (target.addEventListener) {
            target.addEventListener(type, fn);
        } else {
            target.attachEvent('on' + type, fn);
        }
    },
    removeEventHandler: (target, type, fn) => {
        if (target.removeEventListener) {
            target.removeEventListener(type, fn);
        } else {
            target.detachEvent('on' + type, fn);
        }
    },
    getWebUrl: (file: any) => {
        let url = null;
        if (window.createObjectURL !== undefined) {
            // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) {
            // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
            // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    // base64转blob
    dataURLtoBlob: (dataurl: string) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },
    // blob转base64
    blobToDataURI(blob: Blob) {
        return new Promise((resovle, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
                resovle(e?.target?.result);
            };
        });
    },
    // 等比压缩图片
    compressImg: (imgProps: any, width: number, height: number) => {
        return new Promise<Blob | undefined>((resolve, reject) => {
            let img = new Image();
            let blob,
                type = 'image/jpg';
            blob = imgProps.blob;
            type = imgProps.type;

            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                let canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let imgAspectRatio = img.width / img.height;
                let Maxbd =
                    img.width / width > img.height / height
                        ? 'width'
                        : 'height';
                switch (Maxbd) {
                    case 'width':
                        canvas.width = width;
                        canvas.height = canvas.width / imgAspectRatio;
                        break;
                    case 'height':
                        canvas.height = height;
                        canvas.width = canvas.height * imgAspectRatio;
                        break;
                    default:
                        break;
                }
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
                // base64 = canvas.toDataURL(type, 1) || '';
                // coverBlob = tools.dataURLtoBlob(base64)
                canvas.toBlob(
                    (coverBlob) => {
                        resolve(coverBlob || undefined);
                    },
                    type,
                    1,
                );
            };
            img.onerror = () => {
                reject();
            };
        });
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
                let itemName = item.title.substr(
                    0,
                    item.title.lastIndexOf('.'),
                );

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
            return `${curTitleName}[${
                allRepeatIndex[0] / 1 + 1
            }]${curTitleSuffix}`;
        } else {
            return curTitle;
        }
    },
};

export default tools;
