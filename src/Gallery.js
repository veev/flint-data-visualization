import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Img from './Img'
import placeholder from './styles/images/placeholder.png'
const s3Path = 'https://s3.amazonaws.com/flint-pd-may/saved-for-web/'
const localPath = 'data/photos/'
Img.globalPlaceholder = placeholder

export default class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.startIndex,
      offsetPercentage: 0,
      galleryWidth: 0
    }
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    startIndex: PropTypes.number,
    renderItem: PropTypes.func,
    defaultImage: PropTypes.string,
    infinite: PropTypes.bool
  }

  static defaultProps = {
    items: [],
    startIndex: 0,
    renderLeftNav: (onClick, disabled) => {
      return (
        <span
          className="image-gallery-left-nav"
          disabled={disabled}
          onClick={onClick}
        >
          <span>◀</span>
        </span>
      )
    },
    renderRightNav: (onClick, disabled) => {
      return (
        <span
          className="image-gallery-right-nav"
          disabled={disabled}
          onClick={onClick}
        >
          <span>▶</span>
        </span>
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.currentIndex >= nextProps.items.length) {
      this.slideToIndex(0)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentIndex !== this.state.currentIndex) {
      if (this.props.onSlide) {
        this.props.onSlide(this.state.currentIndex)
      }
    }
  }
  _handleImageError = (event) => {
    if (this.props.defaultImage &&
        event.target.src.indexOf(this.props.defaultImage) === -1) {
      event.target.src = this.props.defaultImage;
    }
  }

  _slideLeft = (event) => {
    this.slideToIndex(this.state.currentIndex - 1, event)
  }

  _slideRight = (event) => {
    this.slideToIndex(this.state.currentIndex + 1, event)
  }

  _canNavigate() {
    return this.props.items.length >= 2;
  }

  _canSlideLeft() {
    return this.props.infinite || this.state.currentIndex > 0;
  }

  _canSlideRight() {
    return this.props.infinite ||
      this.state.currentIndex < this.props.items.length - 1;
  }

  _renderItem = (item) => {
    const onImageError = this.props.onImageError || this._handleImageError

    return (
      <div className="image-gallery-item">

         {(() => {
              switch(item.type) {
                  case 'image':
                    const photoPath = s3Path + item.url;
                      return (
                        <div className="image-wrapper">
                          <Img
                            alt={item.title}
                            src={photoPath}
                            onLoad={this.props.onImageLoad}
                            onError={onImageError}
                          />
                          <div className="image-date">{item.date}</div>
                        </div>
                      )
                  case 'text':
                      return (
                        <div className="text-wrapper">
                          <p className="image-gallery-description">{item.textInfo}</p>
                        </div>
                      )
                  case 'link':
                      return <div className="link-wrapper"><a href={item.url}>{item.linkText}</a></div>
                  default:
                      return null
              }
          })()}

      </div>
    )
  }

  slideToIndex = (index, event) => {
    console.log(index)
    const { currentIndex } = this.state

    let slideCount = this.props.items.length - 1;
    let nextIndex = index
    if (index < 0) {
      nextIndex = slideCount
    } else if (index > slideCount) {
      nextIndex = 0
    }
    //console.log(nextIndex)

    this.setState({
      previousIndex: currentIndex,
      currentIndex: nextIndex,
      offsetPercentage: 0
    })
  }

  getCurrentIndex = () => {
    return this.state.currentIndex
  }

  render() {
    const { currentIndex } = this.state
    const { infinite } = this.props
    const slideLeft = this._slideLeft
    const slideRight = this._slideRight

    let slides = []
    //console.log(this.props.items)
    this.props.items.forEach((item, index) => {
      //const renderItem = item.renderItem || this.props.renderItem || this._renderItem
      const slide = (
        currentIndex === index ?
        <div
          key={`slide-${index}`}
          className={"image-gallery-slide"}
          onClick={this.props.onClick}
          role={this.props.onClick && "button"}
        >
          {this._renderItem(item)}
        </div> :
        null
      )
      slides.push(slide)
    })

    const slideWrapper = (
      <div
        ref={i => this._imageGallerySlideWrapper = i}
        className={"image-gallery-slide-wrapper"}
      >
      {
        this._canNavigate() ?
          [
          <span key="navigation" className="nav-wrapper">
            {this.props.renderLeftNav(slideLeft, !this._canSlideLeft())}
            {this.props.renderRightNav(slideRight, !this._canSlideRight())}
            <div 
              className="image-gallery-close"
              onClick={this.props.closeGallery}
              >X</div>
          </span>,
          <div className="image-gallery-slides" key="slides">
            {slides}
          </div>
          ]
        :
          <div className="image-gallery-slides" key="slides">
            {slides}
          </div>
      }
      </div>
    )

    return (
      <div
        ref={i => this._imageGallery = i}
        className="image-gallery"
      >
        <div className="image-gallery-content">
          { slideWrapper }
        </div>
      </div>
    )
  }
}