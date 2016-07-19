import * as React from "react";

export const mockRouter = (push) => {
  return {
    push,
    createHref: (location) => "test href",
    isActive: (location, onlyActiveOnIndex) => true
  };
};

export const mockRouterContext = (push?, pathFor?) => {
  return {
    router: mockRouter(push || jest.genMockFunction()),
    pathFor: pathFor || ((collectionUrl, bookUrl) => collectionUrl + "::" + bookUrl)
  };
};