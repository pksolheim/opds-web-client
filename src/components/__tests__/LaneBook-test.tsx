jest.dontMock("../Book");  // because LaneBook inherits Book
jest.dontMock("../LaneBook");
jest.dontMock("../Link");
jest.dontMock("../BookPreviewLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import LaneBook from "../LaneBook";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  publisher: "Penguin Publishing Group"
};

describe("LaneBook", () => {
  it("shows the book cover with alt", () => {
    let renderedBook = TestUtils.renderIntoDocument(
      <LaneBook book={book} />
    );

    let coverImage = TestUtils.findRenderedDOMComponentWithTag(renderedBook, "img");
    expect(coverImage.getAttribute("src")).toBe(book.imageUrl);
    expect(coverImage.getAttribute("alt")).toBe(book.title + " cover");
  });

  it("shows book title", () => {
    let renderedBook = TestUtils.renderIntoDocument(
      <LaneBook book={book} />
    );

    let title = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookTitle");
    expect(title.textContent).toBe(book.title);
  });
});