import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

/**
 * Export the current Excalidraw scene as a PNG and return raw base64
 * (no `data:image/png;base64,` prefix) — ready for Gemini's `inlineData.data`.
 * Forces a white background so handwriting reads well regardless of canvas theme.
 * Throws if the canvas is empty so the UI can prompt the student to draw first.
 */
export async function exportCanvasPng(
  api: ExcalidrawImperativeAPI,
): Promise<string> {
  const elements = api.getSceneElements();
  if (elements.length === 0) {
    throw new Error("Draw something first — the canvas is empty.");
  }

  // Lazy import keeps Excalidraw out of any SSR pass (it touches browser APIs).
  const { exportToBlob } = await import("@excalidraw/excalidraw");

  const blob = await exportToBlob({
    elements,
    appState: {
      ...api.getAppState(),
      exportBackground: true,
      exportWithDarkMode: false,
      viewBackgroundColor: "#ffffff",
    },
    files: api.getFiles(),
    mimeType: "image/png",
  });

  const dataUrl = await blobToDataUrl(blob);
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
