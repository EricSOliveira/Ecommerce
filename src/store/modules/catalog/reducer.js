import produce from 'immer';

export default function catalog(state = [], action) {

  switch(action.type) {
    case 'ADD_ITEM':
      //return [...state, { ...action.product, amount: 1 }];
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.product.id);
        if (productIndex >= 0) {
          draft[productIndex].amount = action.product.amount;
          draft[productIndex].countPerItem = action.product.countPerItem;
        } else {
          draft.push({ ...action.product, amount: 1 });
        }
      });

    case 'REMOVE_ITEM':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.product.id);
        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });

      case 'CLEAR_CART':
        return [];

    default:
      return state;
  }
}