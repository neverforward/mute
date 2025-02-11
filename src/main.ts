import *as mc from '@minecraft/server'

let muteHelp =
  "\u00a7l\u00a72语法: \u00a7r\n" +
  " - \u00a7l#mute\u00a7r <target:player> <value:boolean>\u00a7r\n" +
  " - \u00a7l#mute\u00a7r list\u00a7r\n" +
  " - \u00a7l#mute\u00a7r help\u00a7r\n" +
  "\u00a7l\u00a72参数: \u00a7r\n" +
  " - target:player    玩家\u00a7r\n" +
  " - value:boolean    禁言(true)或解除禁言(false)\u00a7r\n" +
  "\u00a7l\u00a72示例: \u00a7r\n" +
  " - 给玩家player禁言\n" +
  "     #mute player true\n" +
  " - 给玩家player解除禁言\n" +
  "     #mute player false\n" +
  " - 查看帮助\n" +
  "     #mute help\n" +
  "\u00a7l\u00a72结果: \u00a7r\n" +
  " +------+----------------+--------------------+\n" +
  " | 命令  |     触发条件   | 结果                |\n" +
  " +------+----------------+--------------------+\n" +
  " | 任意  | 参数未正确指定 | 错误               |\n" +
  " |       | 执行成功时      | 对玩家执行对应操作|\n" +
  " +------+----------------+--------------------+\n" +
  "\n\u00a7l\u00a7e警告: 请不要对自己执行禁言, 否则无法解除禁言! \u00a7r\n";

function getplayer(name: string) {
  let players = mc.world.getAllPlayers()
  for (let i = 0; i < players.length; i++) {
    if (players[i].name == name) return players[i];
  }
  return null;
}

function mute(player: mc.Player, arg: string[]) {
  if (arg[1] == 'help') return player.sendMessage(muteHelp);
  if (arg[1] == 'list') {
    let players = mc.world.getAllPlayers();
    let mutes = []
    for (let i = 0; i < players.length; i++) {
      if (players[i].hasTag('mute')) mutes.push(players[i]);
    }
    if (mutes.length <= 0) return player.sendMessage(`\u00a77没有被禁言的玩家`)
    else return player.sendMessage(`\u00a77禁言的玩家有: \n` + `${mutes}`
    )
  }

  if (arg.length < 3) return player.sendMessage("\u00a7l\u00a7c语法错误: 缺少参数\u00a7r\n" + muteHelp);

  let p = getplayer(arg[1]);
  if (!p) return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效玩家 ${arg[1]} \u00a7r\n` + muteHelp);

  let mvalue = arg[2];
  let value = true;
  if (mvalue.toLowerCase() == 'true') value = true;
  else if (mvalue.toLowerCase() == 'false') value = false;
  else return player.sendMessage(`\u00a7l\u00a7c语法错误: 无效参数 ${arg[2]} \u00a7r\n` + muteHelp);

  if (value) p.addTag('mute');
  else try {
    p.removeTag('mute');
  }
  catch (e) {
    player.sendMessage(`\u00a7l\u00a7c运行错误: 玩家 ${p.name} 没被禁言\u00a7r\n`)
  }
  player.sendMessage(`\u00a77[${player.name}: 成功! 已将玩家 ${p.name} ${value ? "禁言" : "解除禁言"} ]`)
}

mc.world.afterEvents.chatSend.subscribe((e) => {
  let msg = e.message;
  let cmd = msg.trim().split(' ');

  if (cmd[0] == '#mute') {
    if(e.sender.isOp()) mute(e.sender, cmd);
    else e.sender.sendMessage(`\u00a7l\u00a7c你没有权限来执行命令!\u00a7r`)
  }
})

mc.world.beforeEvents.chatSend.subscribe((e) => {
  if (e.sender.hasTag('mute')) {
    e.cancel = true
    e.sender.sendMessage(`\u00a7c你已被禁言! `)
  };
})