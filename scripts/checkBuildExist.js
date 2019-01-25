const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

function CheckBuildsExist() {
  const build = path.join(__dirname, '..', 'build', 'index.html')

  if (!fs.existsSync(build)) {
    throw new Error(
      chalk.whiteBright.bgRed.bold(
        'The renderer process is not built yet. Build it by running "npm run build" or "yarn build"'
      )
    )
  }
}

CheckBuildsExist()
