import { FabricObjectType } from '@/pages/Edit/Stage/canvas/const/defaults';
import { useState } from 'react';

export interface activeSpriteProps {
    type: FabricObjectType;
    id: string;
    obj: FabricObject;
}

export default () => {
    const [activeSprite, setActiveSprite] = useState<activeSpriteProps>();
    return {
        activeSprite,
        setActiveSprite,
    };
};
