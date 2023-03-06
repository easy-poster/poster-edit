import React from 'react';
import FontColor from './FontColor';
import FontFamily from './FontFamily';
import FontItalic from './FontItalic';
import FontSize from './FontSize';
import FontWeight from './FontWeight';
import TextLine from './TextLine';
// import TextUppercase from './TextUppercase';
import TextAlign from './TextAlign';
import FontSpacing from './FontSpacing';
// import FontVertical from './FontVertical';
import FontStyle from './FontStyle';
import styles from './index.less';

const TextBoxBar = React.memo(() => {
    return (
        <div className={styles.textBarWrap}>
            <FontFamily />
            <FontSize />
            <FontColor />
            <FontWeight />
            <FontItalic />
            <TextLine />
            <TextAlign />
            <FontSpacing />
            {/* <FontStyle /> */}
        </div>
    );
});

export default TextBoxBar;
