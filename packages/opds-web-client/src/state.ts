import buildStore from "./store";
import { createFetchCollectionAndBook } from "./components/mergeRootProps";
import { CollectionState } from "./reducers/collection";
import { BookState } from "./reducers/book";

export interface State {
  collection: CollectionState;
  book: BookState;
}

export default function buildInitialState(collectionUrl: string, bookUrl: string): Promise<State> {
  const store = buildStore();
  const fetchCollectionAndBook = createFetchCollectionAndBook(store.dispatch);
  return new Promise((resolve, reject) => {
    fetchCollectionAndBook(collectionUrl, bookUrl).then(({ collectionData, bookData }) => {
      resolve(store.getState());
    }).catch(err => reject(err));
  });
}