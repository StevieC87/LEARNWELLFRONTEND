import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Extrafields = () => {
  /* props */
  const dispatch = useDispatch();
  const currentword = useSelector((state) => state.flashcardSlice.currentword);

  if (!currentword || !currentword.word) return null;

  const M = currentword.Meaning || {};
  const CF = M.CommonFields || {};
  const wt = String(M.WordType || "").toLowerCase();

  // helpers
  const has = (v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== "";
  const join = (v) => (Array.isArray(v) ? v.join(", ") : String(v));
  const V = (v) => (has(v) ? join(v) : null);

  // common/meta fields (render only if present)
  const syn = CF.Synonyms ?? M.Synonyms;
  const ant = CF.Antonyms ?? M.Antonyms;
  const usageNotes = CF.UsageNotes ?? M.UsageNotes;
  const wordRegister =
    CF["Word Register"] ?? CF.WordRegister ?? M["Word Register"] ?? M.WordRegister;
  const collocations = CF.Collocations ?? M.Collocations;
  const commonErrors = CF.CommonErrors ?? M.CommonErrors;
  const fixedExpr = CF.FixedExpressions ?? M.FixedExpressions;

  // sub-objects
  const noun = M.Noun || {};
  const verb = M.Verb || {};
  const adj = M.Adjective || {};
  const pron = M.Pronoun || {};
  const adv = M.Adverb || {};
  const conj = M.Conjunction || {};
  const interj = M.Interjection || {};
  const prep = M.Preposition || {};
  const article = M.Article || M.Determiner || {};
  const numeral = M.Numeral || {};
  const particle = M.Particle || {};
  const prefixInfo = M.Prefix || {};
  const phrase = M.Phrase || {};
  const proper = M.ProperNoun || {};
  const abbr = M.Abbreviation || {};
  const participle = M.Participle || M["Partizip"] || {};
  const separable = M.Separable ?? verb.Separable;

  // small blocks
  const CaseBlock = ({ data, title }) =>
    has(data) ? (
      <>
        <h5>{title}</h5>
        {"Nom" in data && <p>Nom: {data.Nom}</p>}
        {"Gen" in data && <p>Gen: {data.Gen}</p>}
        {"Dat" in data && <p>Dat: {data.Dat}</p>}
        {"Akk" in data && <p>Akk: {data.Akk}</p>}
      </>
    ) : null;

  const DeclBlock = ({ data, title }) =>
    has(data) ? (
      <>
        <h5>{title}</h5>
        {"m" in data && <p>M: {data.m}</p>}
        {"f" in data && <p>F: {data.f}</p>}
        {"n" in data && <p>N: {data.n}</p>}
        {"pl" in data && <p>Pl: {data.pl}</p>}
      </>
    ) : null;

  const Table4 = ({ title, obj }) =>
    has(obj) ? (
      <>
        <h5>{title}</h5>
        <p>M: {obj.m}</p>
        <p>F: {obj.f}</p>
        <p>N: {obj.n}</p>
        <p>Pl: {obj.pl}</p>
      </>
    ) : null;

  return (
    <div className="extrafields fontmedium">
      {/* COMMON META (only if present) */}
      {has(M.BaseForm) && M.BaseForm !== currentword.word && (
        <>
          <p>Base Form: {M.BaseForm}</p>
          <hr className="dotted centeredhr padtop10" />
        </>
      )}
      {has(M.WordType) && <p>Word Type: {M.WordType}</p>}
      {has(wordRegister) && <p>Register: {wordRegister}</p>}
      {has(usageNotes) && <p>Usage Notes: {usageNotes}</p>}
      {has(syn) && <p>Synonyms: {join(syn)}</p>}
      {has(ant) && <p>Antonyms: {join(ant)}</p>}
      {Array.isArray(collocations) && collocations.length > 0 && (
        <div>
          <span>Collocations:</span>
          {collocations.map((c, i) => (
            <div key={i}>{typeof c === "string" ? c : JSON.stringify(c)}</div>
          ))}
        </div>
      )}
      {Array.isArray(commonErrors) && commonErrors.length > 0 && (
        <div>
          <span className="semibold">Common Errors:</span>
          {commonErrors.map((e, i) => (
            <div key={i}>
              {"Error" in e && <li>Error: {e.Error}</li>}
              {"CorrectWay" in e && <li>Correct Way: {e.CorrectWay}</li>}
            </div>
          ))}
        </div>
      )}
      {has(fixedExpr) && (
        <div>
          <h4>Fixed Expressions</h4>
          {Array.isArray(fixedExpr)
            ? fixedExpr.map((x, i) => <div key={i}>{String(x)}</div>)
            : String(fixedExpr)}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* TYPE-SPECIFIC — render ONLY when the word type matches and data exist */}

      {/* Pronoun */}
      {wt.includes("pronoun") && has(pron) && (
        <div>
          <h4>Pronoun Declensions</h4>
          <CaseBlock data={pron.DeclinedForms?.Singular} title="Singular" />
          <CaseBlock data={pron.DeclinedForms?.Plural} title="Plural" />
          {has(pron.Person) && <p>Person: {join(pron.Person)}</p>}
          {has(pron.Gender) && <p>Gender: {join(pron.Gender)}</p>}
          {has(pron.Reflexive) && <p>Reflexive: {String(pron.Reflexive)}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Noun */}
      {wt === "noun" && has(M.Noun) && (
        <div>
          <h4>Noun Details</h4>
          {has(noun.Gender) && <p>Gender: {noun.Gender}</p>}
          {has(noun.PluralForm?.Form) && (
            <p>
              Plural Form: {noun.PluralForm.Form} (Irregular:{" "}
              {noun.PluralForm?.Irregular ? "Yes" : "No"})
            </p>
          )}
          <CaseBlock data={noun.CaseForms?.Singular} title="Case Forms — Singular" />
          <CaseBlock data={noun.CaseForms?.Plural} title="Case Forms — Plural" />
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Verb */}
      {wt === "verb" && has(M.Verb) && (
        <div>
          <h4>Verb Details</h4>
          {"Auxiliary" in verb && <p>Auxiliary Verb: {String(verb.Auxiliary)}</p>}
          {"Modal" in verb && <p>Modal Verb: {String(verb.Modal)}</p>}
          {has(separable) && <p>Separable: {String(separable)}</p>}
          {has(prefixInfo.Prefix) && <p>Prefix: {prefixInfo.Prefix}</p>}
          {has(verb.StemChange) && <p>Stem Change: {verb.StemChange}</p>}

          {has(verb.PresentTense) && (
            <>
              <h5>Present Tense</h5>
              {"ich" in verb.PresentTense && <p>Ich: {verb.PresentTense.ich}</p>}
              {"du" in verb.PresentTense && <p>Du: {verb.PresentTense.du}</p>}
              {"er/sie/es" in verb.PresentTense && (
                <p>Er/Sie/Es: {verb.PresentTense["er/sie/es"]}</p>
              )}
              {"wir" in verb.PresentTense && <p>Wir: {verb.PresentTense.wir}</p>}
              {"ihr" in verb.PresentTense && <p>Ihr: {verb.PresentTense.ihr}</p>}
              {"sie" in verb.PresentTense && <p>Sie: {verb.PresentTense.sie}</p>}
            </>
          )}

          {has(verb.Präteritum || verb.Prateritum) && (
            <>
              <h5>Präteritum</h5>
              {Object.entries(verb.Präteritum || verb.Prateritum).map(([k, v]) => (
                <p key={k}>
                  {k}: {v}
                </p>
              ))}
            </>
          )}

          {has(verb.PastParticiple) && (
            <>
              <h5>Past Participle</h5>
              {"Participle" in verb.PastParticiple && (
                <p>Participle: {verb.PastParticiple.Participle}</p>
              )}
              {"Auxiliary" in verb.PastParticiple && (
                <p>Auxiliary: {verb.PastParticiple.Auxiliary}</p>
              )}
            </>
          )}

          {has(verb.Imperative) && (
            <>
              <h5>Imperative</h5>
              {"du" in verb.Imperative && <p>Du: {verb.Imperative.du}</p>}
              {"wir" in verb.Imperative && <p>Wir: {verb.Imperative.wir}</p>}
              {"ihr" in verb.Imperative && <p>Ihr: {verb.Imperative.ihr}</p>}
            </>
          )}

          {has(verb.Frames) && <p>Frames: {join(verb.Frames)}</p>}
          {has(verb.Transitivity) && <p>Transitivity: {verb.Transitivity}</p>}
          {has(verb.Reflexive) && <p>Reflexive: {String(verb.Reflexive)}</p>}

          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Adjective */}
      {wt === "adjective" && has(M.Adjective) && (
        <div>
          <h4>Adjective Details</h4>
          <DeclBlock data={adj.DeclinedForms?.Nominative} title="Nominative" />
          <DeclBlock data={adj.DeclinedForms?.Accusative} title="Accusative" />
          <DeclBlock data={adj.DeclinedForms?.Dative} title="Dative" />
          <DeclBlock data={adj.DeclinedForms?.Genitive} title="Genitive" />
          {has(adj.Comparative) && <p>Comparative: {adj.Comparative}</p>}
          {has(adj.Superlative?.Predicative) && (
            <p>Superlative: {adj.Superlative.Predicative}</p>
          )}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Adverb */}
      {wt === "adverb" && has(M.Adverb) && (
        <div>
          <h4>Adverb Details</h4>
          {"Category" in adv && <p>Category: {adv.Category}</p>}
          {"Comparative" in adv && <p>Comparative: {adv.Comparative}</p>}
          {"Superlative" in adv && <p>Superlative: {adv.Superlative}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Conjunction */}
      {wt === "conjunction" && has(M.Conjunction) && (
        <div>
          <h4>Conjunction Details</h4>
          {"ConjunctionType" in conj && <p>Type: {conj.ConjunctionType}</p>}
          {"SubclauseVerbFinal" in conj && (
            <p>Subclause Verb-Final: {String(conj.SubclauseVerbFinal)}</p>
          )}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Interjection */}
      {wt === "interjection" && has(M.Interjection) && (
        <div>
          <h4>Interjection</h4>
          {"Subtype" in interj && <p>Subtype: {interj.Subtype}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Preposition */}
      {wt === "preposition" && has(M.Preposition) && (
        <div>
          <h4>Preposition Details</h4>
          {"Government" in prep && <p>Governs Case: {prep.Government}</p>}
          {"AltWithMotion" in prep && <p>Alternate with Motion: {prep.AltWithMotion}</p>}
          {"TwoWayNotes" in prep && <p>Two-way Case Notes: {prep.TwoWayNotes}</p>}
          {Array.isArray(prep.FixedCombos) && prep.FixedCombos.length > 0 && (
            <div>
              <h5>Fixed Combinations</h5>
              {prep.FixedCombos.map((c, i) => (
                <div key={i}>{String(c)}</div>
              ))}
            </div>
          )}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Article / Determiner */}
      {(wt === "article" || wt === "determiner") && has(article) && (
        <div>
          <h4>Article / Determiner Paradigm</h4>
          {Table4({ title: "Nominative", obj: article.Nominative || article.Nom })}
          {Table4({ title: "Accusative", obj: article.Accusative || article.Akk })}
          {Table4({ title: "Dative", obj: article.Dative || article.Dat })}
          {Table4({ title: "Genitive", obj: article.Genitive || article.Gen })}
          {"Definiteness" in article && <p>Definiteness: {article.Definiteness}</p>}
          {"Paradigm" in article && <p>Paradigm Type: {article.Paradigm}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Numeral */}
      {wt === "numeral" && has(M.Numeral) && (
        <div>
          <h4>Numeral</h4>
          {"Cardinal" in numeral && <p>Cardinal: {numeral.Cardinal}</p>}
          {"Ordinal" in numeral && <p>Ordinal: {numeral.Ordinal}</p>}
          {has(numeral.Declension) &&
            Object.entries(numeral.Declension).map(([cs, tbl]) => (
              <div key={cs}>
                <DeclBlock data={tbl} title={cs} />
              </div>
            ))}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Particle */}
      {wt === "particle" && has(M.Particle) && (
        <div>
          <h4>Particle</h4>
          {"Subtype" in particle && <p>Subtype: {particle.Subtype}</p>}
          {has(particle.Functions) && <p>Functions: {join(particle.Functions)}</p>}
          {"Negation" in particle && <p>Negation: {String(particle.Negation)}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Proper Noun */}
      {wt === "propernoun" && has(M.ProperNoun) && (
        <div>
          <h4>Proper Noun</h4>
          {"Category" in proper && <p>Category: {proper.Category}</p>}
          {"Gender" in proper && <p>Gender: {proper.Gender}</p>}
          {"Plural" in proper && <p>Plural: {proper.Plural}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Abbreviation */}
      {wt === "abbreviation" && has(M.Abbreviation) && (
        <div>
          <h4>Abbreviation</h4>
          {"Expanded" in abbr && <p>Expanded Form: {abbr.Expanded}</p>}
          {"Domain" in abbr && <p>Domain: {abbr.Domain}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Phrase */}
      {wt === "phrase" && has(M.Phrase) && (
        <div>
          <h4>Phrase</h4>
          {"Register" in phrase && <p>Register: {phrase.Register}</p>}
          {"LiteralGloss" in phrase && <p>Literal Gloss: {phrase.LiteralGloss}</p>}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}

      {/* Stand-alone Participle entry */}
      {wt === "participle" && has(participle) && (
        <div>
          <h4>Participle</h4>
          {typeof participle === "string"
            ? <p>{participle}</p>
            : Object.entries(participle).map(([k, v]) => (
              <p key={k}>
                {k}: {String(v)}
              </p>
            ))}
          <hr className="dotted centeredhr padtop10" />
        </div>
      )}
    </div>
  );
}

export default Extrafields;

{
  /*  {othermeanings?.length > 1 ? (
            <>
              <span> Word can also mean: </span>
              {othermeanings.map((word, index) => (
                <span key={index}>
                  {word.Meaning.Meaning}
                  {index !== othermeanings.length - 1 && <span>, </span>}
                </span>
              ))}
            </>
          ) : (
            <div className="bold"></div>
          )} */
}

{
  /* Common Fields */
}
{
  /* <div>
            <hr className="dotted"></hr>
            <div className="fontmedium underline semibold">Examples:</div>
            <div className="examples fontmedium">
              {currentword?.Meaning?.CommonFields?.Examples?.map(
                (example, i) => (
                  <div key={i}>
                    <div>
                      {" "}
                      <li> {example.ExampleSentenceDE}</li>
                    </div>
                    <div>
                      {" "}
                      <li>
                        {example.ExampleSentenceENnp ||
                          example.ExampleSentenceEN}{" "}
                      </li>
                    </div>
                    <hr className="dotted  centeredhr padtop10"></hr>
                  </div>
                )
              )}
            </div>
          </div> */
}

{
  /* <div className="extrafields__word">{currentword.word}</div>  */
}
{
  /* <h2>Meaning: {currentword.Meaning}</h2> */
}
{
  /* Explanation: */
}
