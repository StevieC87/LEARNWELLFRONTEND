export const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/about`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  }
);
