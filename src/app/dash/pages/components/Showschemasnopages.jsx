import Link from "next/link";


export default function Showschemasnopages(props) {

  const { multilingual, defaultlanguage, pagetype, schemanopages } = props;

  return (
    <>
      {(pagetype === "page" && schemanopages.length > 0) && (
        <span>Schemas without pages:</span>
      )}
      {pagetype === "page" && schemanopages.length > 0 && schemanopages.map((schema, index) => (
        <div key={`${schema.schema}${schema.language}`} data-key={`${schema.schema}${schema.language} `} className="pageitem pt-2 flex flex-row gap-10">
          <div className="flex flex-col">
            {multilingual && (
              <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language || defaultlanguage}`} className="underline">{schema.schema} {schema.language}</Link>
            )}
            {!multilingual && (
              <Link href={`/dash/pages/newpage?pagetype=page&schema=${schema.schema}&language=${schema.language || defaultlanguage} `} className="underline">{schema.schema}</Link>
            )}
          </div>
        </div>

      ))}
    </>
  )
}