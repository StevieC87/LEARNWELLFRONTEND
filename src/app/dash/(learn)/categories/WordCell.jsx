// Shows one language of an entry: the word plus its grammar details (gender, plural, endings, verb forms…).
const COLS = { EN: 'ENWord', FR: 'FRWord', DE: 'DEWord', GR: 'GRWord' };

const details = (t) => {
    if (!t) return [];
    const x = t.extra || {};
    return [
        t.gender && `(${t.gender})`,
        t.plural && `pl. ${t.plural}`,
        x.feminine && `f. ${x.feminine}`,
        x.endings,
        x.genitive && `gen. ${x.genitive}`,
        x.parts || x.irregular,
        x.aorist && `aor. ${x.aorist}`,
        x.aux && `+ ${x.aux}`,
        x.case && `+ ${x.case}`,
        x.us_spelling && `US ${x.us_spelling}`,
        t.alternatives?.length && `also: ${t.alternatives.join(', ')}`,
    ].filter(Boolean);
};

export default function WordCell({ word, lang }) {
    const label = lang === 'EN' && [word.register, word.gloss, word.formality].filter(Boolean).join(', ');
    const info = details(word.translations?.[lang]);
    return (
        <>
            {word[COLS[lang]] ?? ''}
            {label && <span className="text-gray-500"> ({label})</span>}
            {info.length > 0 && <div className="text-xs text-gray-500">{info.join(' · ')}</div>}
        </>
    );
}
