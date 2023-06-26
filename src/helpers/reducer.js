
export const initialState = {
  user: null,
  basketQty: localStorage.getItem("basketQty")
    ? JSON.parse(localStorage.getItem("basketQty"))
    : [],
};

/** This code exports a function named getBasketTotal which takes 
 * an array of objects called basketQty as an argument. The function 
 * calculates the total price of all the items in the basket and 
 * returns it. It uses the reduce method to loop through all the 
 * items in the basket and accumulates the total price of each item 
 * based on its price and quantity.*/
export const getBasketTotal = (basketQty) =>
  basketQty?.reduce(
    (amount, { item, quantity }) => item.price * quantity + amount,
    0
  );

/** This code exports a function named getBasketQuantity which
 * takes an array of objects called basketQty as an argument.
 * The function calculates the total quantity of all the items
 * in the basket and returns it. It uses the reduce method to
 * loop through all the items in the basket and accumulates the
 * total quantity of each item based on its quantity.*/
export const getBasketQuantity = (basketQty) =>
  basketQty?.reduce(
    (totalQuantity, { quantity }) => totalQuantity + quantity,
    0
  );

/** This code exports a function named reducer which takes
 * an array of objects called basketQty as an argument.
 * The function uses the getBasketTotal and getBasketQuantity
 * functions to calculate the total price and total quantity
 * of all the items in the basket.*/
/**
 * A reducer function that updates the state based on the given action.
 *
 * @param {object} state - the current state object
 * @param {object} action - an object that contains a type and an item/id
 * @return {object} a new state object with updated basketQty or user properties
 */
  const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      let updatedBasketQtyAdd = [...state.basketQty];
      const existingItemIndex = state.basketQty.findIndex(
        (item) => item.id === action.item.id
      );
      if (existingItemIndex !== -1) {
        const existingItem = state.basketQty[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };

        updatedBasketQtyAdd = [
          ...state.basketQty.slice(0, existingItemIndex),
          updatedItem,
          ...state.basketQty.slice(existingItemIndex + 1),
        ];
      } else {
        updatedBasketQtyAdd = [
          ...state.basketQty,
          { id: action.item.id, quantity: 1, item: action.item },
        ];
      }
      localStorage.setItem("basketQty", JSON.stringify(updatedBasketQtyAdd));
      return {
        ...state,
        basketQty: updatedBasketQtyAdd,
      };
    case "EMPTY_BASKET":
      localStorage.removeItem("basketQty");
      return {
        ...state,
        basketQty: [],
      };
    case "REMOVE_FROM_BASKET":
      let updatedBasketQtyRem = [...state.basketQty];
      const existingRemItemIndex = state.basketQty.findIndex(
        (item) => item.id === action.id
      );

      if (existingRemItemIndex !== -1) {
        const existingItem = state.basketQty[existingRemItemIndex];
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        };

        if (updatedItem.quantity < 1) {
          updatedBasketQtyRem = updatedBasketQtyRem.filter(
            (item) => item.id !== action.id
          );
        } else {
          updatedBasketQtyRem = [
            ...state.basketQty.slice(0, existingRemItemIndex),
            updatedItem,
            ...state.basketQty.slice(existingRemItemIndex + 1),
          ];
        }
      }
      localStorage.setItem("basketQty", JSON.stringify(updatedBasketQtyRem));
      return {
        ...state,
        basketQty: updatedBasketQtyRem,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
