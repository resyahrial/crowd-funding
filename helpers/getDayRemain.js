module.exports = (date) => {
  const remainDay = new Date() - date
  return new Date(remainDay).getDate()
}