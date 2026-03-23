// Re-export TWebSocket from types module
export type { TWebSocket, TServerError } from '@/types/ws.types';

// Augment window to ensure Blockly types are available
declare global {
    interface Window {
        Blockly?: {
            WorkspaceSvg?: any;
            Xml?: any;
            utils?: any;
            Events?: any;
            DataCategory?: any;
            Procedures?: any;
            Blocks?: any;
            derivWorkspace?: any;
            inject?: any;
            svgResize?: any;
            [key: string]: any;
        };
    }
}
