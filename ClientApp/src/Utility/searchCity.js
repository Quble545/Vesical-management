function Search(cities, search) {
  if (search === "") return cities;

  let result = cities.filter((c) =>
    c.name.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = cities.filter((c) => c.code.toLocaleLowerCase().startsWith(search));

  return result;
}

export default Search;
