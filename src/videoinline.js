import { Plugin, Widget } from "ckeditor5";

import VideoInlineEditing from "./video/videoinlineediting";

import "../theme/video.css";

export default class VideoInline extends Plugin {
  static get requires() {
    return [VideoInlineEditing, Widget];
  }

  static get pluginName() {
    return "VideoInline";
  }
}
