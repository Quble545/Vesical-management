function Filter(tickets, search) {
  if (
    search.customer !== "All" &&
    search.supplier !== "All" &&
    search.start !== "" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.supplier == search.supplier &&
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.customer !== "All" &&
    search.supplier !== "All" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.supplier == search.supplier &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.customer !== "All" &&
    search.start !== "" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.supplier !== "All" &&
    search.start !== "" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.supplier == search.supplier &&
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.customer !== "All" &&
    search.supplier !== "All" &&
    search.start !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.supplier == search.supplier &&
        handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.customer !== "All" && search.supplier !== "All") {
    return tickets.filter(
      (t) => t.customer == search.customer && t.supplier == search.supplier
    );
  } else if (search.customer !== "All" && search.start !== "") {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.customer !== "All" && search.end !== "") {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (search.supplier !== "All" && search.start !== "") {
    return tickets.filter(
      (t) =>
        t.supplier == search.supplier &&
        handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.supplier !== "All" && search.end !== "") {
    return tickets.filter(
      (t) =>
        t.supplier == search.supplier &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (search.end !== "" && search.start !== "") {
    return tickets.filter(
      (t) =>
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (search.customer !== "All") {
    return tickets.filter((t) => t.customer == search.customer);
  } else if (search.supplier !== "All") {
    return tickets.filter((t) => t.supplier == search.supplier);
  } else if (search.start !== "") {
    return tickets.filter(
      (t) => handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.end !== "") {
    return tickets.filter((t) => handleDate(t.date) <= handleDate(search.end));
  } else {
    return tickets;
  }
}
const handleDate = (date) => {
  return new Date(date);
};
export default Filter;
