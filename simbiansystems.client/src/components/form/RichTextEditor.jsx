import { useMemo, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  createEditorUploadAdapterPlugin,
  deleteOwnedEditorImage,
  extractImageSrcs,
} from '../../utils/ckeditorImageUpload';

export default function RichTextEditor({
  value = '',
  onChange,
  disabled = false,
  uploadFolder = 'products',
}) {
  const folderRef = useRef(uploadFolder);
  folderRef.current = uploadFolder;

  const trackedSrcsRef = useRef(new Set());

  const uploadAdapterPlugin = useMemo(
    () => createEditorUploadAdapterPlugin(() => folderRef.current),
    [],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white [&_.ck-editor]:text-sm [&_.ck-content]:px-3 [&_.ck-content_img]:h-auto [&_.ck-content_img]:max-w-full">
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        disabled={disabled}
        config={{
          extraPlugins: [uploadAdapterPlugin],
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'uploadImage',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'undo',
            'redo',
          ],
          // Always open links in a new tab (all hrefs, including relative).
          link: {
            decorators: {
              openInNewTab: {
                mode: 'automatic',
                callback: () => true,
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
              },
            },
          },
        }}
        onReady={(editor) => {
          trackedSrcsRef.current = extractImageSrcs(editor.getData());

          if (editor.__simbianImageDeleteBound) return;
          editor.__simbianImageDeleteBound = true;

          editor.model.document.on('change:data', () => {
            const next = extractImageSrcs(editor.getData());
            for (const src of trackedSrcsRef.current) {
              if (!next.has(src)) {
                void deleteOwnedEditorImage(src);
              }
            }
            trackedSrcsRef.current = next;
          });
        }}
        onChange={(_, editor) => onChange?.(editor.getData())}
      />
    </div>
  );
}
