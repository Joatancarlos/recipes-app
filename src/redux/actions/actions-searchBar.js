import ACTIONS_TYPE_SEARCH_BAR from '../actions-type/actions-type-searchBar';

export const saveSearch = (payload) => ({
  type: ACTIONS_TYPE_SEARCH_BAR.SEARCH,
  payload,
});

export const saveHidden = (payload) => ({
  type: ACTIONS_TYPE_SEARCH_BAR.ISHIDDEN,
  payload,
});
