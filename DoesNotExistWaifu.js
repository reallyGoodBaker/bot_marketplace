class DoesNotExistWaifu extends Plugin {

  static [interfaces.noNeedArgs] = true;

  constructor() {
    super();
  }

  /**
   * @param {InitBundle} bundle 
   */
  init(bundle){
    const {asyncTask, bot} = bundle;
    const totalImages = 100000;
    const id = Math.floor(Math.random() * totalImages);
    const url = 'https://www.thiswaifudoesnotexist.net/example-' + id + '.jpg';
    asyncTask(bot.send(`[CQ:image,file=${url}]`));
  }
}

module.exports = DoesNotExistWaifu;