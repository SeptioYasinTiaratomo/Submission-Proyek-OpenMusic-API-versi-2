const { nanoid } = require('nanoid');

function generateId(prefix = '') {
  return `${prefix}${nanoid(16)}`;
}

module.exports = generateId;
