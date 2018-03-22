class LanguageSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowNew: true,
      isLoading: false,
      options: [],
    };
  }

  hasPlaceholderValue() {
    if (this.props.placeholder) {
      return this.props.placeholder;
    }
  }


  handleSearch(query) {
    this.setState({isLoading: true});
    makeAndHandleRequest(query)
      .then(({options}) => {
        this.setState({
          isLoading: false,
          options,
        });
      });
  }
  render() {
    const AsyncTypeahead = require('react-bootstrap-typeahead').AsyncTypeahead;
    // TODO uri format subject to change
    const SEARCH_URI = 'http://uwbp-ontology.herokuapp.com/bp/api/search';

    return (
      <input/>
      <AsyncTypeahead
        isLoading={this.state.isLoading}
        onSearch={query => {
          this.setState({isLoading: true});
          fetch(`${SEARCH_URI}?bpsearch=${query}`)
            .then(resp => resp.json())
            .then(json => this.setState({
              isLoading: false,
              options: json,
            }));
        }}
        options={this.state.options}
        renderMenuItemChildren={(option) => (
            <LanguageTypeaheadResult key={option.glottocode} languoid={option} />
          )}
      />
    );
  }

}

LanguageSearchBar.proptypes = {
  placeholder: React.PropTypes.string,
};
