function Search(supplier, search) {
  if (search === "") return supplier;

  let result = supplier.filter((c) =>
    c.name.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = supplier.filter((c) =>
    c.email.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = supplier.filter((c) =>
    c.phone.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = supplier.filter((c) =>
    c.mobile.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = supplier.filter((c) =>
    c.address.toLocaleLowerCase().startsWith(search)
  );

  return result;
}

export default Search;
