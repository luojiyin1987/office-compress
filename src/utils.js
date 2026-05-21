import { fileKinds } from "./config.js";
import { state } from "./state.js";
import { t } from "./i18n.js";

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

export const getKindConfig = (kind) => fileKinds[kind] ?? null;

export const getFileKind = (file) => {
  const normalizedName = file.name.toLowerCase();

  return Object.entries(fileKinds).find(([, config]) => {
    return file.type === config.mime || normalizedName.endsWith(config.extension);
  })?.[0] ?? "";
};

export const isOfficeKind = (kind) => Boolean(getKindConfig(kind)?.isOffice);

export const canProcessItem = (item) => {
  const config = getKindConfig(item.kind);
  if (!config) {
    return false;
  }

  return config.requiresEngine ? state.engineReady : true;
};

export const createItem = (file) => ({
  id: crypto.randomUUID(),
  file,
  kind: getFileKind(file),
  statusLabel: t("statusPending"),
  tone: "",
  message: t("messageQueued"),
  outputBlob: null,
  outputName: "",
  resultBytes: 0,
});

export const getItemById = (id) => state.files.find((item) => item.id === id);

export const clearOutput = (item) => {
  item.outputBlob = null;
  item.outputName = "";
  item.resultBytes = 0;
};

export const createClearedResultPatch = () => ({
  resultBytes: 0,
  outputName: "",
  outputBlob: null,
});

export const createFailedItemPatch = (message) => ({
  statusLabel: "未完成",
  tone: "error",
  message,
  ...createClearedResultPatch(),
});

export const isBinaryOutput = (value) => {
  return value instanceof ArrayBuffer || ArrayBuffer.isView(value);
};
