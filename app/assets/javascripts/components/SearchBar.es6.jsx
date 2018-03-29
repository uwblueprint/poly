class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      language_suggestions: [],
      language_id: '',
    };
  }

  hasQueryValue() {
    if (this.props.query) {
      return this.props.query;
    }
  }

  // TODO these three functions are duplicated in NewBook. refactor to remove duplication
  httpGetAsync(url, callback) {
    return $.ajax({
      url: url,
      type: 'GET',
      success(res) {
        callback(res);
      },
      error(error) {
        printErrors(error);
      },
    });
  }

  renderLanguageSuggestion(item, isHighlighted) {
    const title = item.matched_identifiers.length == 0 ? item.glottocode : item.matched_identifiers[0];
    return (
      <div
        className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
        key={item.glottocode}
      >
        <div className="title">{title}</div>
        <div className="subtitle">{item.name}</div>
      </div>
    );
  }

  renderDropdownMenu(children) {
    return (
      <div className="dropdown-menu">
        {children}
      </div>
    );
  }


  // TODO ReactAutocomplete has a lot of duplicate code, refactor into a new React component
  render() {
    return (
      <form action="/search">
        <img src={this.props.search} alt="Search icon" />
        <div className="autosuggest">
          <ReactAutocomplete
            inputProps={{ type:"text", name:"q", placeholder:"Search", dir:"auto", defaultValue:this.hasQueryValue() }}
            wrapperStyle={{ position: 'relative', display: 'block' }}
            value={this.state.query}
            items={this.state.language_suggestions}
            getItemValue={(item) => item.matched_identifiers.length == 0 ? item.glottocode : item.matched_identifiers[0] } // TODO change name to something more appropriate?
            onSelect={(value, item) => {
              this.setState({
                query: value,
                language_id: item.glottocode,
                language_suggestions: [item]
              });
            }}
            onChange={(event, value) => {
              this.setState({ query: value, language_id: '' })
              if(value.length > 2){
                var req = this.httpGetAsync(
                  `http://localhost:6543/search?q=${value}&multilingual=true`,
                  res => {
                    if (res.length == 0 || res[0].message) {
                      this.setState({ language_suggestions: [] })
                    } else {
                      this.setState({ language_suggestions: res })
                      if (res.length == 1) {
                        this.setState({ target_language_id: res[0].glottocode });
                      }
                    }
                  }
                );
              } else {
                this.setState({ language_suggestions: [] });
              }
            }}
            renderMenu={this.renderDropdownMenu}
            renderItem={this.renderLanguageSuggestion}
          />
      </div>
      <input className="hiddenInput" type="submit" />
      <input
        type="text"
        className="hiddenInput"
        name="glottocode"
        dir="auto"
        value={this.state.language_id}
      />
      </form>
    );
  }
}

SearchBar.proptypes = {
  query: React.PropTypes.string,
  search: React.PropTypes.string,
};
