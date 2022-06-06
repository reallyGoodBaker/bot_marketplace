class Remind extends Plugin {

      constructor(){
            super();
      }

      init(bundle){
            let {args, asyncTask, bot, data} = bundle;
            if (args.length < 3) return ;
            let timeTag = args.shift();
            let comm = args.shift();
            let msg = args.join(' ');
            this[comm] && this[comm](timeTag, msg, asyncTask, bot, data);
            console.log(comm);
      }

      ['后'](timeTag, msg, asyncTask, bot, data){
            timeTag += ':00';
            Schedule.after(timeTag, () => bot.send(`[CQ:at,qq=${data.user_id}] `+msg)).start();
            asyncTask(bot.send('成功加入提醒'));
      }

      ['时'](timeTag, msg, asyncTask, bot, data){
            let [raw, h, m, s] = /(.*?):(.*?):(.*?)/.exec(timeTag);
            let date = new Date();
            h = parseInt(h) || 0, m = parseInt(m) || 0, s = parseInt(s) || 0;
            date.setHours(h);
            date.setMinutes(m);
            date.setSeconds(s);
            if ( date.getTime() - new Date().getTime() < 0) return ;
            Schedule.time(date, () => bot.send(`[CQ:at,qq=${data.user_id}] `+msg)).start();
            asyncTask(bot.send('成功加入提醒'));
      }
}


module.exports = Remind;