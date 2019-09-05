
const isNullish = (o) => o === null || o === undefined;

const hasOwn = (o, p) => ({}.hasOwnProperty.call(o, p));

exports.isNullish = isNullish;
exports.hasOwn = hasOwn;
