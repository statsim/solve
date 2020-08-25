const solver = require('javascript-lp-solver')
const examples = {
  berlin: {
    model: {
      attributes: [
        { id: 'a1', name: 'Capacity' },
        { id: 'a2', name: 'Cost', max: '300000' },
        { id: 'a3', name: 'Plane', max: '44' },
        { id: 'a4', name: 'Person', max: '512' }
      ],
      variables: [
        {
          id: 'x1',
          name: 'Brit',
          values: {
            a1: '20000',
            a2: '5000',
            a3: '1',
            a4: '8'
          }
        },
        {
          id: 'x2',
          name: 'Yank',
          values: {
            a1: '30000',
            a2: '9000',
            a3: '1',
            a4: '16'
          }
        }
      ]
    },
    opTarget: 'a1',
    opType: 'max',
    description: 'On June 24, 1948, the former Soviet Union blocked all land and water routes through East Germany to Berlin. A gigantic airlift was organized using American and British planes to supply food, clothing and other supplies to more than 2 million people in West Berlin. The cargo capacity was 30,000 cubic feet for an American plane and 20,000 cubic feet for a British plane. To break the Soviet blockade, the Western Allies had to maximize cargo capacity, but were subject to the following restrictions: No more than 44 planes could be used. The larger American planes required 16 personnel per flight; double that of the requirement for the British planes. The total number of personnel available could not exceed 512. The cost of an American flight was $9000 and the cost of a British flight was $5000. The total weekly costs could note exceed $300,000. Find the number of American and British planes that were used to maximize cargo capacity*'
  }
}

let ac = 1
let vc = 1

const params = {
  data: () => ({
    description: '',
    model: {
      attributes: [],
      variables: []
    },
    lpmodel: {},
    opTarget: '',
    opType: 'max',
    res: ''
  }),
  methods: {
    addAttrubute () {
      this.model.attributes.push({
        name: 'A' + ac,
        id: 'a' + ac
      })
      ac += 1
    },
    removeAttribute (i) {
      this.model.attributes.splice(i, 1)
    },
    addVariable () {
      this.model.variables.push({
        name: 'X' + vc,
        id: 'x' + vc,
        values: {},
        int: false
      })
      vc += 1
    },
    removeVariable (i) {
      this.model.variables.splice(i, 1)
    },
    solve () {
      const constraints = {}
      const variables = {}
      const ints = {}
      this.model.attributes
        .filter(a => (a.min && a.min.lenght) || (a.max && a.max.length))
        .forEach(a => {
          constraints[a.id] = {}
          if (a.min && a.min.length) constraints[a.id].min = parseFloat(a.min)
          if (a.max && a.max.length) constraints[a.id].max = parseFloat(a.max)
        })
      this.model.variables
        .forEach(v => {
          variables[v.id] = {}
          // Make variable-level constrains
          if ((v.min && v.min.lenght) || (v.max && v.max.length)) {
            constraints[v.id] = {}
            if (v.min && v.min.length) constraints[v.id].min = parseFloat(v.min)
            if (v.max && v.max.length) constraints[v.id].max = parseFloat(v.max)
            variables[v.id][v.id] = 1
          }
          // Fill ints
          if (v.int) {
            ints[v.id] = 1
          }
          // Fill attributes
          this.model.attributes.forEach(a => {
            variables[v.id][a.id] = parseFloat(v.values[a.id])
          })
        })
      console.log(this.model, constraints, variables)
      this.lpmodel = {
        optimize: this.opTarget,
        opType: this.opType,
        constraints,
        variables,
        ints
      }
      this.res = ''
      const solution = solver.Solve(this.lpmodel)
      this.model.variables.forEach(v => {
        this.res += v.name + ': ' + solution[v.id] + '\n'
      })
      this.res += 'Result: ' + solution.result + '\n'
    },
    example (str) {
      const e = examples[str]
      this.model = Object.assign({}, e.model)
      this.opTarget = e.opTarget
      this.opType = e.opType
      this.description = e.description
    }
  }
}

module.exports = params
