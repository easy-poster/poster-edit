import { useAuth } from '@/hooks/eventBus';
import { getImgCaptcha } from '@/services/user';
import { storage } from '@/utils';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';

const Captcha = React.memo(() => {
    const [svg, setSvg] = useState('');
    const [base64, setBase64] = useState('');

    const { refreshCaptchaOn } = useAuth();

    const getCaptcha = async () => {
        let resCaptcha = await getImgCaptcha({
            width: 150,
            height: 40,
        });
        if (resCaptcha?.data?.includes('data:image')) {
            setBase64(resCaptcha?.data);
        } else {
            setSvg(resCaptcha?.data);
        }
        storage.set('vcImgId', resCaptcha?.captchaId);
    };

    const handleRefresh = useCallback(() => {
        getCaptcha();
    }, []);

    useEffect(() => {
        refreshCaptchaOn(() => {
            getCaptcha();
        });

        getCaptcha();
    }, []);

    return svg || base64 ? (
        <div className={styles.captcha} onClick={handleRefresh}>
            {svg ? (
                <div
                    className={styles.svg}
                    dangerouslySetInnerHTML={{ __html: svg }}
                ></div>
            ) : (
                <img className={styles.img} src={base64} alt="" />
            )}
        </div>
    ) : null;
});

export default Captcha;
