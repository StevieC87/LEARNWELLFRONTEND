'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageTitle from "@/components/layout/PageTitle.jsx";
export default function Shared() {

  const [missingSchemas, setMissingSchemas] = useState([]);
  const [existingSchemas, setExistingSchemas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let datais;
    const fetchSharedSchemas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shared/getschemas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This is important for cookies to be sent
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMissingSchemas(data.schemaswithoutdbrecord);
        setExistingSchemas(data.schemaswithdbrecord);
      } catch (error) {
        console.log('Error fetching shared schemas:', error);
      }
      setLoaded(true);
    };

    fetchSharedSchemas();


  }, []);


  // Made ones first, then the blocks with nothing written yet, in one list.
  const rows = [
    ...existingSchemas.map((schema) => ({ ...schema, key: schema.id, made: true,
      href: `/dash/shared/${schema.id}?schema=${schema.schema}&locale=${schema.locale}` })),
    ...missingSchemas.map((schema) => ({ ...schema, key: `${schema.schema}${schema.locale}`, made: false,
      href: `/dash/shared/newshared?schema=${schema.schema}&locale=${schema.locale}` })),
  ];

  return (
    <div className="ui-page">
      <PageTitle icon="page" title="Shared components">Content that appears on more than one page, edited once.</PageTitle>
      {loaded && (
        <section className="ui-card">
          {rows.length === 0 ? (
            <div className="ui-card-body ui-empty">
              {/* The components are the site's schema files (backend Schemas/Shared). */}
              <p className="ui-help">No shared components yet.</p>
            </div>
          ) : (
            <div className="ui-card-body">
              <table className="ui-table">
                <thead>
                  <tr><th>Component</th><th>Language</th><th><span className="sr-only">Actions</span></th></tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td>
                        {row.made ? <Link href={row.href}>{row.schema}</Link> : row.schema}
                        {!row.made && <span className="ui-cell-sub">Not written yet</span>}
                      </td>
                      <td>{row.locale}</td>
                      <td className="ui-cell-actions">
                        <Link href={row.href} className="ui-btn ui-btn-quiet ui-btn-sm">{row.made ? 'Edit' : 'Create'}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
