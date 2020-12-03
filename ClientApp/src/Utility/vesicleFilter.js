function Search(vesicles, search) {
  if (search === "") return vesicles;

  let result = vesicles.filter((c) =>
    c.plateNo.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = vesicles.filter((c) =>
    c.owner.name.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = vesicles.filter((c) =>
    c.type.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = vesicles.filter((c) => c.hp.toLocaleLowerCase().startsWith(search));

  if (result.length !== 0) return result;

  return result;
}

export default Search;
