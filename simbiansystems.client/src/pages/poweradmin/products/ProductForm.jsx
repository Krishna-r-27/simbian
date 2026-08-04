import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import AdminToggle from '../../../components/ui/AdminToggle';
import PictureImage from '../../../components/ui/PictureImage';
import FileDropzone from '../../../components/form/FileDropzone';
import RichTextEditor from '../../../components/form/RichTextEditor';
import { productService } from '../../../services/productService';
import { uploadService } from '../../../services/uploadService';
import { specService } from '../../../services/specService';
import { getApiErrorMessage } from '../../../utils/format';

const empty = {
  categoryId: '',
  name: '',
  shortDescription: '',
  description: '',
  featuredImage: '',
  galleryImages: [],
  brochure: '',
  brand: '',
  modelNumber: '',
  warranty: '',
  displayOrder: 0,
  isPublished: false,
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  specifications: [],
};

function toBasePath(uploaded) {
  return (
    uploaded?.basePath ||
    uploaded?.BasePath ||
    uploaded?.webpPath?.replace(/\.webp$/i, '') ||
    uploaded ||
    ''
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const edit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productService.categories().then(setCategories);
    if (edit) productService.get(id).then(setForm);
  }, [id, edit]);

  useEffect(() => {
    if (!form.categoryId) return;
    specService.template(form.categoryId).then((g) => {
      setGroups(g);
      setForm((f) => ({
        ...f,
        specifications: g
          .flatMap((x) => x.fields || [])
          .map(
            (d) =>
              f.specifications?.find((s) => s.specificationDefinitionId === d.id) || {
                specificationDefinitionId: d.id,
                value: '',
              },
          ),
      }));
    });
  }, [form.categoryId]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (edit) await productService.update(id, form);
      else await productService.create(form);
      toast.success(`Product ${edit ? 'updated' : 'created'}.`);
      nav('/poweradmin/products');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={edit ? 'Edit product' : 'Add product'}
        backTo="/poweradmin/products"
        action={
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>Published</span>
            <AdminToggle
              checked={!!form.isPublished}
              label="Published"
              onChange={(next) => set('isPublished', next)}
            />
          </label>
        }
      />
      <form onSubmit={save} className="space-y-5">
        <section className="admin-card grid gap-4 p-5 md:grid-cols-2">
          <div>
            <label className="admin-label">Category</label>
            <select
              className="admin-input"
              required
              value={form.categoryId}
              onChange={(e) => set('categoryId', +e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">Product name</label>
            <input
              className="admin-input"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Brand</label>
            <input
              className="admin-input"
              value={form.brand || ''}
              onChange={(e) => set('brand', e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Model number</label>
            <input
              className="admin-input"
              value={form.modelNumber || ''}
              onChange={(e) => set('modelNumber', e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Display order</label>
            <input
              className="admin-input"
              type="number"
              value={form.displayOrder || 0}
              onChange={(e) => set('displayOrder', +e.target.value)}
            />
          </div>
        </section>

        <section className="admin-card p-5">
          <h2 className="mb-3 font-semibold">Description</h2>
          <RichTextEditor
            value={form.description}
            onChange={(v) => set('description', v)}
            uploadFolder="products"
          />
        </section>

        <section className="admin-card grid gap-5 p-5 md:grid-cols-3">
          <FileDropzone
            label="Featured image"
            previewBasePath={form.featuredImage}
            onFiles={async (file, onProgress) => {
              const uploaded = await uploadService.uploadImage(file, 'products', { onProgress });
              set('featuredImage', toBasePath(uploaded));
            }}
            onClear={() => set('featuredImage', '')}
          />

          <div>
            <FileDropzone
              label="Gallery (max 12)"
              multiple
              previewBasePath=""
              hint="PNG, JPG or WEBP up to 10MB · max 12 images"
              onFiles={async (files, onProgress) => {
                const remaining = Math.max(0, 12 - (form.galleryImages?.length || 0));
                if (remaining === 0) {
                  toast.error('Maximum of 12 gallery images allowed.');
                  return;
                }
                const batch = (Array.isArray(files) ? files : [files]).slice(0, remaining);
                const uploaded = await Promise.all(
                  batch.map((file) => uploadService.uploadImage(file, 'products', { onProgress })),
                );
                set(
                  'galleryImages',
                  [...(form.galleryImages || []), ...uploaded.map(toBasePath)].slice(0, 12),
                );
              }}
            />
            {form.galleryImages?.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.galleryImages.map((path) => (
                  <div key={path} className="relative aspect-square">
                    <PictureImage
                      imageBasePath={path}
                      alt="Gallery"
                      className="h-full w-full rounded-lg border border-slate-200 bg-slate-50"
                      imgClassName="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs leading-none text-white shadow"
                      onClick={async () => {
                        try {
                          await uploadService.deleteImage(path);
                        } catch {
                          /* best-effort */
                        }
                        set(
                          'galleryImages',
                          form.galleryImages.filter((p) => p !== path),
                        );
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <FileDropzone
            label="Brochure PDF"
            pdf
            value={form.brochure}
            onFiles={async (file, onProgress) => {
              const uploaded = await uploadService.uploadPdf(file, 'products', { onProgress });
              set('brochure', typeof uploaded === 'string' ? uploaded : uploaded?.path || uploaded?.basePath || '');
            }}
            onClear={() => set('brochure', '')}
          />
        </section>

        {groups.length > 0 && (
          <section className="admin-card p-5">
            <h2 className="mb-3 font-semibold">Specifications</h2>
            {groups.map((g) => (
              <details key={g.groupId} open className="mb-3 rounded border p-3">
                <summary className="cursor-pointer font-medium">{g.groupName}</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {(g.fields || []).map((d) => {
                    const spec = form.specifications.find((s) => s.specificationDefinitionId === d.id) || {};
                    return (
                      <label key={d.id} className="text-sm">
                        {d.name}
                        <input
                          className="admin-input mt-1"
                          value={spec.value || ''}
                          onChange={(e) =>
                            set(
                              'specifications',
                              form.specifications.map((s) =>
                                s.specificationDefinitionId === d.id
                                  ? { ...s, value: e.target.value }
                                  : s,
                              ),
                            )
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </details>
            ))}
          </section>
        )}

        <section className="admin-card grid gap-3 p-5 md:grid-cols-3">
          <h2 className="md:col-span-3 font-semibold">SEO</h2>
          {[
            ['seoTitle', 'SEO title'],
            ['seoKeywords', 'SEO keywords'],
            ['seoDescription', 'SEO description'],
          ].map(([k, l]) => (
            <label key={k} className="text-sm">
              {l}
              <textarea
                className="admin-input mt-1"
                value={form[k] || ''}
                onChange={(e) => set(k, e.target.value)}
              />
            </label>
          ))}
        </section>

        <button className="admin-button" disabled={loading}>
          {loading ? 'Saving…' : 'Save product'}
        </button>
      </form>
    </>
  );
}
