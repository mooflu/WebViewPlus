import React from 'react';
import nb from 'notebookjs';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

const JupyterNBViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent) as string;
    const ipynb = JSON.parse(fileContent);
    const __html: string = nb.parse(ipynb).render().outerHTML;

    return <div dangerouslySetInnerHTML={{ __html }}></div>;
};

export class JupyterNBPlugin implements IPlugin {
    public shortName = 'JupyterNB';
    public name = 'Jupyter Notebook';
    public extensions = new Set<string>();
    public viewer = (<JupyterNBViewer />);

    constructor() {
        this.extensions.add('ipynb');
    }
}
