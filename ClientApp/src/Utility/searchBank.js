function Search(bankAccount, search) {
  if (search === "") return bankAccount;

  let result = bankAccount.filter((c) =>
    c.bank.toLocaleLowerCase().startsWith(search)
  );

  if (result.length !== 0) return result;

  result = bankAccount.filter((c) =>
    c.account.toLocaleLowerCase().startsWith(search)
  );

  return result;
}

export default Search;
