/// <reference path="extension.d.ts"/>
const request = require('request');

const SetuUrl = 'https://api.lolicon.app/setu/v2?r18=1&'

class Setu extends Plugin {

    static [interfaces.pluginHelp] = {
        0: '涩图来 [类型] [数量]',
        '类型': '输入类型数组，使用 | 分割，如：\n萝莉|白丝',
        '数量': '1-20 的整数，在此区域外使用默认值 1'
    }
    static [interfaces.noNeedArgs] = false

    /**
     * @param {InitBundle} bundle
     */
    init(bundle) {
        const {bot, asyncTask, args} = bundle
        const [type, count] = args

        asyncTask(resolve => {
            console.log(`${SetuUrl}tag=${type}&num=${count > 0 && count < 21 ? count: 1}`);
            request.get(`${SetuUrl}tag=${type}&num=${count > 0 && count < 21 ? count: 1}`, (err, res, body) => {
                if (err) {
                    asyncTask(bot.send('请求失败'))
                    return resolve()
                }
    
                let data = null
                try {
                    data = JSON.parse(body)
                } catch (err) {
                    asyncTask(bot.send('数据解析失败'))
                    return resolve()
                }
    
                if (data.error) {
                    asyncTask(bot.send('获取失败'))
                    return resolve()
                }
    
                let msg = ''
                data.data.forEach(setu => {
                    const {pid, title, author} = setu
                    msg += `${title} - ${author}`
                })
    
                asyncTask(bot.send(msg))
                resolve()
            })
        })
    }

    exit() {}
}


module.exports = Setu