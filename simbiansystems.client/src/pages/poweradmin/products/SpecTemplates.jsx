import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import { productService } from '../../../services/productService';
import { specService } from '../../../services/specService';
import { confirmDelete } from '../../../utils/confirm';

export default function SpecTemplates() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [groups, setGroups] = useState([]);
  const [defs, setDefs] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [defName, setDefName] = useState('');

  const load = async () => {
    const [nextGroups, nextDefs] = await Promise.all([
      specService.groups.list(),
      specService.definitions.list(categoryId ? { categoryId } : {}),
    ]);
    setGroups(nextGroups);
    setDefs(nextDefs);
    setSelectedGroupId((prev) => {
      if (prev && nextGroups.some((g) => g.id === prev)) return prev;
      return nextGroups[0]?.id ?? null;
    });
  };

  useEffect(() => {
    productService.categories().then(setCategories);
  }, []);

  useEffect(() => {
    load();
  }, [categoryId]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;
  const visibleDefs = selectedGroupId
    ? defs.filter((d) => d.specificationGroupId === selectedGroupId)
    : defs;

  const addGroup = async () => {
    if (!groupName.trim()) return;
    const created = await specService.groups.create({ name: groupName.trim() });
    setGroupName('');
    await load();
    if (created?.id) setSelectedGroupId(created.id);
    toast.success('Group added.');
  };

  const addDefinition = async () => {
    if (!defName.trim()) return;
    if (!categoryId) {
      toast.error('Select a category before adding a definition.');
      return;
    }
    if (!selectedGroupId) {
      toast.error('Select a group before adding a definition.');
      return;
    }
    await specService.definitions.create({
      name: defName.trim(),
      categoryId: +categoryId,
      specificationGroupId: selectedGroupId,
      controlType: 0,
    });
    setDefName('');
    await load();
    toast.success('Definition added.');
  };

  const removeGroup = async (group) => {
    if (!(await confirmDelete(group.name))) return;
    await specService.groups.delete(group.id);
    toast.success('Deleted.');
    await load();
  };

  const removeDefinition = async (def) => {
    if (!(await confirmDelete(def.name))) return;
    await specService.definitions.delete(def.id);
    toast.success('Deleted.');
    await load();
  };

  return (
    <>
      <PageHeader title="Spec Templates" description="Create reusable specification groups and fields." />
      <div className="admin-card mb-5 p-4">
        <label className="admin-label">Category filter</label>
        <select
          className="admin-input max-w-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="admin-card p-5">
          <h2 className="mb-3 font-semibold">Groups</h2>
          <div className="mb-4 flex gap-2">
            <input
              className="admin-input"
              placeholder="New group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGroup()}
            />
            <button type="button" className="admin-button" onClick={addGroup}>
              Add
            </button>
          </div>
          {groups.map((g) => (
            <div
              key={g.id}
              className={`flex cursor-pointer items-center justify-between border-t px-2 py-3 ${
                g.id === selectedGroupId ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
              onClick={() => setSelectedGroupId(g.id)}
            >
              <span>{g.name}</span>
              <button
                type="button"
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  removeGroup(g);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </section>

        <section className="admin-card p-5">
          <h2 className="mb-3 font-semibold">
            Definitions{selectedGroup ? ` · ${selectedGroup.name}` : ''}
          </h2>
          <div className="mb-4 flex gap-2">
            <input
              className="admin-input"
              placeholder="New definition name"
              value={defName}
              onChange={(e) => setDefName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDefinition()}
              disabled={!selectedGroupId}
            />
            <button
              type="button"
              className="admin-button"
              onClick={addDefinition}
              disabled={!selectedGroupId}
            >
              Add
            </button>
          </div>
          {!selectedGroupId && (
            <p className="text-sm text-slate-500">Select or create a group to manage definitions.</p>
          )}
          {visibleDefs.map((d) => (
            <div className="flex justify-between border-t py-3" key={d.id}>
              <span>
                {d.name}
                {!categoryId && d.categoryName ? (
                  <span className="ml-2 text-xs text-slate-400">({d.categoryName})</span>
                ) : null}
              </span>
              <button type="button" className="text-red-600" onClick={() => removeDefinition(d)}>
                Delete
              </button>
            </div>
          ))}
          {selectedGroupId && visibleDefs.length === 0 && (
            <p className="border-t py-3 text-sm text-slate-500">No definitions in this group yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
