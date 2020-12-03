function Search(users, search) {
  if (search === "") return users;

  let result = users.filter((c) =>
    c.name.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = users.filter((c) => c.email.toLocaleLowerCase().startsWith(search));

  if (result.length !== 0) return result;

  result = users.filter((c) => c.phone.toLocaleLowerCase().startsWith(search));

  if (result.length !== 0) return result;

  result = users.filter((c) =>
    c.username.toLocaleLowerCase().startsWith(search)
  );

  return result;
}

export default Search;
