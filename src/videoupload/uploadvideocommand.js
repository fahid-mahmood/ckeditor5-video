import { FileRepository } from "ckeditor5";
import { Command } from "ckeditor5";
import { toArray } from "ckeditor5";

export default class UploadVideoCommand extends Command {
  refresh() {
    const editor = this.editor;
    const videoUtils = editor.plugins.get("VideoUtils");
    const selectedElement =
      editor.model.document.selection.getSelectedElement();

    this.isEnabled =
      videoUtils.isVideoAllowed() || videoUtils.isVideo(selectedElement);
  }

  execute(options) {
    if (!options.file && !options.files) {
      return;
    }

    const files = options.file ? toArray(options.file) : toArray(options.files);
    const selection = this.editor.model.document.selection;
    const videoUtils = this.editor.plugins.get("VideoUtils");
    const selectionAttributes = Object.fromEntries(selection.getAttributes());

    files.forEach((file, index) => {
      const selectedElement = selection.getSelectedElement();

      if (index && selectedElement && videoUtils.isVideo(selectedElement)) {
        const position = this.editor.model.createPositionAfter(selectedElement);

        this._uploadVideo(file, selectionAttributes, position);
      } else {
        this._uploadVideo(file, selectionAttributes);
      }
    });
  }

  _uploadVideo(file, attributes, position) {
    const editor = this.editor;
    const fileRepository = editor.plugins.get(FileRepository);
    const loader = fileRepository.createLoader(file);
    const videoUtils = editor.plugins.get("VideoUtils");

    if (!loader) {
      return;
    }

    // Determine default resize value for newly inserted videos based on a configured default option.
    // Respect existing width if already provided via selection attributes.
    let width = attributes && Object.prototype.hasOwnProperty.call(attributes, "width")
      ? attributes.width
      : undefined;

    if (width === undefined) {
      const options = editor.config.get("video.resizeOptions") || [];
      const unit = editor.config.get("video.resizeUnit") || "%";
      const defaultOption = options.find((opt) => opt && opt.default === true);

      if (defaultOption) {
        if (defaultOption.value != null) {
          width = String(defaultOption.value) + unit;
        } else {
          // Explicit default to original size -> leave width undefined
          width = undefined;
        }
      }
    }

    const insertAttrs = { controls: true, ...attributes, uploadId: loader.id };
    if (width !== undefined) {
      insertAttrs.width = width;
    }

    videoUtils.insertVideo(insertAttrs, position);
  }
}
