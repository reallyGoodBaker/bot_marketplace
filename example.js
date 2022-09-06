/// <reference path="extension.d.ts"/>

class ExamplePlugin extends Plugin {

    static [interfaces.pluginHelp] = {
        0: '这是个 example'
    }
    static [interfaces.noNeedArgs] = true

    /**
     * @param {InitBundle} bundle
     */
    init(bundle) {}

    /**
     * @param {ResumeBundle} bundle
     */
    resume(bundle) {}

    exit() {}
}


class ExampleService extends Service {
    handle = 'ExampleService'

    /**
     * @param {ServiceSession} session 
     * @param {Bot} bot 
     * @param {ServiceActor} actor 
     */
    onStart(session, bot, actor) {}
}

//将插件导出
module.exports = ExamplePlugin
// 或
// module.exports = ExampleService