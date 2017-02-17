import { createSelector } from 'reselect'

/**
 * reselectors are caches for computation optimization, and can be nested so in this example the total is only calculated once
 *
 * the first parameters for createSelector are selectors and the last parameter argument is the transformer - which takes each selector as a parameter
 *
 */
export const mySelector = createSelector((state) => state.login.id, (result) => result * 2)

const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = createSelector(
    shopItemsSelector,
    items => items.reduce((acc, item) => acc + item.value, 0)
)

const taxSelector = createSelector(
    subtotalSelector,
    taxPercentSelector,
    (subtotal, taxPercent) => subtotal * (taxPercent / 100)
)

export const totalSelector = createSelector(
    subtotalSelector,
    taxSelector,
    (subtotal, tax) => ({ total: subtotal + tax })
)

let exampleState = {
    shop: {
        taxPercent: 8,
        items: [
            { name: 'apple', value: 1.20 },
            { name: 'orange', value: 0.95 },
        ]
    }
}

console.log(subtotalSelector(exampleState)) // 2.15
console.log(taxSelector(exampleState))      // 0.172
console.log(totalSelector(exampleState))    // { total: 2.322 }