const storage = require('./storage')

storage.put('gosho', 'na gosho mu e mn losho')
storage.put('pesho', 'lel gosho lele')
console.log(storage.get('pesho'))
storage.update('pesho', 'stamat goshov')
console.log(storage.get('pesho'))
storage.delete('pesho')
storage.load()

// Works as expected.
