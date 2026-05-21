import { fileKinds } from "./config.js";
import { state, engineStatus, structureToggle, queueSummary, fileList, compressButton, rowTemplate } from "./state.js";
import { formatBytes, getKindConfig, getItemById, canProcessItem, createClearedResultPatch, createFailedItemPatch, isBinaryOutput, isOfficeKind } from "./utils.js";
import { t } from "./i18n.js";

export const setEngineStatus = (label, tone = "") => {
  engineStatus.textContent = label;
  engineStatus.className = `status-chip${tone ? ` ${tone}` : ""}`;
};

export const setStructureToggleEnabled = (enabled) => {
  structureToggle.disabled = !enabled;
  if (!enabled) {
    structureToggle.checked = false;
  }
  structureToggle.closest(".checkbox-field")?.classList.toggle("disabled-field", !enabled);
};

export const updateSummary = () => {
  const totalBytes = state.files.reduce((sum, item) => sum + item.file.size, 0);
  queueSummary.innerHTML = "";
  const spanCount = document.createElement("span");
  spanCount.textContent = t("summaryFiles", { count: state.files.length });
  const spanTotal = document.createElement("span");
  spanTotal.textContent = t("summaryTotal", { size: formatBytes(totalBytes) });
  queueSummary.appendChild(spanCount);
  queueSummary.appendChild(spanTotal);
};

export const renderEmptyState = () => {
  const emptyRow = document.createElement("li");
  emptyRow.className = "empty-row";
  emptyRow.textContent = t("emptyState");
  fileList.appendChild(emptyRow);
};

export const renderItem = (item) => {
  const fragment = rowTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".file-row");
  const name = fragment.querySelector(".file-name");
  const size = fragment.querySelector(".file-size");
  const badge = fragment.querySelector(".file-badge");
  const message = fragment.querySelector(".file-message");
  const download = fragment.querySelector(".download-link");

  name.textContent = item.file.name;
  size.textContent = item.resultBytes
    ? `${formatBytes(item.file.size)} -> ${formatBytes(item.resultBytes)}`
    : formatBytes(item.file.size);
  badge.textContent = item.statusLabel;
  badge.className = `file-badge ${item.tone}`;
  message.textContent = item.message;

  if (item.tone === "success" && item.outputBlob) {
    download.hidden = false;
    download.dataset.fileId = item.id;
    download.textContent = t("downloadFile");
  }

  row.dataset.fileId = item.id;
  fileList.appendChild(fragment);
};

export const renderFiles = () => {
  fileList.textContent = "";

  if (state.files.length === 0) {
    renderEmptyState();
  }

  state.files.forEach(renderItem);
  updateSummary();
  compressButton.disabled =
    state.isProcessing || state.files.length === 0 || !state.files.some((item) => canProcessItem(item));
};

export const markItem = (id, patch) => {
  const item = getItemById(id);
  if (!item) {
    return;
  }

  Object.assign(item, patch);
  renderFiles();
};

export const buildProcessingMessage = (item, profile, optimizeStructure, currentIndex, totalCount) => {
  const profileLabel = t(`profile${profile.charAt(0).toUpperCase() + profile.slice(1)}`);
  if (isOfficeKind(item.kind)) {
    return t("processingOffice", {
      kind: item.kind.toUpperCase(),
      current: currentIndex,
      total: totalCount,
      profile: profileLabel,
    });
  }

  if (optimizeStructure) {
    return t("processingPdfOptimized", {
      current: currentIndex,
      total: totalCount,
      profile: profileLabel,
    });
  }

  return t("processingPdf", {
    current: currentIndex,
    total: totalCount,
    profile: profileLabel,
  });
};

export const markItemPreparing = (item, profile, optimizeStructure, currentIndex, totalCount) => {
  markItem(item.id, {
    statusLabel: t("statusCompressing"),
    tone: "processing",
    message: buildProcessingMessage(item, profile, optimizeStructure, currentIndex, totalCount),
    ...createClearedResultPatch(),
  });
};

export const markItemSuccess = (item, result) => {
  if (!isBinaryOutput(result.buffer)) {
    markItem(item.id, createFailedItemPatch(t("invalidResult")));
    return;
  }

  const blob = new Blob([result.buffer], {
    type: getKindConfig(item.kind)?.mime ?? fileKinds.pdf.mime,
  });

  markItem(item.id, {
    statusLabel: t("statusCompleted"),
    tone: "success",
    message: result.message,
    resultBytes: blob.size,
    outputName: result.outputName,
    outputBlob: blob,
  });
};
