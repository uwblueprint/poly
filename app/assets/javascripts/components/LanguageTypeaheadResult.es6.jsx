class LanguageTypeaheadResult extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.languoid.name + " - " + this.props.languoid.glottocode}</span>
      </div>
    );
  }
}

LanguageTypeaheadResult.propTypes = {
  languoid: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    glottocode: React.PropTypes.string.isRequired,
  }).isRequired,
};
