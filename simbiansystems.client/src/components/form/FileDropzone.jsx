import { useCallback, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PictureImage from '../ui/PictureImage';
import { uploadService } from '../../services/uploadService';
import { getApiErrorMessage } from '../../utils/format';
import {
  ALLOWED_IMAGE_ACCEPT,
  IMAGE_UPLOAD_HINT,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from '../../utils/imageUpload';

const PDF_ACCEPT = 'application/pdf,.pdf';
const PDF_HINT = 'PDF up to 10MB';
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function validatePdfFile(file, maxBytes = MAX_PDF_BYTES) {
  if (!file) return 'PDF file is required.';
  const ok =
    file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  if (!ok) return 'Only PDF files are allowed.';
  if (file.size > maxBytes) return 'PDF must be 10MB or smaller.';
  return null;
}

export default function FileDropzone({
  label = 'Upload image',
  accept,
  multiple = false,
  value,
  previewBasePath,
  onFiles,
  onClear,
  hint,
  maxBytes,
  pdf = false,
  deleteFromServer = true,
}) {
  const resolvedAccept = accept ?? (pdf ? PDF_ACCEPT : ALLOWED_IMAGE_ACCEPT);
  const resolvedHint = hint ?? (pdf ? PDF_HINT : IMAGE_UPLOAD_HINT);
  const resolvedMaxBytes = maxBytes ?? (pdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const busy = uploading || clearing;
  const previewPath = previewBasePath || (!pdf && typeof value === 'string' ? value : '');
  const pdfPath = pdf && typeof value === 'string' ? value : '';

  const reportProgress = useCallback((pct) => {
    setProgress(Math.max(0, Math.min(100, Math.round(pct))));
  }, []);

  const removeServerImage = useCallback(
    async (basePath) => {
      if (!deleteFromServer || !basePath || pdf) return;
      await uploadService.deleteImage(basePath);
    },
    [deleteFromServer, pdf],
  );

  const handleClear = useCallback(async () => {
    if (!onClear || busy) return;

    setError('');
    setClearing(true);
    try {
      await removeServerImage(previewPath);
      await onClear();
    } catch (e) {
      const message = getApiErrorMessage(e, 'Could not delete file.');
      setError(message);
      toast.error(message);
    } finally {
      setClearing(false);
    }
  }, [busy, onClear, previewPath, removeServerImage]);

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length || busy) return;

      setError('');

      for (const file of files) {
        const validationError = pdf
          ? validatePdfFile(file, resolvedMaxBytes)
          : validateImageFile(file, resolvedMaxBytes);
        if (validationError) {
          setError(validationError);
          toast.error(validationError);
          return;
        }
      }

      if (!onFiles) return;

      const previousPath = previewPath;
      setUploading(true);
      setProgress(2);

      try {
        await onFiles(multiple ? files : files[0], reportProgress);
        setProgress(100);

        if (previousPath && !multiple && !pdf) {
          try {
            await removeServerImage(previousPath);
          } catch {
            // New upload succeeded; orphan cleanup failure should not block the UI.
          }
        }
      } catch (e) {
        const message = getApiErrorMessage(e, 'Upload failed.');
        setError(message);
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [busy, multiple, onFiles, pdf, previewPath, removeServerImage, reportProgress, resolvedMaxBytes],
  );

  const fileName = (path) => path?.split('/').pop() || path;

  return (
    <div>
      {label ? <label className="admin-label">{label}</label> : null}
      <div
        className={`relative rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
          busy
            ? 'pointer-events-none border-primary bg-primary/5'
            : dragging
              ? 'border-primary bg-primary/5'
              : error
                ? 'border-red-300 bg-red-50/40'
                : 'border-slate-300 bg-slate-50/80'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {previewPath && !uploading && !pdf ? (
          <div className="mb-4 flex justify-center">
            <PictureImage
              imageBasePath={previewPath}
              alt="Preview"
              className="h-20 w-28 rounded-xl border border-slate-200 bg-white"
            />
          </div>
        ) : null}

        {pdfPath && !uploading ? (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-700">
            <FileText className="h-5 w-5 text-primary" />
            <a href={pdfPath} target="_blank" rel="noreferrer" className="admin-link truncate max-w-[14rem]">
              {fileName(pdfPath)}
            </a>
          </div>
        ) : null}

        <Upload className={`mx-auto mb-2 h-8 w-8 text-primary ${busy ? 'animate-pulse' : ''}`} />
        <p className="text-sm font-medium text-slate-700">
          {clearing ? (
            'Deleting…'
          ) : uploading ? (
            `Uploading… ${progress}%`
          ) : (
            <>
              Drag & drop or{' '}
              <label className="cursor-pointer text-primary underline">
                browse
                <input
                  type="file"
                  accept={resolvedAccept}
                  multiple={multiple}
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-slate-500">{resolvedHint}</p>

        {uploading ? (
          <div className="mx-auto mt-4 w-full max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {progress < 30 ? 'Preparing…' : progress < 92 ? 'Uploading…' : 'Processing…'}
            </p>
          </div>
        ) : null}

        {(previewPath || pdfPath) && onClear && !uploading ? (
          <button
            type="button"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-white disabled:opacity-60"
            onClick={handleClear}
            disabled={clearing}
            aria-label="Clear file"
          >
            {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
