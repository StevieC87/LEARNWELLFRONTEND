// Blocks (sections): a "blocks" field holds [{ id, type: <block apiname>, values: { <field>: content } }].
// While editing, each block field lives in redux under its own name, "<field>.<block id>.<block field>",
// so FieldRenderer (rich text, media picker...) works unchanged; the site marks the same name
// with data-cms-field for the visual editor. On save they're folded back into the list.

export const blockKey = (field, id, sub) => `${field}.${id}.${sub}`;

export const newBlockId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const blockDef = (blocktypes, type) => (blocktypes || []).find((b) => b.apiname === type);

// block types a field may hold (field.blocks empty = all)
export const allowedBlocks = (field, blocktypes) =>
  (blocktypes || []).filter((b) => !field.blocks?.length || field.blocks.includes(b.apiname));

// saved list -> one redux field per block field
export function unfoldBlocks(field, blocks, blocktypes) {
  const out = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    for (const sub of blockDef(blocktypes, block.type)?.fields || []) {
      out.push({ name: blockKey(field, block.id, sub.name), type: sub.type, content: block.values?.[sub.name] ?? '', label: sub.label || sub.name, placeholder: sub.placeholder || '' });
    }
  }
  return out;
}

// redux fields -> what's sent on save: block values folded in, the per-block names left out
export function foldBlocks(fieldData, schemaFields, blocktypes) {
  const blockFields = (schemaFields || []).filter((f) => f.type === 'blocks').map((f) => f.name);
  if (blockFields.length === 0) return fieldData;
  const out = {};
  for (const [name, value] of Object.entries(fieldData || {})) {
    if (blockFields.some((b) => name.startsWith(`${b}.`))) continue;
    out[name] = value;
  }
  for (const name of blockFields) {
    const blocks = Array.isArray(fieldData?.[name]?.content) ? fieldData[name].content : [];
    out[name] = {
      ...(fieldData?.[name] || { name }),
      type: 'blocks',
      content: blocks.map((block) => ({
        id: block.id,
        type: block.type,
        values: Object.fromEntries((blockDef(blocktypes, block.type)?.fields || []).map((sub) => {
          const live = fieldData?.[blockKey(name, block.id, sub.name)];
          return [sub.name, live ? live.content : block.values?.[sub.name] ?? null];
        })),
      })),
    };
  }
  return out;
}

// for the visual editor: the type of every field name, block fields included
export function previewTypes(schemaFields, fieldData, blocktypes) {
  const types = {};
  for (const f of schemaFields || []) {
    types[f.name] = f.type;
    if (f.type !== 'blocks') continue;
    for (const block of Array.isArray(fieldData?.[f.name]?.content) ? fieldData[f.name].content : []) {
      for (const sub of blockDef(blocktypes, block.type)?.fields || []) types[blockKey(f.name, block.id, sub.name)] = sub.type;
    }
  }
  return types;
}

// order and kinds of sections - when it changes the page needs a save to show it
export const blocksLayout = (schemaFields, fieldData) =>
  (schemaFields || []).filter((f) => f.type === 'blocks')
    .map((f) => (Array.isArray(fieldData?.[f.name]?.content) ? fieldData[f.name].content : []).map((b) => `${b.type}:${b.id}`).join(','))
    .join('|');

//. SECTION ACTIONS - shared by the side panel (BlocksField) and the on-page toolbar (VisualPreview)
// fields: redux PagesSlice.fields; dispatch, updateField, setHasChanges passed in to keep this file plain
export function blockActions({ dispatch, updateField, setHasChanges, fields, blocktypes }) {
  const listOf = (field) => (Array.isArray(fields?.[field]?.content) ? fields[field].content : []);
  const setList = (field, next) => {
    dispatch(updateField({ ...(fields?.[field] || {}), name: field, type: 'blocks', content: next }));
    dispatch(setHasChanges(true));
  };
  const makeFields = (field, id, def, values = {}) => {
    for (const sub of def.fields) {
      dispatch(updateField({ name: blockKey(field, id, sub.name), type: sub.type, content: values[sub.name] ?? '', label: sub.label || sub.name, placeholder: sub.placeholder || '' }));
    }
  };
  return {
    // returns the new block's id
    add(field, type, afterId) {
      const def = blockDef(blocktypes, type);
      if (!def) return null;
      const id = newBlockId();
      makeFields(field, id, def);
      const list = listOf(field);
      const at = afterId ? list.findIndex((b) => b.id === afterId) + 1 : list.length;
      setList(field, [...list.slice(0, at || list.length), { id, type, values: {} }, ...list.slice(at || list.length)]);
      return id;
    },
    move(field, id, dir) {
      const list = [...listOf(field)];
      const i = list.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
      setList(field, list);
    },
    remove(field, id) {
      setList(field, listOf(field).filter((b) => b.id !== id));
    },
    duplicate(field, id) {
      const list = listOf(field);
      const i = list.findIndex((b) => b.id === id);
      const def = blockDef(blocktypes, list[i]?.type);
      if (!def) return null;
      const copy = newBlockId();
      const values = Object.fromEntries(def.fields.map((sub) => [sub.name, fields?.[blockKey(field, id, sub.name)]?.content ?? list[i].values?.[sub.name] ?? '']));
      makeFields(field, copy, def, values);
      setList(field, [...list.slice(0, i + 1), { id: copy, type: def.apiname, values }, ...list.slice(i + 1)]);
      return copy;
    },
  };
}
