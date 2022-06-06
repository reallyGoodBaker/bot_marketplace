let todos = {
    group: {},
    private: {}
};

/*
 * @typedef {import('./Plugin.js').InitBundle} InitBundle
 * @typedef {import('./Plugin.js').ResumeBundle} ResumeBundle
*/

class Todo extends Plugin {

    static [interfaces.pluginHelp] = {
        0: '待办 <add|del|delall|list> [值]',
        add: '待办 add 待办事项',
        del: '待办 del 待办事项',
        delall: '待办 delall',
        list: '待办 list'
    }

    constructor() {
        super();
    }

    /*
     * @param {InitBundle} bundle
    */
    init(bundle) {
        let { args, bot, asyncTask, suspend } = bundle;
        const command = args.shift();//取出第一个参数
        const val = args.shift();//取出第二个参数
        switch (command) {
            case 'add':
                todos[bot.type][bot.id] ?
                    todos[bot.type][bot.id].push(val) :
                    (todos[bot.type][bot.id] = [val]);
                asyncTask(bot.send(`已添加待办事件"${val}"`));
                break;
            case 'del':
                if (todos[bot.type][bot.id]) {
                    todos[bot.type][bot.id] = todos[bot.type][bot.id].filter(el => {
                        return el != val;
                    });
                }
                asyncTask(bot.send(`已删除待办事件"${val}"`));
                break;
            case 'delall':
                asyncTask(bot.send("确定删除所有待办事项？(Y/N)"));
                suspend('receive');
                const { type, id } = bot;
                this.context = { type, id };//保存发出指令者的信息
                break;
            case 'list':
                let str = '';
                if (todos[bot.type][bot.id]) {
                    todos[bot.type][bot.id].forEach(el => {
                        str += `\n${el}`;
                    });
                }
                asyncTask(bot.send("您的待办事件:" + str));
                break;
            default:
                break;
        }
    }

    /*
     * @param {ResumeBundle} bundle
    */
    resume(bundle) {
        const { asyncTask } = bundle;
        const bot = bundle.data.change.msgBot;
        if (bot.type == this.context.type && bot.id == this.context.id) {
            const selection = bundle.data.change.rawData.raw_message;
            selection == "Y" ?
                ((todos[bot.type][bot.id] = null), asyncTask(bot.send("成功删除"))) :
                asyncTask(bot.send("取消操作"));
        } else {
            suspend('receive');//不是指令发出者，继续等待
        }
    }
    exit() {
        this.context = null;
    }
}

module.exports = Todo;