export const initialState = {
  basket: localStorage.getItem("basket")
    ? JSON.parse(localStorage.getItem("basket"))
    : [],
  user: null,
  basketQty: localStorage.getItem("basketQty")
    ? JSON.parse(localStorage.getItem("basketQty"))
    : [],
};

// Selector
export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      const updatedBasket = [...state.basket, action.item];
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

      //console.log(`Add to basket qty-> ${JSON.stringify(updatedBasketQtyAdd)}`);

      localStorage.setItem("basketQty", JSON.stringify(updatedBasketQtyAdd));
      localStorage.setItem("basket", JSON.stringify(updatedBasket));

      return {
        ...state,
        basket: updatedBasket,
        basketQty: updatedBasketQtyAdd,
      };

    case "EMPTY_BASKET":
      localStorage.removeItem("basket");
      localStorage.removeItem("basketQty");
      return {
        ...state,
        basket: [],
        basketQty: [],
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
        localStorage.setItem("basket", JSON.stringify(newBasket));
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as it's not in the basket!`
        );
      }

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
        basket: newBasket,
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
