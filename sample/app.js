import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
import List from "@ckeditor/ckeditor5-list/src/list";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import VideoUpload from "../src/videoupload";
import Video from "../src/video";
import VideoResize from "../src/videoresize";
import VideoToolbar from "../src/videotoolbar";
import VideoStyle from "../src/videostyle";
import VideoInsert from "../src/videoinsert";

class VideoUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    const uploadVideo = async (file) => {
      console.log("first");
      this.loader.uploaded = false;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.loader.uploaded = true;
          resolve({
            default:
              "https://raw.githubusercontent.com/mediaelement/mediaelement-files/refs/heads/master/big_buck_bunny.mp4",
          });
        }, 2000);
      });
    };

    return this.loader.file.then((file) => uploadVideo(file));
  }

  abort() {
    return Promise.reject();
  }
}

function VideoUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new VideoUploadAdapter(loader);
  };
}

ClassicEditor.create(document.querySelector("#editor"), {
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,
    VideoToolbar,
    Video,
    VideoUpload,
    VideoResize,
    VideoStyle,
    VideoInsert,
  ],
  extraPlugins: [VideoUploadAdapterPlugin],
  toolbar: [
    "heading",
    "bold",
    "italic",
    "numberedList",
    "bulletedList",
    "videoUpload",
  ],
  video: {
    upload: {
      types: ["mp4", "mp3"],
      allowMultipleFiles: false,
    },
    styles: ["alignLeft", "alignCenter", "alignRight"],

    // Configure the available video resize options.
    // Provide explicit values so the buttons execute with a target width.
    resizeOptions: [
      {
        name: "videoResize:original",
        label: "Original",
        icon: "original",
        value: null,
      },
      {
        name: "videoResize:25",
        label: "25",
        icon: "small",
        value: "25",
        default: true,
      },
      {
        name: "videoResize:50",
        label: "50",
        icon: "medium",
        value: "50",
      },
      {
        name: "videoResize:75",
        label: "75",
        icon: "large",
        value: "75",
      },
    ],

    // You need to configure the video toolbar, too, so it shows the new style
    // buttons as well as the resize buttons.
    toolbar: [
      "videoStyle:alignLeft",
      "videoStyle:alignCenter",
      "videoStyle:alignRight",
      "|",
      "videoResize:25",
      "videoResize:50",
      "videoResize:75",
      "videoResize:original",
    ],
  },
})
  .then((editor) => {
    CKEditorInspector.attach(editor);

    window.editor = editor;
  })
  .catch((error) => {
    console.error(error.stack);
  });
