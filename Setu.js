/// <reference path="extension.d.ts"/>
const request = require('request');
const { segment } = require("oicq")

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
            request.get(`${SetuUrl}tag=${encodeURI(type)}&num=${count > 0 && count < 21 ? count: 1}`, (err, res, body) => {
                if (err) {
                    asyncTask(bot.send(`请求失败\n${err}`))
                    return resolve()
                }
    
                let data = null
                try {
                    data = JSON.parse(body)
                } catch (err) {
                    asyncTask(bot.send(`数据解析失败\n${err}`))
                    return resolve()
                }
    
                if (data.error) {
                    asyncTask(bot.send(`获取失败\n${data.error}`))
                    return resolve()
                }
    
                let msg = []
                data.data.forEach(setu => {
                    const {pid, title, author, urls} = setu
                    msg.push(`${title} - ${author}`)
                    msg.push(segment.image(urls.thumb))
                })
    
                asyncTask(bot.send(msg))
                resolve()
            })
        })
    }

    exit() {}
}


module.exports = Setu