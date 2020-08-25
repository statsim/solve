const solver = require('javascript-lp-solver')
let ac = 1
let vc = 1
const params = {
  data: () => ({
    model: {
      attributes: [],
      variables: []
    },
    opTarget: '',
    opType: 'max',
    res: {}
  }),
  methods: {
    addAttrubute () {
      this.model.attributes.push({
        name: 'A' + ac,
        id: 'a' + ac
      })
      ac += 1
    },
    addVariable () {
      this.model.variables.push({
        name: 'V' + vc,
        id: 'v' + vc,
        values: {}
      })
      vc += 1
    },
    solve () {
      const constrains = {}
      const variables = {}
      this.model.attributes
        .filter(a => (a.min && a.min.lenght) || (a.max && a.max.length))
        .forEach(a => {
          constrains[a.id] = {}
          if (a.min && a.min.length) constrains[a.id].min = parseFloat(a.min)
          if (a.max && a.max.length) constrains[a.id].max = parseFloat(a.max)
        })
      this.model.variables
        .forEach(v => {
          variables[v.id] = {}
          this.model.attributes.forEach(a => {
            variables[v.id][a.id] = parseFloat(v.values[a.id])
          })
        })
      const model = {
        optimize: this.opTarget,
        opType: this.opType,
        constraints: constrains,
        variables: variables
        // 'ints': {'table': 1, 'dresser': 1}
      }
      console.log('Model:', this.model, model)
      this.res = solver.Solve(model)
    }
  }
}

module.exports = params
