import { Plugin } from "ckeditor5";
import { FileRepository } from "ckeditor5";

import "../../theme/videouploadprogress.css";
import "../../theme/videouploadicon.css";
import "../../theme/videouploadloader.css";

// Video placeholder SVG for upload progress
const VIDEO_PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 250">
  <rect rx="4" fill="#f5f5f5" stroke="#ddd" stroke-width="2" width="698" height="248" x="1" y="1"/>
  <g fill="#999">
    <circle cx="350" cy="100" r="30" fill="#e0e0e0"/>
    <polygon points="340,85 340,115 365,100" fill="#999"/>
  </g>
  <text x="350" y="150" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="16" font-weight="500">Loading Video...</text>
  <text x="350" y="175" text-anchor="middle" fill="#bbb" font-family="Arial, sans-serif" font-size="12">Please wait while your video uploads</text>
</svg>`;

export default class VideoUploadProgress extends Plugin {
  static get pluginName() {
    return "VideoUploadProgress";
  }

  constructor(editor) {
    super(editor);

    this.placeholder = "data:image/svg+xml;utf8," + encodeURIComponent(VIDEO_PLACEHOLDER);
  }

  init() {
    const editor = this.editor;

    // Upload status change - update video's view according to that status.
    if (editor.plugins.has("VideoBlockEditing")) {
      editor.editing.downcastDispatcher.on(
        "attribute:uploadStatus:videoBlock",
        (...args) => this.uploadStatusChange(...args)
      );
    }

    if (editor.plugins.has("VideoInlineEditing")) {
      editor.editing.downcastDispatcher.on(
        "attribute:uploadStatus:videoInline",
        (...args) => this.uploadStatusChange(...args)
      );
    }
  }

  uploadStatusChange(evt, data, conversionApi) {
    const editor = this.editor;
    const modelVideo = data.item;
    const uploadId = modelVideo.getAttribute("uploadId");

    if (!conversionApi.consumable.consume(data.item, evt.name)) {
      return;
    }

    const videoUtils = editor.plugins.get("VideoUtils");
    const fileRepository = editor.plugins.get(FileRepository);
    const status = uploadId ? data.attributeNewValue : null;
    const placeholder = this.placeholder;
    const viewFigure = editor.editing.mapper.toViewElement(modelVideo);
    const viewWriter = conversionApi.writer;

    if (status === "reading") {
      // Start "appearing" effect and show placeholder with infinite progress bar on the top
      // while video is read from disk.
      _startAppearEffect(viewFigure, viewWriter);
      _showPlaceholder(videoUtils, placeholder, viewFigure, viewWriter);
      return;
    }

    // Show progress bar on the top of the video when video is uploading.
    if (status === "uploading") {
      const loader = fileRepository.loaders.get(uploadId);

      // Start appear effect if needed - see https://github.com/ckeditor/ckeditor5-video/issues/191.
      _startAppearEffect(viewFigure, viewWriter);

      if (!loader) {
        // There is no loader associated with uploadId - this means that video came from external changes.
        // In such cases we still want to show the placeholder until video is fully uploaded.
        // Show placeholder if needed - see https://github.com/ckeditor/ckeditor5-video/issues/191.
        _showPlaceholder(videoUtils, placeholder, viewFigure, viewWriter);
      } else {
        // Hide placeholder and initialize progress bar showing upload progress.
        _hidePlaceholder(viewFigure, viewWriter);
        _showProgressBar(viewFigure, viewWriter, loader, editor.editing.view);
        _displayLocalVideo(videoUtils, viewFigure, viewWriter, loader);
      }

      return;
    }

    if (status === "complete" && fileRepository.loaders.get(uploadId)) {
      _showCompleteIcon(viewFigure, viewWriter, editor.editing.view);
    }

    // Clean up.
    _hideProgressBar(viewFigure, viewWriter);
    _hidePlaceholder(viewFigure, viewWriter);
    _stopAppearEffect(viewFigure, viewWriter);
  }
}

function _startAppearEffect(viewFigure, writer) {
  if (!viewFigure.hasClass("ck-appear")) {
    writer.addClass("ck-appear", viewFigure);
  }
}

function _stopAppearEffect(viewFigure, writer) {
  writer.removeClass("ck-appear", viewFigure);
}

function _showPlaceholder(videoUtils, placeholder, viewFigure, writer) {
  if (!viewFigure.hasClass("ck-video-upload-placeholder")) {
    writer.addClass("ck-video-upload-placeholder", viewFigure);
  }

  const viewVideo = videoUtils.findViewVideoElement(viewFigure);

  if (!viewVideo || !viewVideo.getAttribute) {
    return;
  }

  if (viewVideo.getAttribute("src") !== placeholder) {
    writer.setAttribute("src", placeholder, viewVideo);
  }

  if (!_getUIElement(viewFigure, "placeholder")) {
    writer.insert(
      writer.createPositionAfter(viewVideo),
      _createPlaceholder(writer)
    );
  }
}

function _hidePlaceholder(viewFigure, writer) {
  if (viewFigure.hasClass("ck-video-upload-placeholder")) {
    writer.removeClass("ck-video-upload-placeholder", viewFigure);
  }

  _removeUIElement(viewFigure, writer, "placeholder");
}

function _showProgressBar(viewFigure, writer, loader, view) {
  const progressBar = _createProgressBar(writer);
  writer.insert(writer.createPositionAt(viewFigure, "end"), progressBar);

  // Update progress bar width when uploadedPercent is changed.
  loader.on("change:uploadedPercent", (evt, name, value) => {
    view.change((writer) => {
      writer.setStyle("width", value + "%", progressBar);
    });
  });
}

function _hideProgressBar(viewFigure, writer) {
  _removeUIElement(viewFigure, writer, "progressBar");
}

function _showCompleteIcon(viewFigure, writer, view) {
  const completeIcon = writer.createUIElement("div", {
    class: "ck-video-upload-complete-icon",
  });

  writer.insert(writer.createPositionAt(viewFigure, "end"), completeIcon);

  setTimeout(() => {
    view.change((writer) => writer.remove(writer.createRangeOn(completeIcon)));
  }, 3000);
}

function _createProgressBar(writer) {
  const progressBar = writer.createUIElement("div", {
    class: "ck-progress-bar",
  });

  writer.setCustomProperty("progressBar", true, progressBar);

  return progressBar;
}

function _createPlaceholder(writer) {
  const placeholder = writer.createUIElement("div", {
    class: "ck-upload-placeholder-loader",
  });

  writer.setCustomProperty("placeholder", true, placeholder);

  return placeholder;
}

function _getUIElement(videoFigure, uniqueProperty) {
  for (const child of videoFigure.getChildren()) {
    if (child.getCustomProperty(uniqueProperty)) {
      return child;
    }
  }
}

function _removeUIElement(viewFigure, writer, uniqueProperty) {
  const element = _getUIElement(viewFigure, uniqueProperty);

  if (element) {
    writer.remove(writer.createRangeOn(element));
  }
}

function _displayLocalVideo(videoUtils, viewFigure, writer, loader) {
  if (loader.data) {
    const viewVideo = videoUtils.findViewVideoElement(viewFigure);

    if (viewVideo && viewVideo.setAttribute) {
      writer.setAttribute("src", loader.data, viewVideo);
    }
  }
}
