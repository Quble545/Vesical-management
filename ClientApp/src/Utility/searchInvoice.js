function Filter(tickets, search) {
  if (
    search.customer !== "All" &&
    search.type !== "All" &&
    search.start !== "" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.type == search.type &&
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.customer !== "All" &&
    search.type !== "All" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.type == search.type &&
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
    search.type !== "All" &&
    search.start !== "" &&
    search.end !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.type == search.type &&
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (
    search.customer !== "All" &&
    search.type !== "All" &&
    search.start !== ""
  ) {
    return tickets.filter(
      (t) =>
        t.customer == search.customer &&
        t.type == search.type &&
        handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.customer !== "All" && search.type !== "All") {
    return tickets.filter(
      (t) => t.customer == search.customer && t.type == search.type
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
  } else if (search.type !== "All" && search.start !== "") {
    return tickets.filter(
      (t) =>
        t.type == search.type && handleDate(t.date) >= handleDate(search.start)
    );
  } else if (search.type !== "All" && search.end !== "") {
    return tickets.filter(
      (t) =>
        t.type == search.type && handleDate(t.date) <= handleDate(search.end)
    );
  } else if (search.end !== "" && search.start !== "") {
    return tickets.filter(
      (t) =>
        handleDate(t.date) >= handleDate(search.start) &&
        handleDate(t.date) <= handleDate(search.end)
    );
  } else if (search.customer !== "All") {
    return tickets.filter((t) => t.customer == search.customer);
  } else if (search.type !== "All") {
    return tickets.filter((t) => t.type == search.type);
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
