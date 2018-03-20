class WatchVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='watch-video-container'>
        <h2 className='watch-video-title'> {this.props.title} </h2>
        <video className="watch-video-component" autoPlay controls>
          <source src={this.props.videoUrl} type="video/mp4" />
        </video>

        <p className='watch-video-description'>
          {this.props.description}
        </p>
      </div>
    );
  }
}

