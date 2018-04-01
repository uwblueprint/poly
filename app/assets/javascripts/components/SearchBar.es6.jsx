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

  // TODO ReactAutocomplete has a lot of duplicate code, refactor into a new React component
  render() {
    return (
      <form action="/search">
        <img src={this.props.search} alt="Search icon" />
        <div className="autosuggest">
          <LanguageSearchBar
            inputProps={{ type:"text", name:"q", placeholder:"Search", dir:"auto", defaultValue:this.hasQueryValue() }}
            value={this.state.query}
            items={this.state.language_suggestions}
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
                var req = asyncSearchLanguage(
                  value,
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
