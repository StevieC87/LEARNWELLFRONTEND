/* http://localhost:3001/api/flashcardremaining/
      url = `http://localhost:3001/api/flashcardknownwords/`;
   */

export const getFlashcardsKnownWords = async (wordstart, wordend) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/flashcardknownwords?wordstart=${wordstart}&wordend=${wordend}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials for session management
    });
    if (!response.ok) {
      console.log("Error fetching (known) flashcards");
      return null;
    }

    const data = await response.json();
    if (data) {
      if (Array.isArray(data) && data.length > 0) {
        // console.log(data.length, 'dataLENGTH');
        // console.log(data, "data123123123");
        return data;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.log("Error fetching (known) flashcards" + error);
  }
  /* */
};

export const getFlashcardsRemaining = async (wordstart, wordend) => {
  try {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/flashcardremainingSPLITCARDS?wordstart=${wordstart}&wordend=${wordend}`;
    console.log(url, "urlurlurlurlurlurl");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.log("Error fetching (remaining) flashcards");
    }

    const data = await response.json();
    if (data) {
      console.log(data, "data123123123");
    }
    return data;
  } catch (error) {
    console.log("Error fetching (remaining) flashcards", error);
  }
};

export const flashcardsUserSaveWord = async (wordtosubmit) => {
  console.log(wordtosubmit, "wordtosubmit555555");
  let wordtosubmit1 = wordtosubmit;
  let stringified = JSON.stringify(wordtosubmit1);
  console.log(stringified, "stringified");
  console.log(wordtosubmit1, "wordtosubmit2222444");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/flashcardsusersaveword/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wordtosubmit1),
        credentials: "include", // Include credentials for session management
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
