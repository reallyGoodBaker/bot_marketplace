class SayTime extends Plugin {

  static [interfaces.pluginHelp] = {
    0: "时间 [格式]\n示例：时间 yyyy-MM-dd"
  }

  constructor() {
    super();
  }


  /**
   * @param {InitBundle} bundle 
   */
  init(bundle) {
    let { bot, args, asyncTask } = bundle;
    let msg = args.join(' ');
    const d = new Date();
    const yyyy = d.getFullYear();
    const MM = d.getMonth() + 1;
    const dd = d.getDate();
    const HH = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();
    const format = num => num < 10 ? '0' + num : num;
    msg = msg.toString()
      .replace(/yyyy/, yyyy)
      .replace(/MM/, format(MM))
      .replace(/dd/, format(dd))
      .replace(/HH/, format(HH))
      .replace(/mm/, format(mm))
      .replace(/ss/, format(ss));
    asyncTask(bot.send(msg));
  }
}

module.exports = SayTime;