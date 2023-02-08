import React from 'react';
import UploadDrop from './components/UploadDrap';
import UploadList from './components/UploadList';
import ResourceContainer from './container/ResourceContainer';

const UploadPage = React.memo(() => {
    return (
        <ResourceContainer>
            <UploadDrop />
            <UploadList />
        </ResourceContainer>
    );
});

export default UploadPage;
