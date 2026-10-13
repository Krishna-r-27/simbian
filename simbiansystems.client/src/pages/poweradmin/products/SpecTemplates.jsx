import { useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import AdminToggle from '../../../components/ui/AdminToggle';
import { productService } from '../../../services/productService';
import { specService } from '../../../services/specService';
import { confirmDelete } from '../../../utils/confirm';
import { getApiErrorMessage } from '../../../utils/format';

function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function SpecTemplates() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [groups, setGroups] = useState([]);
  const [defs, setDefs] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [defName, setDefName] = useState('');

  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingDefId, setEditingDefId] = useState(null);
  const [editName, setEditName] = useState('');

  const [groupDragIndex, setGroupDragIndex] = useState(null);
  const [defDragIndex, setDefDragIndex] = useState(null);

  const groupsRef = useRef([]);
  const groupDragIndexRef = useRef(null);
  const groupOrderOriginRef = useRef('');

  const defsRef = useRef([]);
  const defDragIndexRef = useRef(null);
  const defOrderOriginRef = useRef('');

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
  const visibleDefs = (
    selectedGroupId
      ? defs.filter((d) => d.specificationGroupId === selectedGroupId)
      : defs
  ).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id);

  groupsRef.current = groups;
  defsRef.current = visibleDefs;

  const addGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const created = await specService.groups.create({
        name: groupName.trim(),
        isActive: true,
      });
      setGroupName('');
      await load();
      if (created?.id) setSelectedGroupId(created.id);
      toast.success('Group added.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
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
    try {
      await specService.definitions.create({
        name: defName.trim(),
        categoryId: +categoryId,
        specificationGroupId: selectedGroupId,
        controlType: 0,
      });
      setDefName('');
      await load();
      toast.success('Definition added.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const startEditGroup = (group, e) => {
    e.stopPropagation();
    setEditingDefId(null);
    setEditingGroupId(group.id);
    setEditName(group.name);
  };

  const startEditDef = (def) => {
    setEditingGroupId(null);
    setEditingDefId(def.id);
    setEditName(def.name);
  };

  const cancelEdit = () => {
    setEditingGroupId(null);
    setEditingDefId(null);
    setEditName('');
  };

  const saveGroupName = async (group) => {
    const name = editName.trim();
    if (!name) {
      toast.error('Group name is required.');
      return;
    }
    try {
      await specService.groups.update(group.id, {
        name,
        displayOrder: group.displayOrder,
        isActive: group.isActive,
      });
      cancelEdit();
      await load();
      toast.success('Group updated.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const saveDefName = async (def) => {
    const name = editName.trim();
    if (!name) {
      toast.error('Definition name is required.');
      return;
    }
    try {
      await specService.definitions.update(def.id, {
        name,
        categoryId: def.categoryId,
        specificationGroupId: def.specificationGroupId,
        displayOrder: def.displayOrder,
        controlType: def.controlType,
        isRequired: def.isRequired,
        options: def.options || [],
      });
      cancelEdit();
      await load();
      toast.success('Definition updated.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const setGroupActive = async (group, isActive) => {
    try {
      await specService.groups.update(group.id, {
        name: group.name,
        displayOrder: group.displayOrder,
        isActive,
      });
      setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, isActive } : g)));
      toast.success(isActive ? 'Group activated.' : 'Group deactivated.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const removeGroup = async (group) => {
    if (!(await confirmDelete(group.name))) return;
    try {
      await specService.groups.delete(group.id);
      if (editingGroupId === group.id) cancelEdit();
      toast.success('Deleted.');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const removeDefinition = async (def) => {
    if (!(await confirmDelete(def.name))) return;
    try {
      await specService.definitions.delete(def.id);
      if (editingDefId === def.id) cancelEdit();
      toast.success('Deleted.');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const persistGroupOrder = async (next) => {
    try {
      await specService.groups.reorder(next.map((g) => g.id));
      setGroups(next.map((g, i) => ({ ...g, displayOrder: i + 1 })));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save group order.'));
      await load();
    }
  };

  const persistDefOrder = async (next) => {
    try {
      await specService.definitions.reorder(next.map((d) => d.id));
      const orderMap = new Map(next.map((d, i) => [d.id, i + 1]));
      setDefs((prev) =>
        prev.map((d) => (orderMap.has(d.id) ? { ...d, displayOrder: orderMap.get(d.id) } : d)),
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save definition order.'));
      await load();
    }
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
          <p className="mb-2 text-xs text-slate-500">Drag to reorder · saved when you drop</p>
          {groups.map((g, index) => (
            <div
              key={g.id}
              draggable={editingGroupId !== g.id}
              onDragStart={(e) => {
                if (editingGroupId === g.id) {
                  e.preventDefault();
                  return;
                }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
                groupOrderOriginRef.current = groupsRef.current.map((x) => x.id).join(',');
                groupDragIndexRef.current = index;
                setGroupDragIndex(index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const from = groupDragIndexRef.current;
                if (from === null || from === index) return;
                const next = moveItem(groupsRef.current, from, index);
                groupDragIndexRef.current = index;
                groupsRef.current = next;
                setGroups(next);
                setGroupDragIndex(index);
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => {
                const next = groupsRef.current;
                groupDragIndexRef.current = null;
                setGroupDragIndex(null);
                if (next.map((x) => x.id).join(',') !== groupOrderOriginRef.current) {
                  persistGroupOrder(next);
                }
              }}
              className={`flex cursor-pointer items-center gap-2 border-t px-2 py-3 ${
                g.id === selectedGroupId ? 'bg-slate-100' : 'hover:bg-slate-50'
              } ${groupDragIndex === index ? 'opacity-50' : ''} ${!g.isActive ? 'opacity-60' : ''}`}
              onClick={() => setSelectedGroupId(g.id)}
            >
              <span
                className="cursor-grab text-slate-400 active:cursor-grabbing"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4" />
              </span>

              {editingGroupId === g.id ? (
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    className="admin-input min-w-0 flex-1 py-1.5"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveGroupName(g);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button type="button" className="text-sm font-medium text-primary" onClick={() => saveGroupName(g)}>
                    Save
                  </button>
                  <button type="button" className="text-sm text-slate-500" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="min-w-0 flex-1 truncate">{g.name}</span>
              )}

              <div className="flex shrink-0 items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <AdminToggle
                  checked={!!g.isActive}
                  label={`Active ${g.name}`}
                  onChange={(next) => setGroupActive(g, next)}
                />
                {editingGroupId !== g.id && (
                  <button type="button" className="text-primary" onClick={(e) => startEditGroup(g, e)}>
                    Edit
                  </button>
                )}
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
          {selectedGroupId && visibleDefs.length > 0 && (
            <p className="mb-2 text-xs text-slate-500">Drag to reorder · saved when you drop</p>
          )}
          {visibleDefs.map((d, index) => (
            <div
              key={d.id}
              draggable={editingDefId !== d.id}
              onDragStart={(e) => {
                if (editingDefId === d.id) {
                  e.preventDefault();
                  return;
                }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
                defOrderOriginRef.current = defsRef.current.map((x) => x.id).join(',');
                defDragIndexRef.current = index;
                setDefDragIndex(index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const from = defDragIndexRef.current;
                if (from === null || from === index) return;
                const next = moveItem(defsRef.current, from, index);
                defDragIndexRef.current = index;
                defsRef.current = next;
                const orderMap = new Map(next.map((item, i) => [item.id, i + 1]));
                setDefs((prev) =>
                  prev.map((item) =>
                    orderMap.has(item.id) ? { ...item, displayOrder: orderMap.get(item.id) } : item,
                  ),
                );
                setDefDragIndex(index);
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => {
                const next = defsRef.current;
                defDragIndexRef.current = null;
                setDefDragIndex(null);
                if (next.map((x) => x.id).join(',') !== defOrderOriginRef.current) {
                  persistDefOrder(next);
                }
              }}
              className={`flex items-center gap-2 border-t py-3 ${
                defDragIndex === index ? 'opacity-50' : ''
              }`}
            >
              <span className="cursor-grab text-slate-400 active:cursor-grabbing" title="Drag to reorder">
                <GripVertical className="h-4 w-4" />
              </span>

              {editingDefId === d.id ? (
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <input
                    className="admin-input min-w-0 flex-1 py-1.5"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveDefName(d);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button type="button" className="text-sm font-medium text-primary" onClick={() => saveDefName(d)}>
                    Save
                  </button>
                  <button type="button" className="text-sm text-slate-500" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="min-w-0 flex-1">
                  {d.name}
                  {!categoryId && d.categoryName ? (
                    <span className="ml-2 text-xs text-slate-400">({d.categoryName})</span>
                  ) : null}
                </span>
              )}

              <div className="flex shrink-0 items-center gap-3">
                {editingDefId !== d.id && (
                  <button type="button" className="text-primary" onClick={() => startEditDef(d)}>
                    Edit
                  </button>
                )}
                <button type="button" className="text-red-600" onClick={() => removeDefinition(d)}>
                  Delete
                </button>
              </div>
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
