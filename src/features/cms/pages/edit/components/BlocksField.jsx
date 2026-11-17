'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, setHasChanges } from '@/redux/slices/PagesSlice';
import FieldRenderer from '../FieldRenderer';
import { allowedBlocks, blockDef, blockKey, blockActions } from '../blocks';

// A "blocks" field: the page's sections, in order. Each section's fields are
// edited with FieldRenderer under "<field>.<block id>.<block field>" (see ../blocks.js).
export default function BlocksField({ field, blocktypes }) {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.PagesSlice.fields);
  const stored = fields[field.name] || {};
  const blocks = Array.isArray(stored.content) ? stored.content : [];
  const options = allowedBlocks(field, blocktypes);
  const [adding, setAdding] = useState(options[0]?.apiname || '');
  const [open, setOpen] = useState(() => new Set());

  // the visual editor asks to open the section holding a clicked field
  useEffect(() => {
    const onOpen = (e) => {
      const name = String(e.detail || '');
      if (!name.startsWith(`${field.name}.`)) return;
      const id = name.split('.')[1];
      setOpen((s) => (s.has(id) ? s : new Set(s).add(id)));
    };
    window.addEventListener('cms:open-field', onOpen);
    return () => window.removeEventListener('cms:open-field', onOpen);
  }, [field.name]);

  const actions = blockActions({ dispatch, updateField, setHasChanges, fields, blocktypes });

  const add = () => {
    const id = actions.add(field.name, adding || options[0]?.apiname);
    if (id) setOpen((s) => new Set(s).add(id));
  };

  const move = (index, dir) => actions.move(field.name, blocks[index].id, dir);

  const remove = (index) => {
    const def = blockDef(blocktypes, blocks[index].type);
    if (!confirm(`Remove this ${def?.name || 'section'}?`)) return;
    actions.remove(field.name, blocks[index].id);
  };

  const toggle = (id) => setOpen((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  // first text value, to tell sections apart when closed
  const summary = (block, def) => {
    for (const sub of def?.fields || []) {
      const v = fields[blockKey(field.name, block.id, sub.name)]?.content;
      if (typeof v === 'string' && v.trim()) return v.replace(/<[^>]*>/g, '').slice(0, 60);
    }
    return '';
  };

  return (
    <div className="fielddivblock bf">
      <p className="ui-label">{field.label || field.name}</p>
      {options.length === 0 && (
        <p className="ui-note">No section types yet. Create a content type of kind &quot;Block&quot; (e.g. Hero, Text + image, FAQ) to add sections here.</p>
      )}

      {blocks.map((block, index) => {
        const def = blockDef(blocktypes, block.type);
        const isOpen = open.has(block.id);
        return (
          <div key={block.id} className="bf-block">
            <div className="bf-head">
              <button type="button" className="bf-title" onClick={() => toggle(block.id)} aria-expanded={isOpen}>
                <span className="bf-caret">{isOpen ? '▾' : '▸'}</span>
                <strong>{def?.name || block.type}</strong>
                {!def && <span className="ui-badge is-danger">type removed</span>}
                <span className="ui-help bf-sum">{summary(block, def)}</span>
              </button>
              <div className="ui-actions" style={{ gap: '0.4rem' }}>
                <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm ui-btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">▲</button>
                <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm ui-btn-icon" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label="Move down">▼</button>
                <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => remove(index)}>Remove</button>
              </div>
            </div>
            {isOpen && def && (
              <div className="bf-body">
                {def.fields.length === 0 && <p className="ui-help">This section type has no fields.</p>}
                {def.fields.map((sub) => {
                  const key = blockKey(field.name, block.id, sub.name);
                  const data = fields[key] || {};
                  return (
                    <FieldRenderer
                      key={key}
                      type={sub.type}
                      name={key}
                      label={sub.label || sub.name}
                      fielddata={data}
                      placeholder={sub.placeholder || ''}
                      value={data.content || ''}
                      options={sub.options?.list || []}
                      required={sub.required || false}
                      disabled={sub.disabled || false}
                      relation={sub.relation || ''}
                      onChange2={() => dispatch(setHasChanges(true))}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {options.length > 0 && (
        <div className="ui-actions">
          <select className="ui-input" style={{ width: 'auto' }} value={adding} onChange={(e) => setAdding(e.target.value)} aria-label="Section type">
            {options.map((b) => <option key={b.apiname} value={b.apiname}>{b.name}</option>)}
          </select>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={add}>+ Add section</button>
        </div>
      )}

      <style>{`
        .bf { display: flex; flex-direction: column; gap: 1rem; }
        .bf-block { border: 1px solid var(--ui-border); border-radius: var(--ui-radius); background: var(--ui-card); }
        .bf-head { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.2rem; }
        .bf-title { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.8rem; border: 0; background: none; color: var(--ui-fg); font-size: var(--ui-text); text-align: left; cursor: pointer; }
        .bf-caret { color: var(--ui-muted); width: 1.2rem; }
        .bf-sum { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bf-body { display: flex; flex-direction: column; gap: 1.2rem; padding: 0.4rem 1.6rem 1.6rem; border-top: 1px solid var(--ui-border); }
      `}</style>
    </div>
  );
}
