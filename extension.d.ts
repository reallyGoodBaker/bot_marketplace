declare namespace globalThis {

    interface Bot {
        type: string;
        id: number;
        clone: Bot;
        send(msg: string): Promise<any>;
        recall(msgId: number): void;
        ban(userId: number, duration: number): Promise<any>
    }
    
    interface Decorator {
        constructor(): any
    }
    
    interface SlotParameter extends Array<string> {
        combine(start?: number, end?: number): SlotParameter
        /**
         * @deprecated
         * Please use Array.prototype.includes
         */
        hasValue(str: string): boolean
        seperate(seperater: string): SlotParameter[]
    }
    
    interface InitBundle {
        bot: Bot;
        data: any;
        args: SlotParameter;
        asyncTask: Decorator;
        suspend: Decorator;
    }
    
    interface ResumeBundle {
        asyncTask: Decorator;
        suspend: Decorator;
        data: {
            cache: any;
            change: {
                rawData: any;
                msgBot: Bot;
            }
        }
    }
    
    const interfaces: {
        readonly pluginHelp: unique symbol;
        readonly noNeedArgs: unique symbol;
    }
    
    abstract class Plugin {
        static [interfaces.pluginHelp]: any;
        static [interfaces.noNeedArgs]: boolean;
        init(bundle: InitBundle): void;
        resume(bundle: ResumeBundle): void;
        exit(): void;
    }
    
    interface Schedule {
        readonly statue: 'pending' | 'done' | 'paused';
        readonly handle: number;
        stop(): void;
        pause(): void;
        resume(): void;
    }
    
    interface ServiceSession {
        flags: {
            acceptEmulateData: boolean;
        }
    }
    
    interface OnDataHandler {
        (data: any): void
    }
    
    interface ServiceActor {
        onData(handler: OnDataHandler): void;
        onClose(handler: () => void): void;
        close(): void;
        sendDataTo(handle: string, data: any): void;
    }
    
    abstract class Service extends Plugin {
        handle: string;
        protected onStart(session: ServiceSession, bot: Bot, actor: ServiceActor): void;
    }
    
    
    }
    