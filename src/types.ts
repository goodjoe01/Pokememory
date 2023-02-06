
export type results = {
  name: string;
  url: string;
}

export type response = {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: results[];
}

export type pokemon = {
  id: number;
  index?: number;
  name: string;
  image: string;
  flipped: boolean;
}

