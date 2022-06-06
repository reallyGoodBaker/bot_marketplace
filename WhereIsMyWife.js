const request = require('request');

class WhereIsMyWife extends Plugin{

  static [interfaces.noNeedArgs] = true;

  constructor(){
    super();
  }

  /**
   * 
   * @param {InitBundle} bundle 
   */
  init(bundle) {
    const { asyncTask, bot } = bundle;
    asyncTask(resolve => request.get('https://api.vvhan.com/api/acgimg?type=json', (err, res, body) => {
      body = JSON.parse(body);
      const url = encodeURI(body.imgurl);
      resolve(bot.send(`[CQ:image,file=${url}]`));
    }));
  }
}

module.exports = WhereIsMyWife;