"use client";
import { useRouter } from "next/navigation";


export default function Showschemasnopages(props) {

  const { multilingual, defaultlanguage, pagetype, schemanopages } = props;
  const router = useRouter();

  if (pagetype !== "page" || schemanopages.length === 0) return null;

  function handleChange(e) {
    if (e.target.value) router.push(e.target.value);
  }

  return (
    <select
        defaultValue=""
        onChange={handleChange}
        aria-label="Create a page for a content type that has none"
        className="ui-input pageslist-create"
      >
        <option value="" disabled>
          New page for… ({schemanopages.length} without one)
        </option>
        {schemanopages.map((schema) => {
          const href = `/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language || defaultlanguage}`;
          const label = multilingual
            ? `${schema.schema} (${schema.language || defaultlanguage})`
            : schema.schema;
          return (
            <option key={`${schema.schema}${schema.language}`} value={href}>
              {label}
            </option>
          );
        })}
      </select>
  );
}