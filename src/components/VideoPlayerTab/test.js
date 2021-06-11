import React, { Component } from "react";
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlaybackRateMenuButton,
  BigPlayButton,
} from "video-react";
import Tags from "../../components/Tags";

import "video-react/dist/video-react.css";
import "./index.css";

const sources = {
  sintelTrailer: "http://media.w3.org/2010/05/sintel/trailer.mp4",
  bunnyTrailer: "http://media.w3.org/2010/05/bunny/trailer.mp4",
  bunnyMovie: "http://media.w3.org/2010/05/bunny/movie.mp4",
  test: "http://media.w3.org/2010/05/video/movie_300.webm",
  aws: "https://lecture-forager.s3.ap-south-1.amazonaws.com/videos/c5ce0567-35b7-466c-beed-987eb14c9de0SpinupanNginxDockerContainerasaLoadBalancer.mp4",
};

const moviePath =
  "/home/ritwiz/Desktop/github.com/lecture-forager/videos/Spin up an Nginx Docker Container as a LoadBalancer.mp4";
export default class VideoPlayerTab extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      source: `https://lecture-forager.s3.ap-south-1.amazonaws.com/videos/${
        props.id + props.filename
      }`,
      keywords: this.props.data.filter((word) => {
        return this.props.keyword.includes(word.word);
      }),
      bookmarks: [],
      value: "",
      bookmarkValue: "",
    };
    this.seek = this.seek.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  changePlayingStatus = (toChange) => {
    this.props.changeStatus(this.state.player.currentTime, toChange);
  };

  componentDidMount() {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    document
      .getElementsByClassName("video-react-video")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(true);
      });
    document
      .getElementsByClassName("video-react-play-control")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(true);
      });
    document
      .getElementsByClassName("video-react-big-play-button")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(true);
      });
    document
      .getElementsByClassName("video-react-icon-replay-10")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(false);
      });
    document
      .getElementsByClassName("video-react-icon-forward-30")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(false);
      });
    document
      .getElementsByClassName("video-react-progress-control")[0]
      .addEventListener("click", () => {
        this.changePlayingStatus(false);
      });

    if (
      localStorage.getItem(
        this.props.filename + "_video_lecture_forager"
      ) !== null
    ) {
      this.setState({
        bookmarks: JSON.parse(
          localStorage.getItem(
            this.props.filename + "_video_lecture_forager"
          )
        ),
      });
    }
    setInterval(() => {
      let currentTime = this.state.player.currentTime;
      this.state.bookmarks.forEach((bookmark, i) => {
        if (
          bookmark.time <= parseInt(currentTime) &&
          ((i < this.state.bookmarks.length - 1 &&
            this.state.bookmarks[i + 1].time > parseInt(currentTime)) ||
            i == this.state.bookmarks.length - 1)
        ) {
          this.setState((prevState) => {
            return {
              bookmarkValue: bookmark.text,
            };
          });
          return;
        }
      });
    }, 1000);
  }

  handleStateChange(state) {
    // copy player state to this component's state
    this.setState({
      player: state,
    });
  }

  seek(seconds) {
    return () => {
      this.player.seek(seconds);
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  addBookmarks(newBookmarkTime, text) {
    this.setState((prevState) => {
      let bookmarkToFind = prevState.bookmarks.find(
        (bookmark) => bookmark.time === newBookmarkTime
      );
      if (bookmarkToFind !== undefined) {
        if (bookmarkToFind.text === text) {
          return;
        } else {
          let bookmarkArray = prevState.bookmarks.filter(
            (bookmark) => bookmark.time !== newBookmarkTime
          );
          localStorage.setItem(
            this.props.filename + "_video_lecture_forager",
            JSON.stringify([
              ...[
                ...bookmarkArray.bookmarks,
                { time: newBookmarkTime, text: text },
              ].sort(function (a, b) {
                return a.time - b.time;
              }),
            ])
          );
          return {
            bookmarks: [
              ...[
                ...bookmarkArray.bookmarks,
                { time: newBookmarkTime, text: text },
              ].sort(function (a, b) {
                return a.time - b.time;
              }),
            ],
          };
        }
      }
      localStorage.setItem(
        this.props.filename + "_video_lecture_forager",
        JSON.stringify([
          ...[
            ...prevState.bookmarks,
            { time: newBookmarkTime, text: text },
          ].sort(function (a, b) {
            return a.time - b.time;
          }),
        ])
      );
      return {
        bookmarks: [
          ...[
            ...prevState.bookmarks,
            { time: newBookmarkTime, text: text },
          ].sort(function (a, b) {
            return a.time - b.time;
          }),
        ],
      };
    });
  }

  changeKeyword = (newWord) => {
    this.setState({
      keywords: this.props.data.filter((word) => {
        return newWord === word.word;
      }),
    });
  };

  render() {
    return (
      <div className="lf_video_play">
        <div className="main_video">
          <Player
            ref={(player) => {
              this.player = player;
            }}
            fluid={false}
            width={600}
          >
            <source src={this.state.source} />
            <BigPlayButton position="center" />
            <ControlBar autoHide={true}>
              <ReplayControl seconds={10} order={1.1} />
              <ForwardControl seconds={30} order={1.5} />
              <PlaybackRateMenuButton
                rates={[2.5, 2, 1.75, 1.5, 1.25, 1, 0.75]}
                order={7.1}
              />
            </ControlBar>
          </Player>
        </div>
        <div className="lf_title">{this.props.title}</div>
        <div className="lf_description">{this.props.description}</div>
        <div className="video_tags">
          <Tags
            tags={this.props.videoInformation.tags ?? []}
            keywordChange={this.changeKeyword}
          />{" "}
        </div>

        <div className="control_bar">
          {this.state.keywords.map((keyword, i) => {
            return (
              <div
                className={i.toString() + "_control_bar control_bar_item"}
                onClick={this.seek(parseInt(keyword.startTime))}
                key={i}
              >
                {keyword.word}(
                {Math.round((100 * keyword.startTime) / 60) / 100})
              </div>
            );
          })}
        </div>
        <div className="bookmark_bar">
          {this.state.bookmarks.map((bookmark, i) => {
            return (
              <div
                className={i.toString() + "_bookmark_bar bookmark_bar_item"}
                onClick={this.seek(parseInt(bookmark.time))}
                key={i}
              >
                {Math.round((100 * bookmark.time) / 60) / 100}
              </div>
            );
          })}
        </div>
        <div className="add_bookmark_bar">
          <div
            className={
              this.state.bookmarks.length.toString() +
              "_bookmark_bar bookmark_bar_item"
            }
            onClick={() => {
              this.addBookmarks(
                parseInt(this.state.player.currentTime),
                this.state.value
              );
            }}
          >
            Add Bookmark
          </div>
          <textarea
            value={this.state.value}
            onChange={this.handleChange}
            style={{ width: "100%" }}
          />
          <p>{this.state.bookmarkValue}</p>
        </div>
        <div></div>
      </div>
    );
  }
}
