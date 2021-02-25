module.exports = (arr) => {
  return arr.reduce((acc, el) => {
    return acc + el.amount
  }, 0)
}