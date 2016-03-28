import * as React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps, mergeRootProps } from "./mergeRootProps";
import Modal from "./Modal";
import BookDetails from "./BookDetails";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Search from "./Search";
import Breadcrumbs from "./Breadcrumbs";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import SkipNavigationLink from "./SkipNavigationLink";
import CollectionLink from "./CollectionLink";

export class Root extends React.Component<RootProps, any> {
  bookDetailsContainer: any;
  header: any;

  render(): JSX.Element {
    let BookDetailsContainer = this.props.BookDetailsContainer;
    let Header = this.props.header;

    let headerTitle = this.props.headerTitle || (this.props.collectionData ? this.props.collectionData.title : null);

    let showCollection = this.props.collectionData;
    let showBook = this.props.bookData;
    let showBookWrapper = this.props.bookUrl || this.props.bookData;
    let showUrlForm = !this.props.collectionData && !this.props.bookData && !this.props.isFetching;
    let showBreadcrumbs = showCollection && (this.props.bookData || this.props.history && this.props.history.length > 0);

    let padding = 10;
    let headerHeight = 50;
    let navHeight = showBreadcrumbs ? 40 : 0;
    let marginTop = headerHeight + navHeight;

    let headerStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "left",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0",
      boxSizing: "border-box"
    };

    let breadcrumbsStyle = {
      position: "fixed",
      top: `${headerHeight}px`,
      width: "100%"
    };

    let bodyStyle = {
      paddingTop: `${marginTop + padding}px`,
    };

    let bookWrapperStyle = {
      position: "fixed",
      width: "100%",
      top: `${marginTop}`,
      height: `calc(100% - ${marginTop}px)`,
      backgroundColor: "white",
      zIndex: 100,
      overflowY: "scroll"
    };

    let setTopLevelCollectionAndBook = (collection, book, skipOnNavigate): Promise<any> => {
      return this.props.setCollectionAndBook(collection, book, skipOnNavigate, true);
    };

    let renderCollectionLink = (text: string, url: string) => (
      <CollectionLink
        text={text}
        url={url}
        setCollectionAndBook={setTopLevelCollectionAndBook}
        pathFor={this.props.pathFor}
        />
    );

    return (
      <div className="browser" style={{ fontFamily: "Arial, sans-serif" }}>
        <SkipNavigationLink />

        { this.props.isFetching && <LoadingIndicator /> }
        { this.props.error &&
          <ErrorMessage
            message={"Could not fetch data: " + this.props.error.url}
            retry={() => this.props.setCollectionAndBook(this.props.collectionUrl, null)} />
        }

        { showUrlForm &&
          <UrlForm setCollectionAndBook={this.props.setCollectionAndBook} url={this.props.collectionUrl} />
        }

        { Header ?
          <Header
            ref={c => this.header = c}
            renderCollectionLink={renderCollectionLink.bind(this)}>
            { this.props.collectionData && this.props.collectionData.search &&
              <Search
                url={this.props.collectionData.search.url}
                searchData={this.props.collectionData.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                setCollectionAndBook={setTopLevelCollectionAndBook}/>
            }
          </Header> :
          <nav className="header navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <span className="navbar-brand" style={{ fontSize: "1.8em", color: "black" }}>
                OPDS Browser
              </span>
              { this.props.collectionData && this.props.collectionData.search &&
                <Search
                  className="navbar-form navbar-right"
                  url={this.props.collectionData.search.url}
                  searchData={this.props.collectionData.search.searchData}
                  fetchSearchDescription={this.props.fetchSearchDescription}
                  setCollectionAndBook={setTopLevelCollectionAndBook}/>
              }
            </div>
          </nav>
        }

        { showBreadcrumbs &&
          <div className="breadcrumbsWrapper" style={breadcrumbsStyle}>
            <Breadcrumbs
              history={this.props.history}
              collection={this.props.collectionData}
              pathFor={this.props.pathFor}
              setCollectionAndBook={this.props.setCollectionAndBook}
              showCurrentLink={!!this.props.bookData} />
          </div>
        }

        <div className="body" style={bodyStyle}>
          { showBookWrapper &&
            <div className="bookDetailsWrapper" style={bookWrapperStyle}>
              { showBook &&
                ( BookDetailsContainer ?
                  <BookDetailsContainer
                    ref={c => this.bookDetailsContainer = c}
                    book={this.props.bookData}
                    collection={this.props.collectionUrl}>
                    <BookDetails book={this.props.bookData} />
                  </BookDetailsContainer> :
                  <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
                    <BookDetails book={this.props.bookData} />
                  </div>
                )
              }
            </div>
          }

          { showCollection &&
            <Collection
              collection={this.props.collectionData}
              setCollectionAndBook={this.props.setCollectionAndBook}
              fetchPage={this.props.fetchPage}
              isFetching={this.props.isFetching}
              isFetchingPage={this.props.isFetchingPage}
              error={this.props.error}
              fetchSearchDescription={this.props.fetchSearchDescription}
              pathFor={this.props.pathFor}
              history={this.props.history} />
          }
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (this.props.collectionUrl || this.props.bookUrl) {
      this.updateCollectionAndBook(this.props.collectionUrl, this.props.bookUrl);
    }

    this.updatePageTitle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collectionUrl !== this.props.collectionUrl || nextProps.bookUrl !== this.props.bookUrl) {
      this.updateCollectionAndBook(nextProps.collectionUrl, nextProps.bookUrl);
    }

    this.updatePageTitle(nextProps);
  }

  updateCollectionAndBook(collectionUrl: string, book: string) {
    return new Promise((resolve, reject) => {
      // skip onNavigate for both fetches, but call it at the end
      // either collectionUrl or bookUrl can be null
      this.props.setCollection(collectionUrl, true).then(collectionData => {
        this.props.setBook(book, true).then(bookData => {
          resolve({ collectionData, bookData });
        }).catch(err => reject(err));
      }).catch(err => reject(err));

      if (this.props.onNavigate) {
        this.props.onNavigate(collectionUrl, book);
      }
    });
  }

  updatePageTitle(props) {
    if (props.pageTitleTemplate) {
      let collectionTitle = props.collectionData && props.collectionData.title;
      let bookTitle = props.bookData && props.bookData.title;
      document.title = props.pageTitleTemplate(collectionTitle, bookTitle);
    }
  }
}

let connectOptions = { withRef: true, pure: true };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeRootProps,
  connectOptions
)(Root);

export default ConnectedRoot;