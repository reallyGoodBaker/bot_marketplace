/// <reference path="extension.d.ts"/>
const request = require('request');
const { segment } = require("oicq")

const SetuUrl = 'https://api.lolicon.app/setu/v2?r18=1&size=original&size=thumb&'


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
        const { bot, asyncTask, args } = bundle
        let count = args[args.length - 1]

        if (args.length === 1 && !isNaN(+count)) {
            return asyncTask(bot.send(`无效的参数`))
        }

        if (isNaN(+count)) {
            count = 1
        } else {
            args.pop()
        }

        const type = args.map(v => `tag=${encodeURI(v)}`).join('&')

        asyncTask(resolve => {
            request.get(`${SetuUrl}${type}&num=${count > 0 && count < 21 ? count : 1}`, (err, res, body) => {
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
                    const { pid, title, author, urls } = setu
                    msg.push(`[${pid}] ${title} - ${author}\n${urls.original}`)
                    if (!count || count === 1) {
                        let sender = null
                        asyncTask(sender = bot.send(segment.image(urls.thumb)))

                        sender.then(v => {
                            setTimeout(() => {
                                bot.recall(v?.data?.message_id)
                            }, 5000)
                        })
                    }
                })

                asyncTask(bot.send(msg.join('\n')))
                resolve()
            })
        })
    }

    exit() { }
}


module.exports = Setu