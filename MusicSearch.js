const request = require('request');

class MusicSearch extends Plugin {

  storage = {}

  static [interfaces.pluginHelp] = {
    0: '搜歌 <搜索的内容> [页数]\n\n可用帮助项：选择歌曲，超时，歌名空格 ',
    '选择歌曲': '搜索结果出来以后，回复歌曲前的数字即可选择歌曲',
    '超时': '为了性能以及用户体验，机器人有10s的超时时间，超过该时间范围将无法选择',
    '歌名空格': '由于一些技术问题被解决，您现在可以在歌名中使用空格',
  }

  constructor() {
    super();
  }


  /**
   * @param {InitBundle} bundle 
   */
  init(bundle) {
    const { data, bot, args } = bundle;
    let hasInputedOffset = false;
    let offset = 0;
    if (typeof args[args.length - 1] === 'number') {
      offset = args[args.length - 1];
      hasInputedOffset = true;
    }
    const msg = hasInputedOffset ? (args.splice(0, args.length - 1)).join(' ') : args.join(' ');
    this.who = data.user_id;
    this.storage.type = bot.type;
    this.storage.id = bot.id;
    bundle.asyncTask(resolve => {
      request('https://bot-neteaseapi.rgb39.top/search?keywords=' + encodeURI(msg) + '&limit=8' + '&offset=' + offset * 8, (err, res, body) => {
        try {
          body = JSON.parse(body);
        } catch (error) {
          bot.send(error);
        }
        if (body.result && body.result.songs) {
          let _data = body.result.songs;
          let _res = "搜索到以下结果: ";
          let _cache = [];
          for (let i = 0; i < _data.length; i++) {
            const _each = _data[i];
            const name = _each.name;
            let artists = [];
            for (let i = 0; i < _each.artists.length; i++) {
              const element = _each.artists[i];
              artists.push(element.name);
            }
            artists = artists.join('/');
            const id = _each.id;
            _cache.push({ name, artists, id });
            this.songid = _cache;
            _res += `\n${i}>  ${name} -- ${artists}`;
          }
          this.id = data.group_id;
          bot.send(_res);
          bundle.suspend('receive');
        }
        resolve('done');
      });
    });
  }


  /**
   * 
   * @param {ResumeBundle} bundle 
   */
  resume(bundle) {
    const { group_id, user_id, raw_message } = bundle.data.change.rawData;
    const val = { id: group_id || user_id, who: user_id, msg: raw_message }
    if (val.id === this.storage.id && val.who === this.who) {
      let _bot = bundle.data.change.msgBot;
      const i = val.msg - 0;
      if (i > -1 && i < this.songid.length) {
        const { id } = this.songid[i];
        this.end = _bot.send(`[CQ:music,type=163,id=${id}]`);
      } else {
        this.end = _bot.send('无效参数，取消搜索');
      }
      bundle.asyncTask(this.end);
    } else {
      bundle.suspend('receive');
    }
  }
}

module.exports = MusicSearch;