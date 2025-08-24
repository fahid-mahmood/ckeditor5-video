import { Plugin, Widget } from "ckeditor5";

import VideoBlockEditing from "./video/videoblockediting";

import "../theme/video.css";

export default class VideoBlock extends Plugin {
  static get requires() {
    return [VideoBlockEditing, Widget];
  }

  static get pluginName() {
    return "VideoBlock";
  }
}
