import { compressionTimeoutMs } from "./config.js";
import { state, activeCompression, finishActiveCompression, setActiveCompression } from "./state.js";
import { getKindConfig, clearOutput, createClearedResultPatch, createFailedItemPatch } from "./utils.js";
import { renderFiles, markItem, markItemPreparing, markItemSuccess } from "./render.js";
import { getWorker, restartWorker } from "./worker.js";
import { t } from "./i18n.js";

export const compressFile = (item, profile, optimizeStructure) =>
  new Promise((resolve) => {
    if (activeCompression) {
      resolve({
        ok: false,
        id: item.id,
        error: t("errorBusy"),
      });
      return;
    }

    const channel = new MessageChannel();
    let resolved = false;
    let timeoutId;

    const cleanup = () => {
      clearTimeout(timeoutId);
      channel.port1.close();
    };

    const doResolve = (value) => {
      if (resolved) {
        return;
      }

      resolved = true;
      if (activeCompression?.id === item.id) {
        setActiveCompression(null);
      }
      cleanup();
      resolve(value);
    };

    setActiveCompression({
      id: item.id,
      resolve: doResolve,
    });

    timeoutId = setTimeout(() => {
      doResolve({
        ok: false,
        id: item.id,
        error: t("errorTimeout"),
        stopQueue: true,
      });
      restartWorker(t("errorTimeout") + t("engineRestarted"));
    }, compressionTimeoutMs);

    channel.port1.onmessage = (event) => {
      doResolve(event.data);
    };

    channel.port1.onmessageerror = () => {
      doResolve({
        ok: false,
        id: item.id,
        error: t("errorMsgChannel"),
      });
    };

    item.file
      .arrayBuffer()
      .then((buffer) => {
        if (resolved) {
          return;
        }

        try {
          getWorker().postMessage(
            {
              type: getKindConfig(item.kind)?.compressType ?? "compress-pdf",
              id: item.id,
              kind: item.kind,
              name: item.file.name,
              buffer,
              profile,
              optimizeStructure,
            },
            [buffer, channel.port2]
          );
        } catch (error) {
          doResolve({
            ok: false,
            id: item.id,
            error: error instanceof Error ? error.message : t("errorPostFailed"),
          });
        }
      })
      .catch((error) => {
        doResolve({
          ok: false,
          id: item.id,
          error: error instanceof Error ? error.message : t("errorReadFailed"),
        });
      });
  });

export const processQueue = async ({ profile, optimizeStructure }) => {
  const queue = state.files.filter((item) => item.kind);
  const totalCount = queue.length;
  let currentIndex = 0;

  // Ghostscript/QPDF 的 WASM 文件系统是单例，只能串行处理。
  for (const item of queue) {
    currentIndex += 1;
    clearOutput(item);

    if (item.kind === "pdf" && !state.engineReady) {
      markItem(item.id, createFailedItemPatch(state.engineMessage || t("engineNotReady")));
      continue;
    }

    const shouldOptimizeStructure = item.kind === "pdf" && optimizeStructure;
    markItemPreparing(item, profile, shouldOptimizeStructure, currentIndex, totalCount);

    const result = await compressFile(item, profile, shouldOptimizeStructure);
    if (!result.ok) {
      markItem(item.id, createFailedItemPatch(result.error));
      if (result.stopQueue) {
        break;
      }
      continue;
    }

    markItemSuccess(item, result);
  }
};
