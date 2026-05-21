const STORAGE_KEY = "paper-squeeze-lang";

const dictionary = {
  zh: {
    eyebrow: "Cloudflare Pages / Local-Only Compression",
    heroTitle: "PDF、PPTX 和 DOCX 都在浏览器本地压缩。",
    heroText:
      "浏览器直接读取文件，压缩流程放进 Web Worker。PDF 由 Ghostscript/QPDF WASM 处理，PPTX 和 DOCX 由 JSZip 解包并重压缩内嵌图片。",
    pillNoUpload: "文档不上传",
    pillBatch: "批量队列",
    pillWorker: "Worker 隔离",
    pillQpdf: "QPDF 优化",
    pillPptx: "PPTX 图片重压缩",
    pillDocx: "DOCX 图片重压缩",
    panelLabel: "处理路径",
    pipeline_0: "浏览器读取本地 PDF",
    pipeline_1: "Web Worker 接管任务",
    pipeline_2: "Ghostscript WASM 压缩",
    pipeline_3: "QPDF WASM 结构优化",
    pipeline_4: "JSZip 重写 Office 图片",
    pipeline_5: "浏览器生成下载文件",
    panelFootnote:
      "当前版本已接入 PDF 压缩、PDF 结构优化和 Office 图片重压缩。",
    toolKicker: "Local Compression",
    toolTitle: "PDF / PPTX / DOCX 压缩",
    dropzoneLabel: "选择 PDF、PPTX 或 DOCX 文件",
    dropzoneTitle: "拖入 PDF / PPTX / DOCX，或点这里选择文件",
    dropzoneSubtitle: "支持批量加入队列。文件只在当前浏览器内处理。",
    profileLabel: "压缩档位",
    profileBalanced: "均衡",
    profileStrong: "强力",
    profileArchive: "原图",
    structureLabel: "启用 PDF 结构优化（QPDF WASM）",
    compressButton: "开始压缩",
    summaryFiles: "{{count}} 个文件",
    summaryTotal: "总计 {{size}}",
    sideKicker: "功能",
    feature_pdf_title: "PDF 压缩",
    feature_pdf_desc:
      "首屏主功能，已接入批量队列、Ghostscript WASM 和 QPDF WASM。",
    feature_pptx_title: "PPTX 压缩",
    feature_pptx_desc: "JSZip 解包 + 图片重压缩，再回写 ZIP。",
    feature_docx_title: "DOCX 压缩",
    feature_docx_desc: "沿用 Office Open XML 流程，优先处理嵌入图片。",
    feature_batch_title: "批量压缩",
    feature_batch_desc: "当前队列已支持多文件，后续补并行和失败重试。",
    privacyTitle: "本地处理说明",
    privacyText:
      "这个版本不会把文件上传到服务器。PDF 引擎和 Office 图片处理都在浏览器端 Worker 中运行。",
    statusPending: "待处理",
    messageQueued: "已加入队列，等待开始。",
    emptyState:
      "队列为空。当前接受 PDF、PPTX 和 DOCX 文件，支持一次加入多个文件。",
    statusCompressing: "压缩中",
    statusCompleted: "已完成",
    downloadFile: "下载文件",
    processingOffice:
      "JSZip 正在解包 {{kind}}（{{current}}/{{total}}），并按 {{profile}} 档位重压缩图片。",
    processingPdfOptimized:
      "Ghostscript 压缩后将执行 QPDF 结构优化（{{current}}/{{total}}），使用 {{profile}} 档位。",
    processingPdf:
      "Ghostscript WASM 正在处理（{{current}}/{{total}}），使用 {{profile}} 档位。",
    errorBusy: "已有压缩任务正在运行，请稍后重试。",
    errorTimeout: "压缩任务超时，请重试或降低档位。",
    errorMsgChannel: "Worker 消息通道错误，数据无法解析。",
    errorPostFailed: "Worker 通信失败。",
    errorReadFailed: "读取文件失败。",
    engineNotReady: "PDF 压缩引擎未就绪。",
    engineLoading: "压缩引擎加载中",
    engineRestarted: "压缩引擎已重启。",
    engineRestartCause: "{{cause}}，压缩引擎已重启。",
    workerError: "Worker 发生错误",
    workerMsgError: "Worker 消息通道错误",
    invalidResult: "压缩结果无效，未收到可保存的输出文件。",
    saving: "正在写入下载文件...",
    saved: "文件已保存到本地。",
    saveFailedPrefix: "保存失败：",
    saveDenied: "浏览器拒绝写入文件。",
    langZh: "中文",
    langEn: "English",
    pageTitle: "Paper Squeeze — 本地 PDF、PPTX、DOCX 压缩工具",
    metaDescription:
      "免费的浏览器本地压缩工具。使用 Web Worker + WASM 在本地压缩 PDF、PPTX 和 DOCX，文件全程不上传服务器，保护隐私。",
    metaOgDescription:
      "免费的浏览器本地压缩工具。文件全程不上传服务器，保护隐私。支持 PDF、PPTX、DOCX 批量压缩。",
    metaKeywords:
      "PDF压缩,PPTX压缩,DOCX压缩,本地压缩,浏览器压缩,图片压缩,文档瘦身,在线压缩工具,隐私安全,不上传",
  },
  en: {
    eyebrow: "Cloudflare Pages / Local-Only Compression",
    heroTitle: "Compress PDF, PPTX & DOCX locally in your browser.",
    heroText:
      "Files are read directly by the browser and compressed inside a Web Worker. PDFs are handled by Ghostscript/QPDF WASM; PPTX and DOCX are unpacked with JSZip and their embedded images are recompressed.",
    pillNoUpload: "No Upload",
    pillBatch: "Batch Queue",
    pillWorker: "Worker Isolation",
    pillQpdf: "QPDF Optimize",
    pillPptx: "PPTX Recompress",
    pillDocx: "DOCX Recompress",
    panelLabel: "Pipeline",
    pipeline_0: "Browser reads local PDF",
    pipeline_1: "Web Worker takes over",
    pipeline_2: "Ghostscript WASM compress",
    pipeline_3: "QPDF WASM structure optimize",
    pipeline_4: "JSZip rewrites Office images",
    pipeline_5: "Browser generates download",
    panelFootnote:
      "Current release supports PDF compression, PDF structure optimization, and Office image recompression.",
    toolKicker: "Local Compression",
    toolTitle: "PDF / PPTX / DOCX Compression",
    dropzoneLabel: "Select PDF, PPTX or DOCX files",
    dropzoneTitle: "Drop PDF / PPTX / DOCX here, or click to select",
    dropzoneSubtitle:
      "Supports batch queue. Files are processed only inside this browser.",
    profileLabel: "Compression Profile",
    profileBalanced: "Balanced",
    profileStrong: "Strong",
    profileArchive: "Archive",
    structureLabel: "Enable PDF structure optimization (QPDF WASM)",
    compressButton: "Start Compression",
    summaryFiles: "{{count}} files",
    summaryTotal: "Total {{size}}",
    sideKicker: "Features",
    feature_pdf_title: "PDF Compression",
    feature_pdf_desc:
      "Main feature with batch queue, Ghostscript WASM and QPDF WASM.",
    feature_pptx_title: "PPTX Compression",
    feature_pptx_desc: "Unpack with JSZip, recompress images, then repack.",
    feature_docx_title: "DOCX Compression",
    feature_docx_desc:
      "Follows Office Open XML pipeline, focusing on embedded images.",
    feature_batch_title: "Batch Compression",
    feature_batch_desc:
      "Queue already supports multiple files; parallel execution and retry coming soon.",
    privacyTitle: "Local Processing",
    privacyText:
      "This version does not upload files to any server. PDF engine and Office image processing run inside the browser Worker.",
    statusPending: "Pending",
    messageQueued: "Added to queue, waiting to start.",
    emptyState:
      "Queue is empty. Currently accepts PDF, PPTX and DOCX files, multiple files supported.",
    statusCompressing: "Compressing",
    statusCompleted: "Completed",
    downloadFile: "Download",
    processingOffice:
      "JSZip unpacking {{kind}} ({{current}}/{{total}}), recompressing images at {{profile}} profile.",
    processingPdfOptimized:
      "Ghostscript compression followed by QPDF structure optimization ({{current}}/{{total}}), {{profile}} profile.",
    processingPdf:
      "Ghostscript WASM processing ({{current}}/{{total}}), {{profile}} profile.",
    errorBusy: "A compression task is already running, please try again later.",
    errorTimeout:
      "Compression timed out. Please retry or use a lower profile.",
    errorMsgChannel: "Worker message channel error, data could not be parsed.",
    errorPostFailed: "Worker communication failed.",
    errorReadFailed: "Failed to read file.",
    engineNotReady: "PDF compression engine is not ready.",
    engineLoading: "Loading compression engine",
    engineRestarted: "Compression engine restarted.",
    engineRestartCause: "{{cause}}, compression engine restarted.",
    workerError: "Worker error",
    workerMsgError: "Worker message channel error",
    invalidResult: "Invalid compression result, no savable output received.",
    saving: "Writing download file...",
    saved: "File saved locally.",
    saveFailedPrefix: "Save failed: ",
    saveDenied: "Browser denied file write.",
    langZh: "中文",
    langEn: "English",
    pageTitle: "Paper Squeeze — Local PDF, PPTX & DOCX Compression Tool",
    metaDescription:
      "Free browser-based local compression tool. Use Web Worker + WASM to compress PDF, PPTX and DOCX locally. Files are never uploaded to any server, protecting your privacy.",
    metaOgDescription:
      "Free browser-based local compression tool. Files are never uploaded to any server, protecting your privacy. Supports batch compression of PDF, PPTX, DOCX.",
    metaKeywords:
      "PDF compression,PPTX compression,DOCX compression,local compression,browser compression,image compression,reduce file size,online compression tool,privacy,no upload",
  },
};

let currentLang = "zh";

export const getLanguage = () => currentLang;

export const setLanguage = (lang) => {
  if (!dictionary[lang]) return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  refreshStaticText();
  refreshMeta();
};

export const initLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const lang = stored === "en" ? "en" : "zh";
  currentLang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  refreshStaticText();
  refreshMeta();
};

export const t = (key, vars = {}) => {
  let text = dictionary[currentLang][key] ?? dictionary.zh[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replaceAll(`{{${k}}}`, String(v));
  });
  return text;
};

export const refreshStaticText = () => {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr;
    const val = t(key);
    if (attr) {
      el.setAttribute(attr, val);
    } else {
      el.textContent = val;
    }
  });

  // Refresh JSON-LD language
  const ldScript = document.querySelector('script[type="application/ld+json"]');
  if (ldScript) {
    try {
      const data = JSON.parse(ldScript.textContent);
      data.inLanguage = currentLang === "zh" ? "zh-CN" : "en";
      ldScript.textContent = JSON.stringify(data, null, 2);
    } catch {
      // ignore parse errors
    }
  }
};

export const refreshMeta = () => {
  const descriptionEl = document.querySelector('meta[name="description"]');
  if (descriptionEl) {
    descriptionEl.setAttribute("content", t("metaDescription"));
  }

  const keywordsEl = document.querySelector('meta[name="keywords"]');
  if (keywordsEl) {
    keywordsEl.setAttribute("content", t("metaKeywords"));
  }

  const ogDescEl = document.querySelector('meta[property="og:description"]');
  if (ogDescEl) {
    ogDescEl.setAttribute("content", t("metaOgDescription"));
  }

  const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescEl) {
    twitterDescEl.setAttribute("content", t("metaOgDescription"));
  }
};
