import { Observer } from "@ckeditor/ckeditor5-engine";

export default class VideoLoadObserver extends Observer {
  observe(domRoot) {
    const handler = (event, domEvent) => {
      const domElement = domEvent.target;

      if (this.checkShouldIgnoreEventFromTarget(domElement)) {
        return;
      }

      if (domElement.tagName === "VIDEO") {
        this._fireEvents(domEvent);
      }
    };

    // Listen to multiple media readiness events to ensure resizers get attached
    // once dimensions are known.
    this.listenTo(domRoot, "load", handler, { useCapture: true });
    this.listenTo(domRoot, "loadedmetadata", handler, { useCapture: true });
    this.listenTo(domRoot, "loadeddata", handler, { useCapture: true });
  }

  _fireEvents(domEvent) {
    if (this.isEnabled) {
      this.document.fire("layoutChanged");
      this.document.fire("videoLoaded", domEvent);
    }
  }
}
