import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Extrafields = () => {
  /* props */
  const dispatch = useDispatch();
  const currentword = useSelector((state) => state.flashcardSlice.currentword);
  // const othermeanings = props.othermeanings;
  return (
    <div className="fontmedium p-10">
      <div className="extrafields fontmedium">
        {currentword && currentword.word && (
          <>
            {currentword?.Meaning?.WordType && (
              <>
                <span className="semibold ">Word type: </span>
                <span>{currentword?.Meaning?.WordType}</span>
              </>
            )}
            {currentword?.Meaning?.BeginnerTips?.WhenToUse && (
              <div className="fontmedium">
                <span className="semibold ">When to use: </span>
                <span> {currentword?.Meaning?.BeginnerTips?.WhenToUse}</span>
              </div>
            )}

            {currentword?.Meaning?.BeginnerTips?.BeginnerWarning && (
              <div className="fontmedium">
                <span className="semibold ">Beginner Warning: </span>
                <span> {currentword?.Meaning?.BeginnerTips?.BeginnerWarning}</span>
              </div>
            )}
            {currentword?.Meaning?.Explanation && (
              <div className="fontmedium">
                <span className="semibold ">Explanation: </span>
                <span>{currentword?.Meaning?.Explanation}</span>
              </div>
            )}

            {currentword?.Meaning?.CommonFields?.UsageNotes && (
              <div className="fontmedium">
                <span className="semibold ">Usage Notes: </span>
                <span> {currentword?.Meaning?.CommonFields?.UsageNotes}</span>
              </div>
            )}
            {currentword?.Meaning?.LiteralMeaning && (
              <div className="fontmedium mb-4">
                <span className="semibold ">Literal Meaning: </span>
                <span>{currentword?.Meaning?.LiteralMeaning}</span>
              </div>
            )}
            {currentword?.Meaning?.CommonFields?.WordRegister && (
              <div className="fontmedium">
                <span className="semibold ">Word Register: </span>
                <span> {currentword?.Meaning?.CommonFields?.WordRegister}</span>
              </div>
            )}
            {currentword?.Meaning?.BeginnerTips?.TypicalPairings &&
              currentword?.Meaning?.BeginnerTips?.TypicalPairings?.length > 0 && (
                <div className="fontmedium">
                  <span className="semibold ">Typical Pairings: </span>
                  <ul>
                    {currentword?.Meaning?.BeginnerTips?.TypicalPairings.map((pairing, index) => (
                      <li key={index}>{pairing}</li>
                    ))}
                  </ul>
                </div>
              )}

            {currentword?.Meaning?.CommonFields?.Synonyms &&
              currentword?.Meaning?.CommonFields?.Synonyms?.length > 0 && (
                <ul>
                  {currentword?.Meaning?.CommonFields?.Synonyms.map((synonym, index) => (
                    <li key={index}>{synonym}</li>
                  ))}
                </ul>)}

            {currentword?.Meaning?.CommonFields?.Antonyms && currentword?.Meaning?.CommonFields?.Antonyms?.length > 0 && (
              <div className="fontmedium">
                <span className="semibold ">Antonyms: </span>
                <ul>
                  {currentword?.Meaning?.CommonFields?.Antonyms.map((antonym, index) => (
                    <li key={index}>{antonym}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentword?.Meaning?.CommonFields?.Collocations && currentword?.Meaning?.CommonFields?.Collocations?.length > 0 && (
              <div className="fontmedium">
                <span className="semibold ">Collocations: </span>
                <ul>
                  {currentword?.Meaning?.CommonFields?.Collocations.map((collocation, index) => (
                    <li key={index}>{collocation}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentword?.Meaning?.BaseForm &&
              currentword.Meaning.BaseForm !== currentword.word && (
                <>
                  <span className="semibold">Base Form: </span>
                  <span> {currentword?.Meaning?.BaseForm}</span>
                </>
              )}

            {currentword?.Meaning?.CommonErrors && currentword?.Meaning?.CommonErrors?.length > 0 && (
              <>
                <span className="semibold">Common Errors: </span>
                {currentword?.Meaning.CommonErrors.map((error, i) => (
                  <div key={i}>
                    <div>
                      <li>
                        <span className="semibold">Error:</span> {error.Error}
                      </li>
                    </div>
                    <div>
                      <li>
                        {" "}
                        <span className="semibold"> Correct Way:</span>
                        {error.CorrectWay}
                      </li>{" "}
                    </div>
                  </div>
                ))}
              </>
            )}

            {(currentword?.Meaning?.CommonFields?.FixedExpressions && currentword?.Meaning?.CommonFields?.FixedExpressions?.length > 0) && (
              <>
                <p>Fixed Expressions:</p>
                {currentword?.Meaning?.CommonFields?.FixedExpressions.map((expression, index) => (
                  <div key={index}>
                    <p>DE:{expression.ExpressionDE}</p>
                    <p>EN:{expression.ExpressionEN}</p>
                  </div>
                ))}
              </>
            )}

            {(currentword?.Meaning?.CommonFields?.IdiomaticMeanings && currentword?.Meaning?.CommonFields?.IdiomaticMeanings?.length > 0) && (
              <div className="fontmedium">
                <span className="semibold ">Idiomatic Meanings: </span>
                <ul>
                  {currentword?.Meaning?.CommonFields?.IdiomaticMeanings.map((idiom, index) => (
                    <div key={index}>
                      <li>{idiom.Meaning}</li>
                      <li>{idiom.ExampleDE}</li>
                      <li>{idiom.ExampleEN}</li>
                    </div>
                  ))}
                </ul>
              </div>
            )}

            {currentword?.Meaning?.CommonFields?.FalseFriends && currentword?.Meaning?.CommonFields?.FalseFriends?.length > 0 && (
              <div className="fontmedium">
                <span className="semibold ">False Friends: </span>
                <ul>
                  {currentword?.Meaning?.CommonFields?.FalseFriends.map((falsefriend, index) => (
                    <li key={index}>{falsefriend}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>


      <div className="extrafields">
        {
          currentword?.Meaning?.CommonFields?.FalseFriends && currentword?.Meaning?.CommonFields?.FalseFriends.length > 0 && (
            <>

              <div className="fontmedium">
                <span className="semibold ">False Friends: </span>
                <ul>
                  {currentword?.Meaning?.CommonFields?.FalseFriends.map((falsefriend, index) => (
                    <li key={index}>{falsefriend}</li>
                  ))}
                </ul>
              </div>
            </>
          )
        }


        {
          currentword?.Meaning?.WordType === "pronoun" &&
          currentword?.Meaning?.Pronoun && (
            <div>
              <div className="semibold">Pronoun Details:</div>

              <p>Type: {currentword.Meaning.Pronoun.Type}</p>
              <p>Person: {currentword.Meaning.Pronoun.Person}</p>
              <p>Reflexive: {currentword.Meaning.Pronoun.Reflexive ? "Yes" : "No"}</p>

              <div className="semibold">Declined Forms:</div>
              {currentword.Meaning.Pronoun.DeclinedForms?.Singular && (
                <div>
                  <div className="semibold">Singular:</div>
                  <p>Nominative: {currentword.Meaning.Pronoun.DeclinedForms.Singular?.Nom}</p>
                  <p>Genitive: {currentword.Meaning.Pronoun.DeclinedForms.Singular?.Gen}</p>
                  <p>Dative: {currentword.Meaning.Pronoun.DeclinedForms.Singular?.Dat}</p>
                  <p>Accusative: {currentword.Meaning.Pronoun.DeclinedForms.Singular?.Akk}</p>
                </div>
              )}

              {currentword.Meaning.Pronoun.DeclinedForms?.Plural && (
                <div>
                  <div className="semibold">Plural:</div>
                  <p>Nominative: {currentword.Meaning.Pronoun.DeclinedForms.Plural?.Nom}</p>
                  <p>Genitive: {currentword.Meaning.Pronoun.DeclinedForms.Plural?.Gen}</p>
                  <p>Dative: {currentword.Meaning.Pronoun.DeclinedForms.Plural?.Dat}</p>
                  <p>Accusative: {currentword.Meaning.Pronoun.DeclinedForms.Plural?.Akk}</p>
                </div>
              )}
            </div>
          )
        }


        {
          currentword?.Meaning?.WordType === "Noun" &&
          currentword?.Meaning?.Noun && (
            <div>
              <div className="semibold">Noun Details:</div>
              <p>Gender: {currentword.Meaning.Noun.Gender}</p>
              {currentword?.Meaning?.Noun?.PluralForm && (
                <p>
                  Plural Form: {currentword?.Meaning?.Noun.PluralForm.Form}{" "}
                  (Irregular:{" "}
                  {currentword?.Meaning?.Noun?.PluralForm.Irregular
                    ? "Yes"
                    : "No"}
                  )
                </p>
              )}
              <div className="semibold">Case Forms:</div>
              {currentword?.Meaning?.Noun?.CaseForms?.Singular && (
                <div>
                  <div className="semibold">Singular:</div>
                  <p>
                    Gen: {currentword.Meaning.Noun.CaseForms.Singular.Gen}
                  </p>
                  <p>
                    Dat: {currentword.Meaning.Noun.CaseForms.Singular.Dat}
                  </p>
                  <p>
                    Akk: {currentword.Meaning.Noun.CaseForms.Singular.Akk}
                  </p>
                </div>
              )}
              {currentword.Meaning.Noun.CaseForms?.Plural && (
                <div>
                  <div className="semibold">Plural:</div>
                  <p>Gen: {currentword.Meaning.Noun.CaseForms.Plural.Gen}</p>
                  <p>Dat: {currentword.Meaning.Noun.CaseForms.Plural.Dat}</p>
                  <p>Akk: {currentword.Meaning.Noun.CaseForms.Plural.Akk}</p>
                </div>
              )}
            </div>
          )
        }

        {
          currentword?.Meaning?.WordType === "verb" &&
          currentword?.Meaning?.Verb && (
            <div>
              <div className="semibold">Verb Details:</div>
              {currentword?.Meaning?.Verb?.PresentTense && (
                <>
                  <div className="semibold">Present Tense:</div>
                  <p>Ich: {currentword.Meaning.Verb.PresentTense?.ich}</p>
                  <p>Du: {currentword.Meaning.Verb.PresentTense?.du}</p>
                  <p>Er/Sie/Es: {currentword.Meaning.Verb.PresentTense?.["er/sie/es"]}</p>
                  <p>Wir: {currentword.Meaning.Verb.PresentTense?.wir}</p>
                  <p>Ihr: {currentword.Meaning.Verb.PresentTense?.ihr}</p>
                  <p>Sie: {currentword.Meaning.Verb.PresentTense?.sie}</p>
                </>
              )}
              {currentword?.Meaning?.Verb?.Praeteritum && (
                <>
                  <div className="semibold">Präteritum:</div>
                  <p>Ich: {currentword.Meaning.Verb.Praeteritum?.ich}</p>
                  <p>Du: {currentword.Meaning.Verb.Praeteritum?.du}</p>
                  <p>Er/Sie/Es: {currentword.Meaning.Verb.Praeteritum?.["er/sie/es"]}</p>
                  <p>Wir: {currentword.Meaning.Verb.Praeteritum?.wir}</p>
                  <p>Ihr: {currentword.Meaning.Verb.Praeteritum?.ihr}</p>
                  <p>Sie: {currentword.Meaning.Verb.Praeteritum?.sie}</p>
                </>
              )}

              {currentword?.Meaning?.Verb?.PastParticiple && (
                <>
                  <div className="semibold">Past Participle:</div>
                  <p>Participle: {currentword.Meaning.Verb.PastParticiple?.Participle}</p>
                  <p>Auxiliary: {currentword.Meaning.Verb.PastParticiple?.Auxiliary}</p>
                </>
              )}

              {currentword?.Meaning?.Verb?.FutureForm && (
                <>
                  <div className="semibold">Future Form:</div>
                  <p>{currentword.Meaning.Verb.FutureForm}</p>
                </>
              )}

              {currentword?.Meaning?.Verb?.SeparablePrefix && (
                <>
                  <div className="semibold">Imperative:</div>
                  <p>Du: {currentword.Meaning.Verb.Imperative?.du}</p>
                  <p>Wir: {currentword.Meaning.Verb.Imperative?.wir}</p>
                  <p>Ihr: {currentword.Meaning.Verb.Imperative?.ihr}</p>
                </>
              )}

              {currentword?.Meaning?.Verb?.Reflexive && (
                <>
                  <div className="semibold">Reflexive:</div>
                  <p>{currentword.Meaning.Verb.Reflexive ? "Yes" : "No"}</p>
                </>
              )}


              {(currentword.Meaning.Verb.ModalVerbCompatibility?.CompatibleModalVerbs && currentword.Meaning.Verb.ModalVerbCompatibility?.CompatibleModalVerbs.length > 0) && (
                <>
                  <div className="semibold">Compatible Modal Verbs:</div>
                  <ul>
                    {currentword.Meaning.Verb.ModalVerbCompatibility?.CompatibleModalVerbs?.map(
                      (verb, idx) => (
                        <li key={idx}>{verb}</li>
                      )
                    )}
                  </ul>
                </>
              )}
            </div>
          )
        }

        {
          currentword?.Meaning?.WordType === "article" &&
          currentword?.Meaning?.Article && (
            <div>
              <div className="semibold">Article Details:</div>

              {(currentword?.Meaning?.Article?.Nominative?.m || currentword.Meaning.Article.Nominative?.f ||
                currentword.Meaning.Article.Nominative?.n || currentword.Meaning.Article.Nominative?.pl) && (
                  <>
                    <div className="semibold">Nominative:</div>
                    <p>Masculine: {currentword.Meaning.Article.Nominative?.m}</p>
                    <p>Feminine: {currentword.Meaning.Article.Nominative?.f}</p>
                    <p>Neuter: {currentword.Meaning.Article.Nominative?.n}</p>
                    <p>Plural: {currentword.Meaning.Article.Nominative?.pl}</p>
                  </>
                )}

              {(currentword?.Meaning?.Article?.Accusative?.m || currentword.Meaning.Article.Accusative?.f ||
                currentword.Meaning.Article.Accusative?.n || currentword.Meaning.Article.Accusative?.pl) && (
                  <>
                    <div className="semibold">Accusative:</div>
                    <p>Masculine: {currentword.Meaning.Article.Accusative?.m}</p>
                    <p>Feminine: {currentword.Meaning.Article.Accusative?.f}</p>
                    <p>Neuter: {currentword.Meaning.Article.Accusative?.n}</p>
                    <p>Plural: {currentword.Meaning.Article.Accusative?.pl}</p>
                  </>
                )}

              {(currentword?.Meaning?.Article?.Dative?.m || currentword.Meaning.Article.Dative?.f ||
                currentword.Meaning.Article.Dative?.n || currentword.Meaning.Article.Dative?.pl) && (
                  <>
                    <div className="semibold">Dative:</div>
                    <p>Masculine: {currentword.Meaning.Article.Dative?.m}</p>
                    <p>Feminine: {currentword.Meaning.Article.Dative?.f}</p>
                    <p>Neuter: {currentword.Meaning.Article.Dative?.n}</p>
                    <p>Plural: {currentword.Meaning.Article.Dative?.pl}</p>
                  </>
                )}

              {(currentword?.Meaning?.Article?.Genitive?.m || currentword.Meaning.Article.Genitive?.f ||
                currentword.Meaning.Article.Genitive?.n || currentword.Meaning.Article.Genitive?.pl) && (
                  <>
                    <div className="semibold">Genitive:</div>
                    <p>Masculine: {currentword.Meaning.Article.Genitive?.m}</p>
                    <p>Feminine: {currentword.Meaning.Article.Genitive?.f}</p>
                    <p>Neuter: {currentword.Meaning.Article.Genitive?.n}</p>
                    <p>Plural: {currentword.Meaning.Article.Genitive?.pl}</p>
                  </>
                )}

              {(currentword?.Meaning?.Article?.Definiteness || currentword.Meaning.Article?.Paradigm) && (
                <>
                  <div className="semibold">Other Info:</div>
                  <p>Definiteness: {currentword.Meaning.Article.Definiteness}</p>
                  <p>Paradigm: {currentword.Meaning.Article.Paradigm}</p>
                </>
              )}

            </div>
          )
        }

        {
          currentword?.Meaning?.WordType === "adjective" &&
          currentword?.Meaning?.Adjective && (
            <div>
              <div className="semibold">Adjective Details:</div>

              {currentword.Meaning.Adjective.Comparative && (
                <p>Comparative: {currentword.Meaning.Adjective.Comparative}</p>
              )}

              {(currentword.Meaning.Adjective.Superlative?.Predicative ||
                currentword.Meaning.Adjective.Superlative?.Attributive) && (
                  <>
                    <div className="semibold">Superlative:</div>
                    {currentword.Meaning.Adjective.Superlative?.Predicative && (
                      <p>
                        Predicative:{" "}
                        {currentword.Meaning.Adjective.Superlative.Predicative}
                      </p>
                    )}
                    {currentword.Meaning.Adjective.Superlative?.Attributive && (
                      <div>
                        <div className="semibold">Attributive:</div>
                        <p>
                          Masculine:{" "}
                          {currentword.Meaning.Adjective.Superlative.Attributive?.m}
                        </p>
                        <p>
                          Feminine:{" "}
                          {currentword.Meaning.Adjective.Superlative.Attributive?.f}
                        </p>
                        <p>
                          Neuter:{" "}
                          {currentword.Meaning.Adjective.Superlative.Attributive?.n}
                        </p>
                        <p>
                          Plural:{" "}
                          {currentword.Meaning.Adjective.Superlative.Attributive?.pl}
                        </p>
                      </div>
                    )}
                  </>
                )}

              {currentword.Meaning.Adjective.AdverbialUsage !== undefined && (
                <>
                  <div className="semibold">Adverbial Usage:</div>
                  <p>
                    {currentword.Meaning.Adjective.AdverbialUsage ? "Yes" : "No"}
                  </p>
                </>
              )}
            </div>
          )
        }



        {
          currentword?.Meaning?.WordType === "Adverb" &&
          currentword.Adverb && (
            <div>
              <div className="semibold">Adverb Details:</div>
              <p>Category: {currentword.Meaning.Adverb.Category}</p>
              <p>Comparative: {currentword.Meaning.Adverb.Comparative}</p>
              <p>Superlative: {currentword.Meaning.Adverb.Superlative}</p>
            </div>
          )
        }

        {
          currentword?.Meaning?.WordType === "Conjunction" &&
          currentword.Meaning.Conjunction && (
            <div>
              <div className="semibold">Conjunction Details:</div>
              <p>Type: {currentword.Meaning.Conjunction.ConjunctionType}</p>
              {currentword.Meaning.Conjunction.Examples?.map((example, i) => (
                <p key={i}>Example: {example}</p>
              ))}
            </div>
          )
        }

        {
          currentword?.Meaning?.WordType === "Interjection" &&
          currentword.Meaning.Interjection && (
            <div>
              <div className="semibold">Interjection Details:</div>
              {currentword.Meaning.Interjection.Examples?.map(
                (example, i) => (
                  <div key={i}>
                    <p>DE: {example.ExampleSentenceDE}</p>
                    <p>EN: {example.ExampleSentenceENnp}</p>
                  </div>
                )
              )}
            </div>
          )
        }

      </div>
    </div>
  );
};
export default Extrafields;

