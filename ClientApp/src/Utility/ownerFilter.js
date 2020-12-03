function Search(owner, search) {
  if (search === "") return owner;

  let result = owner.filter((c) =>
    c.name.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = owner.filter((c) => c.phone.startsWith(search));

  return result;
}

export default Search;
