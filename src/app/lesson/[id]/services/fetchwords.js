/* http://localhost:3001/api/flashcardremaining/
      url = `http://localhost:3001/api/flashcardknownwords/`;
   */

export const getFlashcardsKnownWords = async (wordstart, wordend) => {
  try {
    let url = `http://localhost:3001/api/flashcardknownwords?wordstart=${wordstart}&wordend=${wordend}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Error fetching (known) flashcards");
      return null;
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // console.log(data.length, 'dataLENGTH');
      // console.log(data, "data123123123");
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error fetching (known) flashcards" + error);
  }
  /* */
};

export const getFlashcardsRemaining = async (wordstart, wordend) => {
  let url = `http://localhost:3001/api/flashcardremainingSPLITCARDS?wordstart=${wordstart}&wordend=${wordend}`;
  console.log(url, "urlurlurlurlurlurl");
  const response = await fetch(url);

  if (!response.ok) {
    console.log("Error fetching (remaining) flashcards");
  }

  const data = await response.json();
  //console.log(data, "data123123123");
  return data;
};

export const flashcardsUserSaveWord = async (wordtosubmit) => {
  console.log(wordtosubmit, "wordtosubmit555555");
  let wordtosubmit1 = wordtosubmit;
  let stringified = JSON.stringify(wordtosubmit1);
  console.log(stringified, "stringified");
  console.log(wordtosubmit1, "wordtosubmit2222444");
  try {
    const response = await fetch(
      "http://localhost:3001/api/flashcardsusersaveword/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wordtosubmit1),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log("Error saving flashcard word");
    }
    return data;
  } catch (error) {
    console.log("Error saving flashcard word", error);
  }
};
