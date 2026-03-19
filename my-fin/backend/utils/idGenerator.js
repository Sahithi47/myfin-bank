const generateId = async (Model, field, prefix, padLength = 4) => {
  let isUnique = false;
  let newId;
  let counter = await Model.countDocuments();

  while (!isUnique) {
    counter++;
    const number = String(counter).padStart(padLength, '0');
    newId = `${prefix}-${number}`;
    const existing = await Model.findOne({ [field]: newId });
    if (!existing) isUnique = true;
  }

  return newId;
};

module.exports = generateId;