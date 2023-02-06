class Hero {
  constructor({ name, age, power }) {
    this.id = Math.floor(Math.random() * 100) + Date.now();
    this.name = name;
    this.age = age;
    this.power = power;
  }

  isValid() {
    const propertyNames = Object.getOwnPropertyNames(this);
    const amountInvalid = propertyNames
      .map(property => {
        return !!this[property] ? null : `'${property}' is missing`;
      })
      .filter(property => {
        return !!property;
      });

    const hasSize = !!(amountInvalid.length === 0)
    return {
      valid: hasSize,
      error: hasSize ? null : amountInvalid,
    };
  }
}

module.exports = Hero;