//clear; node index.js $MC_HOST $MC_PORT $MC_USER $MC_PASS
//Paste this in terminal or Powersehll in the correct directory
const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const autoeat = require("mineflayer-auto-eat")
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { Vec3 } = require('vec3')
const AABB = require('prismarine-physics/lib/aabb')

const inFight = new Boolean;

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4] ? process.argv[4] : 'Doly',
    password: process.argv[5],
    logErrors: false,
    plugins: [pathfinder.pathfinder]
})

bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)
bot.loadPlugin(autoeat)


/*bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: false })
})
*/

const MAX_DIST_FROM_BLOCK_TO_PLACE = 4

let mcData = null
bot.once('spawn', () => {
  mcData = require('minecraft-data')(bot.version)
})


bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
    if (sword) bot.equip(sword, 'hand')
  }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
  }, 250)
})


bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return


  setTimeout(() => {
    const totem = bot.inventory.items().find(item => item.name.includes('totem_of_undying'))
    if (totem) bot.equip(totem, 'off-hand')
  }, 250)
})


let guardPos = null

function guardArea (pos) {
  guardPos = pos.clone()

  if (!bot.pvp.target) {
    moveToGuardPos()
  }
}

function stopGuarding () {
  guardPos = null
  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}


function moveToGuardPos () {
  const mcData = require('minecraft-data')(bot.version)
  bot.pathfinder.setMovements(new Movements(bot, mcData))
  bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

bot.on('stoppedAttacking', () => {
  if (guardPos) {
    moveToGuardPos()
  }
})

bot.on('physicTick', () => {
  if (bot.pvp.target) return
  if (bot.pathfinder.isMoving()) return

  const entity = bot.nearestEntity()
  if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})

bot.on('physicTick', () => {
  if (!guardPos) return

  const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
                      e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

  const entity = bot.nearestEntity(filter)
  if (entity) {
    bot.pvp.attack(entity)
  }
})

bot.on('chat', (username, message) => {
  if (message === 'guard') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('I will guard that location.')
    guardArea(player.entity.position)
  }

  if (message === 'fight me') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('Prepare to fight ' + [username] + '!')
    bot.pvp.attack(player.entity)
  }

  if (message === 'tp to me') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("I teleport to you.")
      return
    }

    bot.chat('Teleporting to ' + [username] + '!')
    bot.chat('/tp @s ' + [username])
  }

  if (message === 'honey clicker') {
    const player = bot.players[username]

    const mcData = require('minecraft-data')(bot.version)
    bot.pathfinder.setMovements(new Movements(bot, mcData))
    bot.pathfinder.setGoal(new goals.GoalBlock(1, 35, 1))
  }



  if (message === 'Doly fight: help') {
    const player = bot.players[username]

    bot.chat('Fight Command')
    bot.chat('Type: "Doly Fight: <Kit> <Strength Scale in Players>"')
  }


  if (message === 'Doly fight: potion 1' || message === 'Doly fight: potions 1') {
    const player = bot.players[username]


    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('HiA<kc8g&gL')
    bot.pvp.attack(player.entity)
  }


  if (message === 'Doly fight: shield 1') {
    const player = bot.players[username]


    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('wefi$%&smv')
    bot.pvp.attack(player.entity)
  }


  if (message === 'Doly fight: shield 2') {
    const player = bot.players[username]


    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('wei&sdav.90de')
    bot.pvp.attack(player.entity)
  }



  if (message === 'Doly fight: potion 2' || message === 'Doly fight: potions 2') {
    const player = bot.players[username]


    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('5jf92fKJl')
    bot.pvp.attack(player.entity)
  }


  if (message === 'stop') {
    bot.chat('I will no longer guard this area.')
    stopGuarding()
  }
})





bot.once("spawn", () => {
  bot.autoEat.options.priority = "healthPoints"
  bot.autoEat.options.bannedFood = []
  bot.autoEat.options.eatingTimeout = 3
  bot.chat('/clear')
  bot.chat('/give @s dirt 5')
  bot.chat('honey clicker')
  //bot.chat('guard')
})

// The bot eats food automatically and emits these events when it starts eating and stops eating.

bot.on("autoeat_started", () => {
  console.log("Auto Eat started!")
})

bot.on("autoeat_stopped", () => {
  console.log("Auto Eat stopped!")
})

bot.on("health", () => {
  if (bot.food === 20) bot.autoEat.disable()
  // Disable the plugin if the bot is at 20 food points
  else bot.autoEat.enable() // Else enable the plugin again
})

