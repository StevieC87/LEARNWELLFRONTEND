'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton.jsx';

// ── helpers ──────────────────────────────────────────────────────────────────

function getCsrfToken() {
    if (typeof document !== 'undefined') {
        return document.cookie
            .split('; ')
            .find((r) => r.startsWith('csrfToken='))
            ?.split('=')[1];
    }
    return null;
}

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'wysi', label: 'Rich Text (WYSIWYG)' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean (toggle)' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'select', label: 'Select (dropdown)' },
    { value: 'medialibrary', label: 'Media Library' },
    { value: 'relation', label: 'Relation' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' },
    { value: 'color', label: 'Color' },
    { value: 'blocks', label: 'Sections (blocks)' },
];

function toFieldName(str) {
    return str
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

const EMPTY_FIELD = {
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    disabled: false,
    options: { list: [] }, // for select
    relation: '',           // for relation
};

// ── FieldEditor panel ─────────────────────────────────────────────────────────

function FieldEditor({ field, isNew, onSave, onCancel, existingNames, blockTypes, isBlock }) {
    const [localField, setLocalField] = useState({ ...EMPTY_FIELD, ...field });
    const [nameError, setNameError] = useState('');
    const [optionInput, setOptionInput] = useState(''); // e.g. "Category 1|category1"

    const set = (key, value) => setLocalField((prev) => ({ ...prev, [key]: value }));

    const renamed = !isNew && field.name && localField.name !== field.name;
    const retyped = !isNew && field.type && localField.type !== field.type;

    const validate = () => {
        if (!localField.name) { setNameError('Name is required'); return false; }
        if (!/^[a-z][a-z0-9_]*$/.test(localField.name)) {
            setNameError('Only lowercase letters, numbers, underscores. Must start with a letter.');
            return false;
        }
        if (existingNames.includes(localField.name)) {
            setNameError('A field with this name already exists.');
            return false;
        }
        setNameError('');
        return true;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(localField);
    };

    const addOption = () => {
        const parts = optionInput.split('|');
        const title = parts[0]?.trim();
        const value = parts[1]?.trim() || toFieldName(parts[0] || '');
        if (!title) return;
        set('options', { list: [...(localField.options?.list || []), { title, value }] });
        setOptionInput('');
    };

    const removeOption = (idx) => {
        const list = [...(localField.options?.list || [])];
        list.splice(idx, 1);
        set('options', { list });
    };

    return (
        <div className="ui-card" style={{ background: 'var(--ui-subtle)' }}>
            <div className="ui-card-body">
                <div className="ct-grid">
                    <div className="ui-field">
                        <label className="ui-label" htmlFor="fe-label">Label</label>
                        <input
                            id="fe-label"
                            type="text"
                            className="ui-input"
                            value={localField.label}
                            onChange={(e) => {
                                // a new field's name follows the label until it's edited by hand
                                if (isNew && localField.name === toFieldName(localField.label)) set('name', toFieldName(e.target.value));
                                set('label', e.target.value);
                            }}
                            placeholder="e.g. Article title"
                        />
                    </div>

                    <div className="ui-field">
                        <label className="ui-label" htmlFor="fe-name">Field name (API)</label>
                        <input
                            id="fe-name"
                            type="text"
                            className="ui-input ui-mono"
                            value={localField.name}
                            onChange={(e) => { setNameError(''); set('name', toFieldName(e.target.value)); }}
                            placeholder="e.g. article_title"
                        />
                        {nameError
                            ? <p className="ui-status is-error">{nameError}</p>
                            : renamed && <p className="ui-status is-warning">Content saved under <code>{field.name}</code> moves to <code>{localField.name}</code>. Update your site&apos;s templates to the new name.</p>}
                    </div>

                    <div className="ui-field">
                        <label className="ui-label" htmlFor="fe-type">Type</label>
                        <select id="fe-type" className="ui-input" value={localField.type} onChange={(e) => set('type', e.target.value)}>
                            {FIELD_TYPES.filter((t) => !(isBlock && t.value === 'blocks')).map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        {retyped && <p className="ui-status is-warning">Existing content is kept as it is and may not fit the new type.</p>}
                    </div>

                    {/* Placeholder – only for text-like types */}
                    {['text', 'textarea', 'url', 'email'].includes(localField.type) && (
                        <div className="ui-field">
                            <label className="ui-label" htmlFor="fe-placeholder">Placeholder</label>
                            <input
                                id="fe-placeholder"
                                type="text"
                                className="ui-input"
                                value={localField.placeholder}
                                onChange={(e) => set('placeholder', e.target.value)}
                                placeholder="Hint shown in empty field"
                            />
                        </div>
                    )}

                    {/* Relation – only for relation type */}
                    {localField.type === 'relation' && (
                        <div className="ui-field">
                            <label className="ui-label" htmlFor="fe-relation">Relation collection</label>
                            <input
                                id="fe-relation"
                                type="text"
                                className="ui-input"
                                value={localField.relation}
                                onChange={(e) => set('relation', e.target.value)}
                                placeholder="e.g. users"
                            />
                        </div>
                    )}
                </div>

                {/* Sections – which block types can be added */}
                {localField.type === 'blocks' && (
                    <div className="ui-field">
                        <p className="ui-label">Section types allowed</p>
                        {blockTypes.length === 0 ? (
                            <p className="ui-note">No block types yet. Create a content type of kind &quot;Block&quot; (Hero, Text + image, FAQ…) first.</p>
                        ) : (
                            <>
                                <p className="ui-help">Leave all unticked to allow every block type.</p>
                                <div className="ui-actions">
                                    {blockTypes.map((b) => {
                                        const list = localField.blocks || [];
                                        return (
                                            <label key={b.apiname} className="ui-check">
                                                <input
                                                    type="checkbox"
                                                    checked={list.includes(b.apiname)}
                                                    onChange={(e) => set('blocks', e.target.checked ? [...list, b.apiname] : list.filter((x) => x !== b.apiname))}
                                                />
                                                {b.name}
                                            </label>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="ui-actions">
                    <label className="ui-check">
                        <input type="checkbox" checked={!!localField.required} onChange={(e) => set('required', e.target.checked)} />
                        Required
                    </label>
                    <label className="ui-check">
                        <input type="checkbox" checked={!!localField.disabled} onChange={(e) => set('disabled', e.target.checked)} />
                        Read-only
                    </label>
                </div>

                {/* Select options */}
                {localField.type === 'select' && (
                    <div className="ui-field">
                        <label className="ui-label" htmlFor="fe-option">Options</label>
                        <p className="ui-help">Type &quot;Label|value&quot; and press Add. The value is made from the label if you leave it out.</p>
                        <div className="ui-actions">
                            <input
                                id="fe-option"
                                type="text"
                                className="ui-input"
                                style={{ flex: 1 }}
                                value={optionInput}
                                onChange={(e) => setOptionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                                placeholder="Category One|category_one"
                            />
                            <button type="button" className="ui-btn ui-btn-secondary" onClick={addOption}>Add</button>
                        </div>
                        <div className="ui-actions">
                            {(localField.options?.list || []).map((opt, i) => (
                                <span key={i} className="ui-badge">
                                    {opt.title}
                                    <button type="button" className="ct-x" onClick={() => removeOption(i)} aria-label={`Remove ${opt.title}`}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="ui-actions">
                    <button type="button" className="ui-btn ui-btn-primary" onClick={handleSave}>{isNew ? 'Add field' : 'Save field'}</button>
                    <button type="button" className="ui-btn ui-btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

// ── FieldRow ──────────────────────────────────────────────────────────────────

// busy: an editor is open or a save is in flight. Moving or removing a row then would shift
// the index the open editor saves back to, so the edit would land on a different field.
function FieldRow({ field, locked, busy, index, total, onMoveUp, onMoveDown, onEdit, onDelete }) {
    const typeLabel = FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type;
    return (
        <div className="ct-row">
            <div className="ct-move">
                <button type="button" className="ui-btn ui-btn-sm ui-btn-icon" onClick={onMoveUp} disabled={locked || busy || index === 0} aria-label="Move up">▲</button>
                <button type="button" className="ui-btn ui-btn-sm ui-btn-icon" onClick={onMoveDown} disabled={locked || busy || index === total - 1} aria-label="Move down">▼</button>
            </div>

            <div className="ct-row-main">
                <div className="ui-actions" style={{ gap: '0.8rem' }}>
                    <strong>{field.label || field.name}</strong>
                    <span className="ui-badge">{typeLabel}</span>
                    {field.required && <span className="ui-badge is-danger">required</span>}
                    {locked && <span className="ui-badge">always first</span>}
                </div>
                <p className="ui-help ui-mono">{field.name}</p>
            </div>

            {!locked && (
                <div className="ui-actions">
                    <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={onEdit} disabled={busy}>Edit</button>
                    <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm" onClick={onDelete} disabled={busy}>Remove</button>
                </div>
            )}
        </div>
    );
}

// ── Main builder page ─────────────────────────────────────────────────────────

export default function ContentTypeBuilderPage() {
    const { id } = useParams();

    const [contentType, setContentType] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);
    const [error, setError] = useState(null);
    const [blockTypes, setBlockTypes] = useState([]);

    // editor state
    const [editingIndex, setEditingIndex] = useState(null); // null = closed, -1 = adding new
    const [editorField, setEditorField] = useState(null);

    // ── fetch ──────────────────────────────────────────────────────────────────
    const load = useCallback(async () => {
        try {
            // block types, for "Sections" fields: asked alongside the type, not
            // after it. Optional, so a failure leaves the list empty.
            const listRequest = fetch(`${process.env.NEXT_PUBLIC_API_URL}/contenttypes`, { credentials: 'include' })
                .catch(() => null);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contenttypes/${id}`,
                { credentials: 'include' }
            );
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setContentType(data.type);
            setFields(data.type.fields || []);
            const list = await listRequest;
            if (list?.ok) setBlockTypes(((await list.json()).types || []).filter((t) => t.type === 'block'));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);
    useEffect(() => { load(); }, [load]);

    // ── save all fields ────────────────────────────────────────────────────────
    const saveFields = useCallback(async (updatedFields) => {
        setSaving(true);
        setSaveMsg(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contenttypes/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': getCsrfToken(),
                    },
                    credentials: 'include',
                    body: JSON.stringify({ fields: updatedFields }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Save failed');
            const moved = (data.renamed || []).map((r) => `${r.from} → ${r.to}`).join(', ');
            setSaveMsg(moved ? `Saved. Content moved: ${moved}` : 'Saved');
            setTimeout(() => setSaveMsg(null), 4000);
        } catch (err) {
            setSaveMsg('Error: ' + err.message);
            load(); // show what's actually stored
        } finally {
            setSaving(false);
        }
    }, [id, load]);

    // ── field operations ───────────────────────────────────────────────────────
    // editableFields = everything except the locked title
    const titleField = fields.find((f) => f.name === 'title');
    const editableFields = fields.filter((f) => f.name !== 'title');
    const withTitle = (list) => (titleField ? [titleField, ...list] : list);

    const openAddField = () => {
        setEditingIndex(-1);
        setEditorField({ ...EMPTY_FIELD });
    };

    const openEditField = (index) => {
        // index is relative to editableFields
        setEditingIndex(index);
        setEditorField({ ...editableFields[index] });
    };

    const closeEditor = () => {
        setEditingIndex(null);
        setEditorField(null);
    };

    const commit = (updatedEditable) => {
        const updated = withTitle(updatedEditable);
        setFields(updated);
        saveFields(updated);
    };

    const handleSaveField = (savedField) => {
        commit(editingIndex === -1
            ? [...editableFields, savedField]
            : editableFields.map((f, i) => (i === editingIndex ? savedField : f)));
        closeEditor();
    };

    const handleDeleteField = (index) => {
        // index is relative to editableFields
        const name = editableFields[index].name;
        if (!confirm(`Remove field "${name}"? Content already saved in it stays on your pages but is no longer shown or edited.`)) return;
        commit(editableFields.filter((_, i) => i !== index));
    };

    const moveField = (index, direction) => {
        // index is relative to editableFields
        const updated = [...editableFields];
        const swap = index + direction;
        [updated[index], updated[swap]] = [updated[swap], updated[index]];
        commit(updated);
    };

    // ── existing names for uniqueness check ────────────────────────────────────
    const existingNames = fields
        .filter((f) => editingIndex === null || editingIndex < 0 || f !== editableFields[editingIndex])
        .map((f) => f.name);

    // ── render ─────────────────────────────────────────────────────────────────
    if (loading) return <div className="ct-page"><style>{CSS}</style><Skeleton kind="table" rows={6} cols={1} /></div>;
    if (error) return <div className="ct-page"><style>{CSS}</style><p className="ui-status is-error">{error}</p></div>;
    if (!contentType) return null;

    return (
        <div className="ct-page">
            <style>{CSS}</style>
            <Link href="/dash/customtype" className="ui-link ui-text-sm">← Content types</Link>

            <div className="ui-card">
                <div className="ui-card-head">
                    <div>
                        <h3>
                            {contentType.name}
                            <span className="ui-badge">{{ page: 'Page', repeatable: 'Repeatable', block: 'Block (section)' }[contentType.type] || contentType.type}</span>
                        </h3>
                        <p>
                            API name <code className="ui-mono">{contentType.apiname}</code>
                            {contentType.slugpath ? ` · path ${contentType.slugpath}` : ''}
                        </p>
                    </div>
                    {(saving || saveMsg) && (
                        <span className={`ui-status ${saveMsg?.startsWith('Error') ? 'is-error' : saveMsg ? 'is-success' : ''}`}>
                            {saving ? 'Saving…' : saveMsg}
                        </span>
                    )}
                </div>

                <div className="ui-card-body">
                    <div className="ct-list">
                        {titleField && <FieldRow field={titleField} locked index={0} total={1} />}

                        {editableFields.length === 0 && editingIndex !== -1 && (
                            <p className="ui-note">No custom fields yet. Add one to start building.</p>
                        )}

                        {editableFields.map((field, index) => (
                            <div key={field.id || field.name || index} className="ct-list">
                                <FieldRow
                                    field={field}
                                    busy={editingIndex !== null || saving}
                                    index={index}
                                    total={editableFields.length}
                                    onMoveUp={() => moveField(index, -1)}
                                    onMoveDown={() => moveField(index, 1)}
                                    onEdit={() => openEditField(index)}
                                    onDelete={() => handleDeleteField(index)}
                                />
                                {editingIndex === index && editorField && (
                                    <FieldEditor
                                        field={editorField}
                                        existingNames={existingNames}
                                        blockTypes={blockTypes}
                                        isBlock={contentType.type === 'block'}
                                        onSave={handleSaveField}
                                        onCancel={closeEditor}
                                    />
                                )}
                            </div>
                        ))}

                        {editingIndex === -1 && editorField && (
                            <FieldEditor
                                field={editorField}
                                isNew
                                existingNames={existingNames}
                                blockTypes={blockTypes}
                                isBlock={contentType.type === 'block'}
                                onSave={handleSaveField}
                                onCancel={closeEditor}
                            />
                        )}
                    </div>
                </div>

                {contentType.type === 'block' && (
                    <div className="ui-card-body" style={{ paddingTop: 0 }}>
                        <p className="ui-note">
                            A section pages can add in a &quot;Sections&quot; field. On the site, render it with a component for
                            &quot;{contentType.apiname}&quot; and mark its parts data-cms-field=&quot;sections.&lt;block id&gt;.&lt;field&gt;&quot;
                            for the visual editor.
                        </p>
                    </div>
                )}
                <div className="ui-card-foot">
                    {contentType.type !== 'block' && <Link href={`/dash/pages?pagetype=${contentType.type === 'page' ? 'page' : 'post'}`} className="ui-btn ui-btn-secondary">
                        View content
                    </Link>}
                    <button type="button" className="ui-btn ui-btn-primary" onClick={openAddField} disabled={editingIndex !== null}>
                        + Add field
                    </button>
                </div>
            </div>
        </div>
    );
}

const CSS = `
.ct-page { display: flex; flex-direction: column; gap: 1.6rem; max-width: 80rem; margin: 0 auto; padding: 2.4rem 1.6rem; }
.ct-list { display: flex; flex-direction: column; gap: 0.8rem; }
.ct-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr)); gap: 1.6rem; }
.ct-row { display: flex; align-items: center; gap: 1.2rem; padding: 1.2rem 1.4rem; border: 1px solid var(--ui-border); border-radius: var(--ui-radius); background: var(--ui-card); color: var(--ui-fg); }
.ct-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.ct-move { display: flex; flex-direction: column; gap: 0.4rem; }
.ct-move .ui-btn { height: 2.4rem; font-size: var(--ui-text-xs); }
.ct-x { margin-left: 0.6rem; border: 0; background: none; color: var(--ui-muted); cursor: pointer; font-size: var(--ui-text); line-height: 1; }
.ct-x:hover { color: var(--ui-danger); }
@media (max-width: 600px) { .ct-row { flex-wrap: wrap; } }
`;
