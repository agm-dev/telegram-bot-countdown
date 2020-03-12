exports.catchErrors = fn => (...params) => {
  try {
    fn(...params)
  } catch(err) {
    log.error('ERROR: ', err)
  }
}

const getDateMark = () => `[${(new Date()).toISOString()}]`

exports.log = {
  info: (t, ...params) => console.log(`${getDateMark()}[INFO] ${t}`, ...params),
  error: (t, ...params) => console.error(`${getDateMark()}[ERROR] ${t}`, ...params)
}
