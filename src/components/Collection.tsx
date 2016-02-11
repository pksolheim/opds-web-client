import * as React from "react";
import Book from "./Book";
import CollectionLink from "./CollectionLink";
import Lane from "./Lane";
import FacetGroup from "./FacetGroup";
import Search from "./Search";

export default class Collection extends React.Component<CollectionProps, any> {
  render(): JSX.Element {
    let padding = 10;
    let headerHeight = 50;
    let leftPanelWidth = 190;

    let collectionTopStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0"
    };

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      paddingTop: `${headerHeight + padding}px`,
      height: "100%",
      marginTop: `${padding + 5}px`
    };

    if (this.props.facetGroups && this.props.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      paddingTop: `${headerHeight + padding}px`,
      width: `${leftPanelWidth}px`,
      position: "fixed",
      left: "0"
    };

    let linkStyle = {
      textAlign: "center",
      backgroundColor: "#ddd",
      margin: "25px",
      padding: "10px",
      overflow: "hidden",
      fontSize: "500%",
      display: "block"
    };

    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="collectionTop" style={collectionTopStyle}>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
          { this.props.search &&
            <Search
              {...this.props.search}
              fetchSearchDescription={this.props.fetchSearchDescription}
              fetchCollection={this.props.fetchCollection} />
          }
        </div>

        {this.props.facetGroups && this.props.facetGroups.length && (
          <div className="facetGroups" style={leftPanelStyle}>
            { this.props.facetGroups.map(facetGroup =>
                <FacetGroup key={facetGroup.label} {...facetGroup} fetchCollection={this.props.fetchCollection} />
            )}
          </div>
        )}

        <div className="collectionBody" style={collectionBodyStyle}>

          { this.props.lanes && this.props.lanes.map(lane =>
              <Lane
                key={lane.title}
                {...lane}
                fetchCollection={this.props.fetchCollection}
                collectionUrl={this.props.url}
                showBookDetails={this.props.showBookDetails} />
          ) }

          { this.props.books && this.props.books.map(book =>
              <Book
                key={book.id}
                {...book}
                collectionUrl={this.props.url}
                showBookDetails={this.props.showBookDetails} />
          ) }

          { this.props.links &&
            <ul style={{ padding: 0, listStyleType: "none" }}>
            { this.props.links.map(link =>
              <li key={link.id}>
                <CollectionLink
                  text={link.text}
                  url={link.url}
                  fetchCollection={this.props.fetchCollection}
                  style={linkStyle} />
              </li>) }
            </ul>
          }
        </div>
      </div>
    );
  }
}