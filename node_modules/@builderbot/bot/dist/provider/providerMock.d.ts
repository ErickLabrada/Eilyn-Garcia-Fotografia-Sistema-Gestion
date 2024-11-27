import { ProviderClass } from './interface/provider';
import type { ProviderEventTypes } from '../types';
declare class TestProvider extends ProviderClass {
    protected afterHttpServerInit(): void;
    globalVendorArgs: {
        name: string;
    };
    protected beforeHttpServerInit(): void;
    protected initVendor(): Promise<void>;
    protected busEvents(): {
        event: string;
        func: Function;
    }[];
    saveFile(): Promise<string>;
    delaySendMessage(milliseconds: number, eventName: keyof ProviderEventTypes, payload: any): Promise<void>;
    sendMessage(userId: string, message: string): Promise<any>;
}
export { TestProvider };
//# sourceMappingURL=providerMock.d.ts.map