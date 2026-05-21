import { state, dropzone, fileInput, fileList, compressButton, profileSelect, structureToggle } from "./src/state.js";
import { getFileKind, createItem, getItemById } from "./src/utils.js";
import { renderFiles, markItem } from "./src/render.js";
import { saveBlob } from "./src/download.js";
import { createWorker, probeWorker } from "./src/worker.js";
import { processQueue } from "./src/queue.js";
import { initLanguage, setLanguage, getLanguage, t } from "./src/i18n.js";

const addFiles = (incomingFiles) => {
  incomingFiles
    .filter((file) => getFileKind(file))
    .forEach((file) => {
      state.files.push(createItem(file));
    });

  renderFiles();
};

const handleSelection = (fileListLike) => {
  addFiles(Array.from(fileListLike));
};

const handleCompressClick = async () => {
  state.isProcessing = true;
  renderFiles();

  try {
    await processQueue({
      profile: profileSelect.value,
      optimizeStructure: structureToggle.checked,
    });
  } finally {
    state.isProcessing = false;
    renderFiles();
  }
};

const handleDownloadClick = async (event) => {
  const link = event.target.closest(".download-link");
  if (!link) {
    return;
  }

  const item = getItemById(link.dataset.fileId);
  if (!item?.outputBlob || item.tone !== "success") {
    return;
  }

  const previousMessage = item.message;
  markItem(item.id, {
    message: t("saving"),
  });

  try {
    await saveBlob(item);
    markItem(item.id, {
      message: t("saved"),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      markItem(item.id, {
        message: previousMessage,
      });
      return;
    }

    markItem(item.id, {
      message: `${t("saveFailedPrefix")}${error instanceof Error ? error.message : t("saveDenied")}`,
    });
  }
};

const handleDropzoneKeyboard = (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  fileInput.click();
};

const bindDropzoneEvents = () => {
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", handleDropzoneKeyboard);

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (event) => {
    handleSelection(event.dataTransfer.files);
  });
};

const bindFileInputEvents = () => {
  fileInput.addEventListener("change", (event) => {
    handleSelection(event.target.files);
    fileInput.value = "";
  });
};

const updateLangButtons = () => {
  const lang = getLanguage();
  document.querySelectorAll("#lang-bar .lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
};

const bindLangSwitcher = () => {
  document.querySelectorAll("#lang-bar .lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!lang) return;
      setLanguage(lang);
      updateLangButtons();
      state.engineMessage = t("engineLoading");
      renderFiles();
    });
  });
};

const init = () => {
  initLanguage();
  bindDropzoneEvents();
  bindFileInputEvents();
  bindLangSwitcher();
  compressButton.addEventListener("click", handleCompressClick);
  fileList.addEventListener("click", handleDownloadClick);

  updateLangButtons();
  state.engineMessage = t("engineLoading");

  createWorker();
  probeWorker();
  renderFiles();
};

init();
