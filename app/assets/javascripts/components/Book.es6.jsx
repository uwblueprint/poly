class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phrasePairs: this.props.initialPhrasePairs,
      isEditingBook: false,
      book: this.props.initialBook,
      isDescriptionTruncated: true,
      isFavoriteBook: this.isFavoriteBook(),
    };
    this.onSourcePhraseSubmit = this.onSourcePhraseSubmit.bind(this);
    this.onTargetPhraseSubmit = this.onTargetPhraseSubmit.bind(this);
    this.saveNewPhrasePair = this.saveNewPhrasePair.bind(this);
    this.onDeleteBookClick = this.onDeleteBookClick.bind(this);
    this.onSaveBookClick = this.onSaveBookClick.bind(this);
    this.toggleEditingBookState = this.toggleEditingBookState.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSearchBook = this.onSearchBook.bind(this);
    this.onClickFavoriteBook = this.onClickFavoriteBook.bind(this);
    this.destroyFavorite = this.destroyFavorite.bind(this);
    this.createFavorite = this.createFavorite.bind(this);
    this.toggleFavoriteBook = this.toggleFavoriteBook.bind(this);
    this.bookIsOwnedByCurrentUser = this.bookIsOwnedByCurrentUser.bind(this);
    this.renderBookMenu = this.renderBookMenu.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderAuthor = this.renderAuthor.bind(this);
    this.truncateText = this.truncateText.bind(this);
    this.renderTruncatedDescription = this.renderTruncatedDescription.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.renderSourceLanguage = this.renderSourceLanguage.bind(this);
    this.renderTargetLanguage = this.renderTargetLanguage.bind(this);
    this.favoriteImage = this.favoriteImage.bind(this);
    this.isFavoriteBook = this.isFavoriteBook.bind(this);
    this.renderFavoriteButton = this.renderFavoriteButton.bind(this);
  }

  onSourcePhraseSubmit(sourcePhrase) {
    const newPhrasePair = { source_phrase: sourcePhrase };
    const newPhrasePairs = this.state.phrasePairs;
    newPhrasePairs.push(newPhrasePair);
    this.setState({ phrasePairs: newPhrasePairs });
  }

  onTargetPhraseSubmit(targetPhrase) {
    const newPhrasePairs = this.state.phrasePairs;
    const newPhrasePair = newPhrasePairs[newPhrasePairs.length - 1];
    newPhrasePair.target_phrase = targetPhrase;
    this.setState({ phrasePairs: newPhrasePairs });
    this.saveNewPhrasePair(newPhrasePair);
  }

  saveNewPhrasePair(phrasePair) {
    $.ajax({
      url: "/phrase_pairs",
      type: "POST",
      data: {
        book_id: this.state.book.id,
        phrase_pair: phrasePair,
      },
      success: function (phrasePair) {
        let newPhrasePairs = this.state.phrasePairs;
        newPhrasePairs.splice(this.state.phrasePairs.length - 1, 1, phrasePair.phrase_pair);
        this.setState({ phrasePairs: newPhrasePairs });
      }.bind(this),
      error: function () {
        console.log('Error: Save action failed');
      },
    });
  }

  onDeleteBookClick() {
    if (window.confirm('Are you sure you want to delete this book?')) {
      $.ajax({
        url: '/books/' + this.state.book.id,
        type: 'DELETE',
        success: function () {
          window.location.href = '/dashboard';
        },
      });
    }
  }

  onSaveBookClick() {
    $.ajax({
      url: '/books/' + this.state.book.id,
      type: 'PUT',
      data: { book: this.state.book },
      success: function () {
        this.toggleEditingBookState();
      }.bind(this),
      error: function () {
        alert('something went wrong');
      },
    });
  }

  toggleEditingBookState() {
    this.setState({ isEditingBook: !this.state.isEditingBook });
  }

  onInputChange(e) {
    const newBook = this.state.book;
    const newState = this.state;
    newBook[e.target.name] = e.target.value;
    newState.book = newBook;
    this.setState(newState);
  }

  onSearchBook() {
    alert('Searching is coming soon!');
  }

  onClickFavoriteBook() {
    if (this.state.isFavoriteBook) {
      this.destroyFavorite();
    } else {
      this.createFavorite();
    }
  }

  destroyFavorite() {
    $.ajax({
      url: '/favorites/' + this.state.book.id,
      type: 'DELETE',
      success: function () {
        this.toggleFavoriteBook();
      }.bind(this),
      error: function () {
        console.log('something went wrong');
      },
    });
  }

  createFavorite() {
    $.ajax({
      url: '/favorites',
      type: 'POST',
      data: {
        book_id: this.state.book.id
      },
      success: function () {
        this.toggleFavoriteBook();
      }.bind(this),
      error: function () {
        console.log('something went wrong');
      },
    });
  }

  toggleFavoriteBook() {
    this.setState({ isFavoriteBook: !this.state.isFavoriteBook });
  }

  bookIsOwnedByCurrentUser() {
    if (this.props.currentUser) {
      return this.props.initialBook.user_id === this.props.currentUser.id;
    }
  }

  renderBookMenu() {
    if (this.bookIsOwnedByCurrentUser()) {
      if (this.state.isEditingBook) {
        return (
          <div className="menu saving">
            <button title="Save" onClick={this.onSaveBookClick} className="icon">
              <img src={this.props.saveAlt} alt="Save" />
            </button>
            <button
              title="Cancel"
              onClick={this.toggleEditingBookState}
              className="close icon"
            >
              <img src={this.props.closeAlt} alt="Close" />
            </button>
          </div>
        );
      }
      return (
        <div className="menu">
          <button title="Menu" className="more icon">
            <img src={this.props.menuAlt} alt="Menu" />
          </button>
          <button 
            title="Edit"
            onClick={this.toggleEditingBookState}
            className="icon"
            tabIndex="-1"
          >
            <img src={this.props.editAlt} alt="Edit" />
          </button>
          <button 
            title="Delete"
            onClick={this.onDeleteBookClick}
            className="icon"
            tabIndex="-1"
          >
            <img src={this.props.deleteAlt} alt="Delete" />
          </button>
        </div>
      );
    }
  }

  renderTitle() {
    if (this.state.isEditingBook) {
      return (
        <input
          name="title"
          className="title new isEditing"
          onChange={this.onInputChange}
          value={this.state.book.title}
        />
      );
    }
    return <h1 title={this.state.book.title}>{this.state.book.title}</h1>;
  }

  renderAuthor() {
    const users = this.props.users;
    let authorName = '';
    for (var i = users.length - 1; i >= 0; i--) {
      if (this.props.initialBook.user_id === users[i].id) {
        authorName = users[i].username;
      }
    }

    if (this.bookIsOwnedByCurrentUser()) {
      if (this.state.isEditingBook) {
        return (
          <p className="author">{authorName}</p>
        );
      }
      return (
        <a href={"/dashboard"} className="author">{authorName}</a>
      );
    }
    return (
      <a href={"/users/" + this.state.book.user_id} className="author">{authorName}</a>
    );
  }

  truncateText() {
    this.setState({ isDescriptionTruncated: !this.state.isDescriptionTruncated });
  }

  renderTruncatedDescription() {
    if(this.state.book.description.length >= 132) {
      if (this.state.isDescriptionTruncated) {
        return (
          <p className="description">
            {this.state.book.description.substring(0, 132)}...
            <button onClick={this.truncateText}>More</button>
          </p>
        );
      }
      return (
        <p className="description">
          {this.state.book.description}
          <button onClick={this.truncateText}>Less</button>
        </p>
      );
    }
    return <p className="description">{this.state.book.description}</p>;
  }

  renderDescription() {
    if (this.state.book.description) {
      if (this.state.isEditingBook) {
        return (
          <textarea
            rows="4"
            className="description new isEditing"
            name="description"
            onChange={this.onInputChange}
            value={this.state.book.description}
          />
        );
      }
      return <span>{this.renderTruncatedDescription()}</span>;
    }
    if (this.state.isEditingBook) {
      return (
        <textarea
          rows="5"
          className="description new isEditing"
          name="description"
          onChange={this.onInputChange}
          value={this.state.book.description}
          placeholder="Describe the contents of your book,
          Ex: A collection of useful phrases in Laputa, a Swiftian
          language spoken in Balnibarbi and a number of other islands..."
        />
      );
    }
  }

  renderSourceLanguage() {
    if (this.state.isEditingBook) {
      return (
        <input
          className="new isEditing"
          name="source_language"
          onChange={this.onInputChange}
          value={this.state.book.source_language}
        />
      );
    }
    return (
      <h1 className="language source" title={this.state.book.source_language}>
        {this.state.book.source_language}
      </h1>
    );
  }

  renderTargetLanguage() {
    if (this.state.isEditingBook) {
      return (
        <input
          className="new isEditing"
          name="target_language"
          onChange={this.onInputChange}
          value={this.state.book.target_language}
        />
      );
    }
    return (
      <h1 className="language target" title={this.state.book.target_language}>
        {this.state.book.target_language}
      </h1>
    );
  }

  favoriteImage() {
    return this.state.isFavoriteBook
      ? this.props.star
      : this.props.unstar;
  }

  isFavoriteBook() {
    if (this.props.currentUser) {
      return this.props.currentUser.favorite_books.filter(function(favorite) {
        return favorite.book_id === this.props.initialBook.id
      }.bind(this)).length > 0;
    }
  }

  renderFavoriteButton() {
    if (this.props.currentUser) {
      return (
        <button title="Favorite" onClick={this.onClickFavoriteBook} className="favorite icon">
          <img src={this.favoriteImage()} alt="Favorite" />
        </button>
      );
    }
    return;
  }

  render() {
    return (
      <div className="container">
        <NavBar
          currentUser={this.props.currentUser}
          logo={this.props.logo}
          detail={this.props.detail}
          search={this.props.search}
        />
        <span className="backgroundElement" />
        <div className="book">
          <div className="tools">
            {this.renderFavoriteButton()}
            <div className="cardinality">
              <section>
                { this.renderSourceLanguage() }
                <img src={this.props.cardinality} alt="Cardinality" />
                { this.renderTargetLanguage() }
              </section>
            </div>
            { this.renderBookMenu() }
          </div>
          <div className="info">
            <div className="wrapper">
              { this.renderTitle() }
              { this.renderAuthor() }
              { this.renderDescription() }
            </div>
          </div>
          {/*<ProgressBar />*/}
          <div className="NObannerWrapper"></div>

          <Dictionary
            isOwnedByCurrentUser={this.bookIsOwnedByCurrentUser()}
            initialPhrasePairs={this.state.phrasePairs}
            onSourcePhraseSubmit={this.onSourcePhraseSubmit}
            onTargetPhraseSubmit={this.onTargetPhraseSubmit}
            menu={this.props.menu}
            save={this.props.save}
            delete={this.props.delete}
            edit={this.props.edit}
            close={this.props.close}
          />
        </div>
      </div>
    );
  }
}

Book.propTypes = {

};

