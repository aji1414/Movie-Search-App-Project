const inly = require('inly')

/**
 * @typedef ExtractOption
 * @prop {string} inputFile - input compressed file path.
 * @prop {string} [outputPath=process.cwd()] - output folder path.
 * @prop {console.Console} [logger=console] - logger instance.
 */

/**
 * Extract .zip, .gz, .bz2, .tar, tar.gz, tar.bz2, .tgz, .tbz2 archives.
 *
 * @param {string|ExtractOption} options - input compressed file path or ExtractOption object.
 * @async
 * @return {PromiseLive<string>} - inputFile
 */
const extract = async options =>
  new Promise((resolve, reject) => {
    const { inputFile = options, outputPath = process.cwd(), logger = null } = options
    const handle = inly(inputFile, outputPath)

    handle.on('file', name => {
      if (logger) logger.log(name)
    })
    handle.on('error', error => {
      reject(error)
    })
    handle.on('end', () => {
      resolve(inputFile)
    })
  })

module.exports = extract
